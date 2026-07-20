import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class NotificationConsumer(WebsocketConsumer):
    """Live notification stream for the logged-in user.

    Connect to:  ws://host/ws/notifications/?token=<access_jwt>
    Receive:     the serialized Notification, the moment it is created.

    Authentication is handled by ``messaging.middleware.JWTAuthMiddleware``,
    which puts the user on the connection scope from the ?token= query param.
    """

    def connect(self):
        self.user = self.scope.get('user')
        if not self.user or not self.user.is_authenticated:
            self.close(code=4001)
            return

        self.group_name = f'notifications_{self.user.id}'
        async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
        self.accept()

    def disconnect(self, code):
        if hasattr(self, 'group_name'):
            async_to_sync(self.channel_layer.group_discard)(
                self.group_name, self.channel_name
            )

    def notify_message(self, event):
        """Handler for messages sent to the group by services.notify()."""
        self.send(text_data=json.dumps(event['notification']))
