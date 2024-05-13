# models.py

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.CharField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)

class SearchQuery(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    query = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)


class Prediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    coin = models.CharField(max_length=100)
    predicted_price = models.FloatField()
    predicted_time = models.DateTimeField(default=timezone.now)  # Set the default value to the current time

    def __str__(self):
        return f'{self.user.username} - {self.coin} - {self.predicted_price} - {self.predicted_time}'
    
class UserActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.activity_type} - {self.timestamp}'
    
