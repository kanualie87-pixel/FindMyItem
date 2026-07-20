from django.apps import AppConfig


class NotificationsConfig(AppConfig):
    name = 'notifications'
    verbose_name = 'Notifications'

    def ready(self):
        # Connect the signal receivers that create notifications when things
        # happen elsewhere in the app (new messages, claims, items, ...).
        from . import signals  # noqa: F401
