"""Signal receivers that turn app events into notifications.

Everything is wired here so the rest of the codebase (items, messaging) does
not need to know that notifications exist. Add a new receiver here to notify
on a new kind of event.
"""
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from items.models import Claim, Item
from messaging.models import Message

from .models import Notification
from .services import notify

User = get_user_model()


# ---------------------------------------------------------------------------
# Chat messages  ->  notify the other participant(s)
# ---------------------------------------------------------------------------
@receiver(post_save, sender=Message)
def on_message_created(sender, instance, created, **kwargs):
    if not created:
        return
    convo = instance.conversation
    preview = instance.text[:120]
    for participant in convo.participants.exclude(pk=instance.sender_id):
        notify(
            recipient=participant,
            actor=instance.sender,
            kind=Notification.Kind.MESSAGE,
            title=f'New message from {instance.sender.username}',
            body=preview,
            url=f'/messages?c={convo.id}',
            conversation=convo,
            item=convo.item,
        )


# ---------------------------------------------------------------------------
# Claims  ->  notify the item owner (new claim) / claimant (response)
# ---------------------------------------------------------------------------
@receiver(pre_save, sender=Claim)
def remember_old_claim_status(sender, instance, **kwargs):
    """Stash the previous status so post_save can detect a change."""
    if instance.pk:
        instance._old_status = (
            Claim.objects.filter(pk=instance.pk)
            .values_list('status', flat=True)
            .first()
        )
    else:
        instance._old_status = None


@receiver(post_save, sender=Claim)
def on_claim_saved(sender, instance, created, **kwargs):
    item = instance.item

    if created:
        # A new claim was filed -> tell the person who reported the item.
        notify(
            recipient=item.owner,
            actor=instance.claimant,
            kind=Notification.Kind.CLAIM,
            title=f'New claim on "{item.title}"',
            body=instance.message[:120] or f'{instance.claimant.username} claimed this item.',
            url=f'/items/{item.id}',
            item=item,
        )
        return

    # An existing claim changed status (owner approved/rejected it)
    # -> tell the claimant what happened.
    old_status = getattr(instance, '_old_status', None)
    if old_status == instance.status:
        return

    if instance.status == Claim.Status.APPROVED:
        notify(
            recipient=instance.claimant,
            actor=item.owner,
            kind=Notification.Kind.CLAIM_APPROVED,
            title=f'Your claim on "{item.title}" was approved 🎉',
            body='Reach out in Messages to arrange the handover.',
            url=f'/items/{item.id}',
            item=item,
        )
    elif instance.status == Claim.Status.REJECTED:
        notify(
            recipient=instance.claimant,
            actor=item.owner,
            kind=Notification.Kind.CLAIM_REJECTED,
            title=f'Your claim on "{item.title}" was declined',
            body='The owner did not approve this claim.',
            url=f'/items/{item.id}',
            item=item,
        )


# ---------------------------------------------------------------------------
# Items  ->  broadcast a new report to everyone, notify owner on resolve
# ---------------------------------------------------------------------------
@receiver(pre_save, sender=Item)
def remember_old_item_status(sender, instance, **kwargs):
    if instance.pk:
        instance._old_status = (
            Item.objects.filter(pk=instance.pk)
            .values_list('status', flat=True)
            .first()
        )
    else:
        instance._old_status = None


@receiver(post_save, sender=Item)
def on_item_saved(sender, instance, created, **kwargs):
    if created:
        # Let every other user know a new item was posted, so a person who
        # lost something sees when a matching "found" report appears.
        kind_word = instance.get_item_type_display().lower()
        others = User.objects.exclude(pk=instance.owner_id)
        for person in others:
            notify(
                recipient=person,
                actor=instance.owner,
                kind=Notification.Kind.ITEM_NEW,
                title=f'New {kind_word} item: "{instance.title}"',
                body=instance.location and f'Location: {instance.location}' or '',
                url=f'/items/{instance.id}',
                item=instance,
            )
        return

    old_status = getattr(instance, '_old_status', None)
    if old_status != instance.status and instance.status == Item.Status.RESOLVED:
        notify(
            recipient=instance.owner,
            actor=None,
            kind=Notification.Kind.ITEM_RESOLVED,
            title=f'"{instance.title}" was marked resolved ✅',
            body='This report is now closed.',
            url=f'/items/{instance.id}',
            item=instance,
        )
