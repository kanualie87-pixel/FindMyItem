from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

User = get_user_model()


class ConversationViewSet(viewsets.ModelViewSet):
    """Conversations the current user takes part in."""

    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Conversation.objects
            .filter(participants=self.request.user)
            .prefetch_related('participants', 'messages')
            .distinct()
        )

    @action(detail=False, methods=['post'])
    def start(self, request):
        """POST /api/conversations/start/  {"user_id": X, "item": Y (optional)}

        Returns an existing 1:1 conversation with the target user or creates one.
        """
        user_id = request.data.get('user_id')
        item_id = request.data.get('item')
        if not user_id:
            return Response({'detail': 'user_id is required.'}, status=400)
        if str(user_id) == str(request.user.id):
            return Response({'detail': 'You cannot message yourself.'}, status=400)
        try:
            other = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=404)

        # Find an existing 1:1 conversation between exactly these two users.
        existing = (
            Conversation.objects
            .filter(participants=request.user)
            .filter(participants=other)
            .annotate(n=Count('participants'))
            .filter(n=2)
            .first()
        )
        if existing:
            return Response(ConversationSerializer(existing).data)

        convo = Conversation.objects.create(item_id=item_id or None)
        convo.participants.add(request.user, other)
        return Response(
            ConversationSerializer(convo).data, status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """GET /api/conversations/{id}/messages/ -- full history, marks incoming read."""
        convo = self.get_object()
        convo.messages.exclude(sender=request.user).update(is_read=True)
        serializer = MessageSerializer(convo.messages.select_related('sender'), many=True)
        return Response(serializer.data)


class MessageViewSet(viewsets.ModelViewSet):
    """Sending messages over plain REST (the WebSocket path also writes here)."""

    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(
            conversation__participants=self.request.user
        ).select_related('sender')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
