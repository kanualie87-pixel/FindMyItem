"""URL configuration for the FINDMYITEM project."""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def api_root(_request):
    return JsonResponse({
        'name': 'FINDMYITEM API',
        'endpoints': {
            'auth': '/api/auth/',
            'items': '/api/items/',
            'claims': '/api/claims/',
            'conversations': '/api/conversations/',
            'messages': '/api/messages/',
            'admin': '/admin/',
        },
    })


urlpatterns = [
    path('', api_root),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('items.urls')),
    path('api/', include('messaging.urls')),
]

# Serve uploaded media during development.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
