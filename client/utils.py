# utils.py
import requests
import time

# Define the rate limit parameters
RATE_LIMIT = 1  # Number of requests allowed per second
LAST_REQUEST_TIME = None

def fetch_original_price(coin):
    global LAST_REQUEST_TIME
    
    try:
        # Calculate the time to wait before making the next request
        if LAST_REQUEST_TIME:
            elapsed_time = time.time() - LAST_REQUEST_TIME
            if elapsed_time < 1 / RATE_LIMIT:
                time.sleep(1 / RATE_LIMIT - elapsed_time)
        
        # Update the last request time
        LAST_REQUEST_TIME = time.time()
        
        # Construct the API URL
        api_url = f'https://api.coingecko.com/api/v3/simple/price?ids={coin}&vs_currencies=usd'
        
        # Make the HTTP GET request to the CoinGecko API
        response = requests.get(api_url)
        
        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Parse the JSON response
            data = response.json()
            
            # Extract the current price from the response
            current_price = data.get(coin, {}).get('usd')
            
            # Return the current price
            return current_price
        else:
            # Print an error message if the request was not successful
            print(f"Failed to fetch current price for {coin}. Status code: {response.status_code}")
            return None
    except Exception as e:
        # Print an error message if an exception occurs during the request
        print(f"Error fetching current price for {coin}: {e}")
        return None
