from asgiref.sync import async_to_sync
from channels.testing import WebsocketCommunicator
from django.contrib.auth import get_user_model
from django.test import TransactionTestCase
from rest_framework_simplejwt.tokens import AccessToken

from findmyitem.asgi import application

from .models import Conversation, Message

User = get_user_model()


class ChatConsumerTests(TransactionTestCase):
    """End-to-end WebSocket tests for the WhatsApp-style chat consumer."""

    def setUp(self):
        self.alice = User.objects.create_user(
            username='alice', email='alice@example.com', password='pw12345'
        )
        self.bob = User.objects.create_user(
            username='bob', email='bob@example.com', password='pw12345'
        )
        self.convo = Conversation.objects.create()
        self.convo.participants.add(self.alice, self.bob)

    def _connect(self, user):
        token = str(AccessToken.for_user(user))
        communicator = WebsocketCommunicator(
            application, f'/ws/chat/{self.convo.id}/?token={token}'
        )
        connected, _ = async_to_sync(communicator.connect)()
        self.assertTrue(connected)
        return communicator

    def test_message_send_receive_and_read_receipt(self):
        async_to_sync(self._run_flow)()

    async def _run_flow(self):
        alice = await self._aconnect(self.alice)
        bob = await self._aconnect(self.bob)

        # Alice sends a message; both sides receive it tagged type=message.
        await alice.send_json_to({'type': 'message', 'text': 'Hi Bob'})
        received = await bob.receive_json_from()
        while received.get('type') != 'message':
            received = await bob.receive_json_from()
        self.assertEqual(received['text'], 'Hi Bob')
        message_id = received['id']

        # Bob reads it -> Alice should get a "read" receipt for that message.
        await bob.send_json_to({'type': 'read'})
        event = await alice.receive_json_from()
        while event.get('type') != 'read':
            event = await alice.receive_json_from()
        self.assertIn(message_id, event['message_ids'])
        self.assertEqual(event['by'], self.bob.id)

        await alice.disconnect()
        await bob.disconnect()

    async def _aconnect(self, user):
        token = str(AccessToken.for_user(user))
        communicator = WebsocketCommunicator(
            application, f'/ws/chat/{self.convo.id}/?token={token}'
        )
        connected, _ = await communicator.connect()
        assert connected
        return communicator

    def test_non_participant_is_rejected(self):
        stranger = User.objects.create_user(
            username='eve', email='eve@example.com', password='pw12345'
        )
        token = str(AccessToken.for_user(stranger))

        async def run():
            communicator = WebsocketCommunicator(
                application, f'/ws/chat/{self.convo.id}/?token={token}'
            )
            connected, _ = await communicator.connect()
            await communicator.disconnect()
            return connected

        self.assertFalse(async_to_sync(run)())
