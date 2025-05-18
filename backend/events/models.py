from django.db import models
from django.contrib.auth.models import User

class Object(models.Model):
    name = models.CharField(max_length=200)
    velocityLab = models.FloatField()
    x0Lab = models.FloatField()
    t0Lab = models.FloatField()
    event = models.ForeignKey('Event', on_delete=models.CASCADE, related_name='event_objects')

    def __str__(self):
        return f"{self.name} (v={self.velocityLab}, x0={self.x0Lab}, t0={self.t0Lab})"

class Event(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    name = models.CharField(max_length=200)
    current_time = models.FloatField(default=0.0)
    current_reference_frame = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.user.username})"