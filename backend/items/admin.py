from django.contrib import admin

from .models import Claim, Item


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'item_type', 'category', 'status', 'owner', 'created_at')
    list_filter = ('item_type', 'category', 'status')
    search_fields = ('title', 'description', 'location')


@admin.register(Claim)
class ClaimAdmin(admin.ModelAdmin):
    list_display = ('item', 'claimant', 'status', 'created_at')
    list_filter = ('status',)