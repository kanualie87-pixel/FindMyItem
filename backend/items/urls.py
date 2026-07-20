from rest_framework.routers import DefaultRouter

from .views import ClaimViewSet, ItemViewSet

router = DefaultRouter()
router.register('items', ItemViewSet, basename='item')
router.register('claims', ClaimViewSet, basename='claim')

<<<<<<< HEAD
urlpatterns = router.urls
=======
urlpatterns = router.urls
>>>>>>> c5411e13992c2599f34ac36cbbb60fd05ac78bd8
