from django.contrib import admin
from django.urls import path, include
from . import views as v


urlpatterns=[    
    path("create/", v.create_student),
    path("get/", v.get_student),
    path("update-info/", v.update_info),
    path("update-tokens/", v.update_tokens),
    path("update-scores/", v.update_scores),
]