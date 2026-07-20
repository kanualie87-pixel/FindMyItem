from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import Claim, Item
from .permissions import IsOwnerOrReadOnlyAndAdminDelete
from .serializers import ClaimSerializer, ItemSerializer


class ItemViewSet(viewsets.ModelViewSet):
    """Full CRUD for the main entity (Item).

    Endpoints (router-generated):
      GET    /api/items/            list      (public)
      POST   /api/items/            create    (authenticated)
      GET    /api/items/{id}/       retrieve  (public)
      PUT    /api/items/{id}/       update    (owner or admin)
      PATCH  /api/items/{id}/       partial   (owner or admin)
      DELETE /api/items/{id}/       destroy   (ADMIN ONLY)
    """

    serializer_class = ItemSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly,
        IsOwnerOrReadOnlyAndAdminDelete,
    ]
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['created_at', 'title', 'date_event']

    def get_queryset(self):
        qs = Item.objects.select_related('owner').all()
        params = self.request.query_params

        item_type = params.get('type')
        if item_type in ('lost', 'found'):
            qs = qs.filter(item_type=item_type)

        category = params.get('category')
        if category:
            qs = qs.filter(category=category)

        status_ = params.get('status')
        if status_ in ('open', 'resolved'):
            qs = qs.filter(status=status_)

        # ?mine=1 -> only the current user's items (used by the dashboard)
        if params.get('mine') and self.request.user.is_authenticated:
            qs = qs.filter(owner=self.request.user)

        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def claims(self, request, pk=None):
        """GET /api/items/{id}/claims/ -- claims on this item (owner/admin only)."""
        item = self.get_object()
        if item.owner != request.user and not request.user.is_staff:
            raise PermissionDenied('Only the item owner or an admin can view claims.')
        serializer = ClaimSerializer(item.claims.all(), many=True)
        return Response(serializer.data)


class ClaimViewSet(viewsets.ModelViewSet):
    """CRUD for claims. Deletion is admin-only, matching the Item rule."""

    serializer_class = ClaimSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsOwnerOrReadOnlyAndAdminDelete,
    ]

    def get_queryset(self):
        user = self.request.user
        qs = Claim.objects.select_related('item', 'claimant')
        if user.is_staff:
            return qs
        # A user sees claims they made, plus claims on items they own.
        return qs.filter(claimant=user) | qs.filter(item__owner=user)

    def perform_create(self, serializer):
        serializer.save(claimant=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def respond(self, request, pk=None):
        """POST /api/claims/{id}/respond/  {"status": "approved"|"rejected"}

        Only the owner of the claimed item (or an admin) may respond.
        """
        claim = self.get_object()
        if claim.item.owner != request.user and not request.user.is_staff:
            raise PermissionDenied('Only the item owner or an admin can respond to a claim.')

        new_status = request.data.get('status')
        if new_status not in (Claim.Status.APPROVED, Claim.Status.REJECTED):
            return Response(
                {'detail': 'status must be "approved" or "rejected".'},
                status=400,
            )
        claim.status = new_status
        claim.save(update_fields=['status'])
        if new_status == Claim.Status.APPROVED:
            claim.item.status = 'resolved'
            claim.item.save(update_fields=['status'])
<<<<<<< HEAD
        return Response(ClaimSerializer(claim).data)
=======
        return Response(ClaimSerializer(claim).data)
>>>>>>> c5411e13992c2599f34ac36cbbb60fd05ac78bd8
