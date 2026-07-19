from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model.

    Django's built-in AbstractUser already provides username, email,
    password, first_name, last_name, is_staff and is_superuser.
    We treat ``is_staff`` as the "admin" flag: only admins may DELETE items.
    """

    email = models.EmailField(unique=True)
    profile_picture = models.ImageField(
        upload_to='profiles/', blank=True, null=True
    )
    phone = models.CharField(max_length=30, blank=True)

    def __str__(self):
        return self.username
