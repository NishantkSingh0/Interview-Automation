from django.urls import path
from . import views as v


urlpatterns = [
    path("get/", v.get_org),
    path("create/", v.create_org),
    path("update-tokens/", v.update_tokens),
    path("update-batch/", v.update_batch),
]