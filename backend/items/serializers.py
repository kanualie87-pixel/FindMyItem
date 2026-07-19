from rest_framework import serializers

from accounts.serializers import UserSerializer

from .models import Claim, Item


class ClaimSerializer(serializers.ModelSerializer):
    claimant = UserSerializer(read_only=True)
    item_title = serializers.CharField(source='item.title', read_only=True)

    class Meta:
        model = Claim
        fields = [
            'id', 'item', 'item_title', 'claimant', 'message',
            'status', 'created_at',
        ]
        read_only_fields = ['id', 'claimant', 'status', 'created_at']


class ItemSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    item_type_display = serializers.CharField(source='get_item_type_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    claims_count = serializers.IntegerField(source='claims.count', read_only=True)

    class Meta:
        model = Item
        fields = [
            'id', 'owner', 'title', 'description', 'item_type',
            'item_type_display', 'category', 'category_display', 'location',
            'latitude', 'longitude', 'image', 'status', 'date_event',
            'claims_count', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']
