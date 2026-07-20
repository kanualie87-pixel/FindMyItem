from rest_framework import serializers

from accounts.serializers import UserSerializer

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    actor = UserSerializer(read_only=True)
    kind_display = serializers.CharField(source='get_kind_display', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'kind', 'kind_display', 'actor', 'title', 'body',
            'url', 'item', 'conversation', 'is_read', 'created_at',
        ]
        read_only_fields = fields
