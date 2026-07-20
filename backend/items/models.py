from django.conf import settings
from django.db import models


class Item(models.Model):
    """The main entity of FINDMYITEM: a lost or found item report.

    Full CRUD is exposed on this model through the REST API.
    """

    class ItemType(models.TextChoices):
        LOST = 'lost', 'Lost'
        FOUND = 'found', 'Found'

    class Status(models.TextChoices):
        OPEN = 'open', 'Open'
        RESOLVED = 'resolved', 'Resolved'

    class Category(models.TextChoices):
        ELECTRONICS = 'electronics', 'Electronics'
        DOCUMENTS = 'documents', 'Documents'
        KEYS = 'keys', 'Keys'
        WALLET = 'wallet', 'Wallet / Purse'
        CLOTHING = 'clothing', 'Clothing'
        BAG = 'bag', 'Bag / Backpack'
        JEWELRY = 'jewelry', 'Jewelry'
        PET = 'pet', 'Pet'
        OTHER = 'other', 'Other'

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='items',
    )
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    item_type = models.CharField(
        max_length=10, choices=ItemType.choices, default=ItemType.LOST
    )
    category = models.CharField(
        max_length=20, choices=Category.choices, default=Category.OTHER
    )
    location = models.CharField(max_length=200, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    image = models.ImageField(upload_to='items/', blank=True, null=True)
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.OPEN
    )
    date_event = models.DateField(
        null=True, blank=True,
        help_text='Date the item was lost or found.',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'[{self.get_item_type_display()}] {self.title}'


class Claim(models.Model):
    """A request from a user claiming an item is theirs (or that they found it)."""

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'

    item = models.ForeignKey(
        Item, on_delete=models.CASCADE, related_name='claims'
    )
    claimant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='claims',
    )
    message = models.TextField(blank=True)
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
<<<<<<< HEAD
        return f'Claim on {self.item.title} by {self.claimant}'
=======
        return f'Claim on {self.item.title} by {self.claimant}'
>>>>>>> c5411e13992c2599f34ac36cbbb60fd05ac78bd8
