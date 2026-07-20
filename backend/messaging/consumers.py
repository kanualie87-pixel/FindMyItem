import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from .models import Conversation, Message
from .serializers import MessageSerializer


class ChatConsumer(WebsocketConsumer):
    """Real-time, WhatsApp-style chat for a single conversation.

    Connect to:  ws://host/ws/chat/<conversation_id>/?token=<access_jwt>

    The client sends JSON with a ``type``:
        {"type": "message", "text": "hi"}   -> post a message
        {"type": "typing",  "state": true}  -> typing indicator on/off
        {"type": "read"}                    -> mark the other side's messages read

    The server pushes JSON, also tagged with ``type``:
        message    -> a new serialized Message
        typing     -> {user_id, username, state}
        delivered  -> {message_ids, by}   double grey ticks
        read       -> {message_ids, by}   blue ticks
        presence   -> {user_id, username, online}
    """

    def connect(self):
        self.user = self.scope.get('user')
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.group_name = f'chat_{self.conversation_id}'

        # Reject anonymous users or non-participants.
        if not self.user or not self.user.is_authenticated:
            self.close(code=4001)
            return
        if not self._is_participant():
            self.close(code=4003)
            return

        async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
        self.accept()

        # Being here means anything sent to us earlier is now "delivered".
        delivered_ids = self._mark_delivered()
        if delivered_ids:
            self._broadcast('chat.delivered', message_ids=delivered_ids, by=self.user.id)

        # Announce that we just came online in this thread.
        self._broadcast(
            'chat.presence', user_id=self.user.id,
            username=self.user.username, online=True,
        )

    def disconnect(self, code):
        if hasattr(self, 'group_name'):
            self._broadcast(
                'chat.presence', user_id=self.user.id,
                username=self.user.username, online=False,
            )
            async_to_sync(self.channel_layer.group_discard)(
                self.group_name, self.channel_name
            )

    def receive(self, text_data=None, bytes_data=None):
        try:
            data = json.loads(text_data or '{}')
        except json.JSONDecodeError:
            return

        msg_type = data.get('type', 'message')
        if msg_type == 'typing':
            self._handle_typing(bool(data.get('state')))
        elif msg_type == 'read':
            self._handle_read()
        else:
            self._handle_message((data.get('text') or '').strip())

    # ----- inbound handlers -------------------------------------------------

    def _handle_message(self, text):
        if not text:
            return
        message = Message.objects.create(
            conversation_id=self.conversation_id,
            sender=self.user,
            text=text,
        )
        # Touch the conversation so it sorts to the top of the list.
        Conversation.objects.filter(pk=self.conversation_id).update(
            updated_at=message.created_at
        )
        self._broadcast('chat.message', message=MessageSerializer(message).data)

    def _handle_typing(self, state):
        self._broadcast(
            'chat.typing', user_id=self.user.id,
            username=self.user.username, state=state,
        )

    def _handle_read(self):
        ids = list(
            Message.objects
            .filter(conversation_id=self.conversation_id, is_read=False)
            .exclude(sender=self.user)
            .values_list('id', flat=True)
        )
        if not ids:
            return
        Message.objects.filter(id__in=ids).update(is_delivered=True, is_read=True)
        self._broadcast('chat.read', message_ids=ids, by=self.user.id)

    # ----- group event handlers (server -> this socket) ---------------------

    def chat_message(self, event):
        self.send(text_data=json.dumps({'type': 'message', **event['message']}))

    def chat_typing(self, event):
        if event['user_id'] == self.user.id:
            return  # don't show my own typing back to me
        self._send('typing', user_id=event['user_id'],
                   username=event['username'], state=event['state'])

    def chat_delivered(self, event):
        self._send('delivered', message_ids=event['message_ids'], by=event['by'])

    def chat_read(self, event):
        self._send('read', message_ids=event['message_ids'], by=event['by'])

    def chat_presence(self, event):
        if event['user_id'] == self.user.id:
            return
        self._send('presence', user_id=event['user_id'],
                   username=event['username'], online=event['online'])
        # Presence handshake: when someone comes online, reply once so THEY
        # learn that we're already here (their connect happened after ours).
        if event['online'] and not event.get('reply'):
            self._broadcast(
                'chat.presence', user_id=self.user.id,
                username=self.user.username, online=True, reply=True,
            )

    # ----- helpers ----------------------------------------------------------

    def _broadcast(self, msg_type, **payload):
        async_to_sync(self.channel_layer.group_send)(
            self.group_name, {'type': msg_type, **payload}
        )

    def _send(self, msg_type, **payload):
        self.send(text_data=json.dumps({'type': msg_type, **payload}))

    def _is_participant(self):
        return Conversation.objects.filter(
            pk=self.conversation_id, participants=self.user
        ).exists()

    def _mark_delivered(self):
        ids = list(
            Message.objects
            .filter(conversation_id=self.conversation_id, is_delivered=False)
            .exclude(sender=self.user)
            .values_list('id', flat=True)
        )
        if ids:
            Message.objects.filter(id__in=ids).update(is_delivered=True)
        return ids
