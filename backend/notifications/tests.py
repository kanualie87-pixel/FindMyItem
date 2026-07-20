from django.contrib.auth import get_user_model
from django.test import TestCase

from items.models import Claim, Item
from messaging.models import Conversation, Message

from .models import Notification

User = get_user_model()


class NotificationSignalTests(TestCase):
    def setUp(self):
        self.alice = User.objects.create_user(
            username='alice', email='alice@example.com', password='pw12345'
        )
        self.bob = User.objects.create_user(
            username='bob', email='bob@example.com', password='pw12345'
        )

    def test_new_item_notifies_other_users(self):
        Item.objects.create(owner=self.alice, title='Lost keys')
        # Bob (another user) should be notified; Alice (owner) should not.
        self.assertTrue(
            Notification.objects.filter(
                recipient=self.bob, kind=Notification.Kind.ITEM_NEW
            ).exists()
        )
        self.assertFalse(
            Notification.objects.filter(recipient=self.alice).exists()
        )

    def test_new_message_notifies_other_participant(self):
        convo = Conversation.objects.create()
        convo.participants.add(self.alice, self.bob)
        Message.objects.create(conversation=convo, sender=self.alice, text='hi')
        self.assertTrue(
            Notification.objects.filter(
                recipient=self.bob, kind=Notification.Kind.MESSAGE
            ).exists()
        )

    def test_claim_lifecycle_notifications(self):
        item = Item.objects.create(owner=self.alice, title='Found wallet')
        claim = Claim.objects.create(item=item, claimant=self.bob, message='mine')
        # Owner (Alice) gets a "new claim" notification.
        self.assertTrue(
            Notification.objects.filter(
                recipient=self.alice, kind=Notification.Kind.CLAIM
            ).exists()
        )
        # Approving it notifies the claimant (Bob).
        claim.status = Claim.Status.APPROVED
        claim.save()
        self.assertTrue(
            Notification.objects.filter(
                recipient=self.bob, kind=Notification.Kind.CLAIM_APPROVED
            ).exists()
        )
