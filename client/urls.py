import profile
from django.urls import path
from client.views  import profile,login,signup,select_crypto,predict_crypto_prices,update,table

app_name='client'
urlpatterns = [
      path('update/', update, name='update'),
    path('profile/', profile, name='profile'),
    path('', login, name='login'),  
    path('signup/', signup, name='signup'),# Add login URL
    path('select-crypto/', select_crypto, name='select_crypto'),
    path('table/', table, name='table'),
    path('predict-crypto-prices/', predict_crypto_prices, name='predict_crypto_prices'),
    # Add other authencation-related URLs (logout, register) as needed
]

