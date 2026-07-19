import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from .models import Conversation, Message
from .serializers import MessageSerializer


class ChatConsumer(WebsocketConsumer):
    """Real-time chat for a single conversation.

    Connect to:  ws://host/ws/chat/<conversation_id>/?token=<access_jwt>
    Send:        {"text": "hello"}
    Receive:     the serialized Message, broadcast to every participant.
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

    def disconnect(self, code):
        if hasattr(self, 'group_name'):
            async_to_sync(self.channel_layer.group_discard)(
                self.group_name, self.channel_name
            )

    def receive(self, text_data=None, bytes_data=None):
        try:
            data = json.loads(text_data or '{}')
        except json.JSONDecodeError:
            return
        text = (data.get('text') or '').strip()
        if not text:
            return

        message = Message.objects.create(
            conversation_id=self.conversation_id,
            sender=self.user,
            text=text,
        )
        # Touch the conversation so it sorts to the top.
        Conversation.objects.filter(pk=self.conversation_id).update(
            updated_at=message.created_at
        )

        payload = MessageSerializer(message).data
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {'type': 'chat.message', 'message': payload},
        )

    def chat_message(self, event):
        self.send(text_data=json.dumps(event['message']))

    def _is_participant(self):
        return Conversation.objects.filter(
            pk=self.conversation_id, participants=self.user
        ).exists()
