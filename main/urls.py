from django.contrib import admin
from django.conf.urls import url,include
from django.urls import path
from . import views
from django.conf.urls.static import static
from sites.settings import DEBUG,MEDIA_URL,MEDIA_ROOT

urlpatterns = [
    url('model',views.home,name='model'),
 	url('',views.upload,name='upload'),
]+static(MEDIA_URL,documnet_root=MEDIA_ROOT)

