from rest_framework.pagination import PageNumberPagination


class StandardPagination(PageNumberPagination):
    """Default page size of 24, overridable with ?page_size= (max 100)."""

    page_size = 24
    page_size_query_param = 'page_size'
    max_page_size = 100
