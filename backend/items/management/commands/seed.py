"""Seed the database with demo users and richly-populated items (with photos).

Usage:
    python manage.py seed            # add users + items, download a photo for each
    python manage.py seed --no-images  # skip photo downloads (faster / offline)

Idempotent: existing items (matched by title) are kept; a photo is downloaded
only for items that don't have one yet.
"""

import ssl
import urllib.request
from io import BytesIO

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand

from items.models import Item

User = get_user_model()

# (title, item_type, category, location, description, image_keyword)
DEMO_ITEMS = [
    ('Black leather wallet', 'lost', 'wallet', 'Main Library, 2nd floor',
     'Slim leather wallet with ID and two bank cards inside. Small reward offered.', 'wallet'),
    ('iPhone 14 Pro', 'lost', 'electronics', 'Cafeteria',
     'Space black, blue silicone case, cracked screen protector. Please call if found.', 'iphone'),
    ('Car & house keys', 'found', 'keys', 'Parking lot B',
     'Four keys on a red lanyard, found near the entrance. Handed to security.', 'keys'),
    ('Golden retriever', 'found', 'pet', 'Central campus gate',
     'Very friendly dog, no collar. Currently kept at the security office.', 'dog'),
    ('Blue North Face backpack', 'lost', 'bag', 'Bus stop 3',
     'Contains a laptop, chargers and notebooks. Left on the 8am bus.', 'backpack'),
    ('Silver engraved ring', 'found', 'jewelry', 'Gym locker room',
     'Small silver ring with an engraving inside. At the front desk.', 'ring'),
    ('AirPods Pro (case)', 'lost', 'electronics', 'Lecture hall A',
     'White charging case, slightly scratched. Lost during the 2pm class.', 'airpods'),
    ('Passport', 'found', 'documents', 'Reception desk',
     'A passport was handed in. Owner can identify and collect at reception.', 'passport'),
    ('Prescription glasses', 'lost', 'other', 'Study room 4',
     'Black rectangular frames in a brown case. Fairly strong prescription.', 'eyeglasses'),
    ('Red umbrella', 'found', 'other', 'Cafeteria entrance',
     'Large red umbrella left in the stand by the door.', 'umbrella'),
    ('Laptop charger (USB-C)', 'lost', 'electronics', 'Computer lab',
     '65W USB-C charger, white, with a short cable. Left plugged into a wall socket.', 'charger'),
    ('Student ID card', 'found', 'documents', 'Main hall',
     'A student ID card was found on the floor near the notice board.', 'id-card'),
    ('Metal water bottle', 'lost', 'other', 'Sports field',
     'Dark green insulated bottle with a few stickers on it.', 'bottle'),
    ('Gold bracelet', 'found', 'jewelry', 'Library reading area',
     'Thin gold bracelet found under a desk. Kept safe at the library desk.', 'bracelet'),
    ('Black hoodie', 'lost', 'clothing', 'Gym',
     'Plain black hoodie, size M. Left on a bench in the changing area.', 'hoodie'),
    ('Wristwatch', 'found', 'jewelry', 'Ground floor restroom',
     'Silver analog watch with a leather strap, found on the sink.', 'watch'),
    ('Calculus textbook', 'lost', 'documents', 'Room 201',
     '"Calculus: Early Transcendentals", has my name written on the first page.', 'textbook'),
    ('Grey kitten', 'found', 'pet', 'Dormitory block C',
     'Small grey kitten, very calm. Looking for its owner or a temporary home.', 'kitten'),
    ('Sunglasses', 'lost', 'other', 'Parking lot A',
     'Black aviator sunglasses in a soft pouch. Dropped near my car.', 'sunglasses'),
    ('Over-ear headphones', 'found', 'electronics', 'Music room',
     'Black wireless over-ear headphones left on a music stand.', 'headphones'),
]

SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE


def download_image(keyword, lock):
    """Fetch a topic-relevant photo. Returns (filename, bytes) or None."""
    url = f'https://loremflickr.com/640/480/{keyword}?lock={lock}'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=20, context=SSL_CTX) as r:
            return f'{keyword}-{lock}.jpg', r.read()
    except Exception:
        return None


class Command(BaseCommand):
    help = 'Populate the database with demo users and items (with photos).'

    def add_arguments(self, parser):
        parser.add_argument('--no-images', action='store_true', help='Skip photo downloads.')

    def handle(self, *args, **options):
        with_images = not options['no_images']

        # --- Users ---
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@findmyitem.com', 'is_staff': True, 'is_superuser': True},
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('Created admin (admin / admin123)'))

        owners = [admin]
        for name in ('alice', 'bob', 'sara', 'daniel'):
            u, made = User.objects.get_or_create(
                username=name, defaults={'email': f'{name}@findmyitem.com'}
            )
            if made:
                u.set_password(f'{name}pass123')
                u.save()
            owners.append(u)
        self.stdout.write(self.style.SUCCESS(
            'Users ready: alice/alicepass123, bob/bobpass123, sara/sarapass123, daniel/danielpass123'
        ))

        # --- Items ---
        created_count = 0
        photo_count = 0
        for i, (title, itype, cat, loc, desc, keyword) in enumerate(DEMO_ITEMS):
            item, made = Item.objects.get_or_create(
                title=title,
                defaults={
                    'owner': owners[i % len(owners)],
                    'item_type': itype,
                    'category': cat,
                    'location': loc,
                    'description': desc,
                    'status': 'open',
                },
            )
            if made:
                created_count += 1

            if with_images and not item.image:
                result = download_image(keyword, lock=i + 1)
                if result:
                    fname, data = result
                    item.image.save(fname, ContentFile(data), save=True)
                    photo_count += 1
                    self.stdout.write(f'  + photo for "{title}"')

        self.stdout.write(self.style.SUCCESS(
            f'Done! {created_count} new items, {photo_count} photos downloaded, '
            f'{Item.objects.count()} items total.'
<<<<<<< HEAD
        ))
=======
        ))
>>>>>>> c5411e13992c2599f34ac36cbbb60fd05ac78bd8
