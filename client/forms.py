# forms.py

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Prediction
class PredictionForm(forms.ModelForm):
    class Meta:
        model = Prediction
        fields = ['coin', 'predicted_price', 'predicted_time']

class SignupForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'password1', 'password2')