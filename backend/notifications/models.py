from django.conf import settings
from django.db import models


class Notification(models.Model):
    """A single in-app notification addressed to one user.

    Notifications are created automatically by the signal receivers in
    ``signals.py`` whenever something interesting happens (a new chat message,
    a claim on an item, an item being reported, ...) and are delivered to the
    frontend both over REST (history) and live over a WebSocket.
    """

    class Kind(models.TextChoices):
        MESSAGE = 'message', 'New message'
        CLAIM = 'claim', 'New claim'
        CLAIM_APPROVED = 'claim_approved', 'Claim approved'
        CLAIM_REJECTED = 'claim_rejected', 'Claim rejected'
        ITEM_NEW = 'item_new', 'New item reported'
        ITEM_RESOLVED = 'item_resolved', 'Item resolved'
        SYSTEM = 'system', 'System'

    # Who receives this notification.
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    # Who (if anyone) triggered it. Kept for display ("Alice sent you...").
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='+',
    )
    kind = models.CharField(max_length=20, choices=Kind.choices, default=Kind.SYSTEM)
    title = models.CharField(max_length=150)
    body = models.CharField(max_length=300, blank=True)

    # A frontend route the user should be taken to when they click it,
    # e.g. "/messages?c=3" or "/items/7".
    url = models.CharField(max_length=300, blank=True)

    # Optional links back to the objects involved (nulled if they're deleted).
    item = models.ForeignKey(
        'items.Item',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='+',
    )
    conversation = models.ForeignKey(
        'messaging.Conversation',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='+',
    )

    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
        ]

    def __str__(self):
        return f'To {self.recipient}: {self.title}'
