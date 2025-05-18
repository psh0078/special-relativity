from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view returns a list of all events for the currently authenticated user.
        """
        return Event.objects.all().filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        When creating a new event, automatically set the user to the current user.
        """
        serializer.save(user=self.request.user)
