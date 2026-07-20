"""ASGI config for FINDMYITEM -- routes HTTP to Django and WS to Channels."""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'findmyitem.settings')

# Initialise Django before importing anything that touches models.
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter  # noqa: E402

from messaging.middleware import JWTAuthMiddleware  # noqa: E402
from messaging.routing import websocket_urlpatterns as chat_ws_urlpatterns  # noqa: E402
from notifications.routing import websocket_urlpatterns as notification_ws_urlpatterns  # noqa: E402

# Both the chat and notification sockets authenticate the same way (?token=)
# and share one router.
websocket_urlpatterns = chat_ws_urlpatterns + notification_ws_urlpatterns

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': JWTAuthMiddleware(URLRouter(websocket_urlpatterns)),
})
