"""Helpers for creating and delivering notifications.

``notify()`` is the single entry point used by the signal receivers. It writes
the notification to the database and then pushes it in real time to the
recipient's personal WebSocket group so the bell updates instantly.
"""
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import Notification
from .serializers import NotificationSerializer


def user_group(user_id):
    """Name of the per-user channel-layer group for live notifications."""
    return f'notifications_{user_id}'


def notify(recipient, kind, title, *, actor=None, body='', url='',
           item=None, conversation=None):
    """Create a Notification for ``recipient`` and push it over the WebSocket.

    Never raises on the delivery side: if the channel layer is unavailable the
    notification is still saved and will show up next time the user loads.
    """
    # Don't notify people about their own actions.
    if actor is not None and getattr(actor, 'id', None) == getattr(recipient, 'id', None):
        return None

    notification = Notification.objects.create(
        recipient=recipient,
        actor=actor,
        kind=kind,
        title=title,
        body=body,
        url=url,
        item=item,
        conversation=conversation,
    )

    payload = NotificationSerializer(notification).data
    try:
        channel_layer = get_channel_layer()
        if channel_layer is not None:
            async_to_sync(channel_layer.group_send)(
                user_group(recipient.id),
                {'type': 'notify.message', 'notification': payload},
            )
    except Exception:
        # Real-time delivery is best-effort; the DB row is the source of truth.
        pass

    return notification
