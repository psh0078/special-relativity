from django.contrib import admin
from .models import Event, Object

class ObjectInline(admin.TabularInline):
    model = Object
    extra = 1

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at')
    list_filter = ('user', 'created_at')
    search_fields = ('name', 'user__username')
    inlines = [ObjectInline]

@admin.register(Object)
class ObjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'event', 'velocityLab', 'x0Lab', 't0Lab')
    list_filter = ('event',)
    search_fields = ('name', 'event__name')