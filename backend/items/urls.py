from rest_framework.routers import DefaultRouter

from .views import ClaimViewSet, ItemViewSet

router = DefaultRouter()
router.register('items', ItemViewSet, basename='item')
router.register('claims', ClaimViewSet, basename='claim')

urlpatterns = router.urls