from rest_framework import serializers
from .models import Event, Object
from django.contrib.auth.models import User

class ObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Object
        fields = ['id', 'type', 'object_id', 'velocityLab', 'x0Lab', 't0Lab']
        read_only_fields = ['id']

class EventSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    objects = ObjectSerializer(source='event_objects', many=True, required=False)

    class Meta:
        model = Event
        fields = ['id', 'user', 'name', 'current_time', 'current_reference_frame', 'objects', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def create(self, validated_data):
        objects_data = validated_data.pop('event_objects', [])
        event = Event.objects.create(**validated_data)
        
        for object_data in objects_data:
            Object.objects.create(event=event, **object_data)
        
        return event

    def update(self, instance, validated_data):
        objects_data = validated_data.pop('event_objects', [])
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        # Delete existing objects not in the update
        instance.event_objects.exclude(id__in=[obj.get('id') for obj in objects_data if obj.get('id')]).delete()
        
        # Update or create objects
        for object_data in objects_data:
            object_id = object_data.get('id', None)
            if object_id:
                Object.objects.filter(id=object_id, event=instance).update(**object_data)
            else:
                Object.objects.create(event=instance, **object_data)
        
        return instance 