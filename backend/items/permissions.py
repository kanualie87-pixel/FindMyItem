from rest_framework import permissions


class IsOwnerOrReadOnlyAndAdminDelete(permissions.BasePermission):
    """Object-level permission implementing the assignment's core rule.

    - Anyone may READ (GET/HEAD/OPTIONS).
    - The owner (or an admin) may UPDATE their own item (PUT/PATCH).
    - Only an admin (is_staff) may DELETE. Regular users can never delete,
      not even their own items.
    """

    def has_object_permission(self, request, view, obj):
        # Read-only requests are always allowed.
        if request.method in permissions.SAFE_METHODS:
            return True

        # DELETE is restricted to admins only.
        if request.method == 'DELETE':
            return bool(request.user and request.user.is_staff)

        # PUT / PATCH: owner or admin.
        owner = getattr(obj, 'owner', None) or getattr(obj, 'claimant', None)
        return bool(
            request.user
            and request.user.is_authenticated
            and (owner == request.user or request.user.is_staff)
        )
