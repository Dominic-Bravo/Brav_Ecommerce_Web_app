# brav_core/pagination.py
from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10  # Default items per page if none specified
    page_size_query_param = "page_size"  # Allows client to pass ?page_size=25
    max_page_size = 100  # Caps the maximum items a client can request at once
