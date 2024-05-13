let cryptocurrencies = [];

function displayTopCurrencies(currencies) {
    const currencyMenu = document.getElementById('currencyList');
    currencyMenu.innerHTML = '';

    currencies.forEach((currency, index) => {
        if (index < 100) {
            const listItem = document.createElement('tr');
            listItem.classList.add('currency-item');

            const serialNumber = document.createElement('td');
            serialNumber.classList.add('serial-number');
            serialNumber.textContent = index + 1 + '. ';
            listItem.appendChild(serialNumber);

            const currencyName = document.createElement('td');
            currencyName.classList.add('coin-info');
            currencyName.textContent = currency.name;
            listItem.appendChild(currencyName);

            const coinImage = document.createElement('td');
            coinImage.classList.add('coin-info');
            const imageElement = document.createElement('img');
            imageElement.classList.add('coin-image');
            imageElement.src = currency.image;
            imageElement.alt = 'Coin Image';
            coinImage.appendChild(imageElement);
            listItem.appendChild(coinImage);
            //
            // const marketCap = document.createElement('td');
            // marketCap.classList.add('coin-info');
            // marketCap.textContent = '$' + currency.marketCap;
            // listItem.appendChild(marketCap);

            const marketCap = document.createElement('td');
            marketCap.classList.add('coin-info');
            marketCap.textContent = '$' + currency.market_cap;
            listItem.appendChild(marketCap);


            listItem.addEventListener('click', () => {
                fetchCurrencyDetails(currency.id);
            });
            adjustLeftPanelHeight();
            currencyMenu.appendChild(listItem);

        }
    });
}
function adjustLeftPanelHeight() {
    const leftPanel = document.getElementById('leftPanel');
    const currencyContainer = document.getElementById('currencyContainer');

    leftPanel.style.height = currencyContainer.offsetHeight + 'px';
}


// Update the fetchCryptocurrencyData function to call displayTopCurrencies
function fetchCryptocurrencyData() {
    fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1'
    )
        .then((response) => response.json())
        .then((data) => {
            cryptocurrencies = data;
            displayCryptocurrencies(data);
            displayTopCurrencies(data);
        })
        .catch((error) => console.error('Error:', error));
}


function processData(data) {
    const prices = data.map((entry) => entry[1]);
    return prices;
}

// Display the cryptocurrency data in the search results
function displayCryptocurrencies(data) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    data.forEach((coin) => {
        const listItem = document.createElement('li');
        listItem.value = coin.symbol;

        const coinImage = document.createElement('img');
        coinImage.src = coin.image;
        coinImage.alt = 'Coin Image';
        coinImage.className = 'coin-image';

        const coinInfo = document.createElement('div');
        coinInfo.className = 'coin-info';
        const coinName = document.createElement('span');
        coinName.textContent = coin.name;
        coinName.style.fontWeight = 'bold';
        const coinSymbol = document.createElement('span');
        coinSymbol.textContent = coin.symbol.toUpperCase(); // Convert text to uppercase
        coinSymbol.style.fontWeight = 'bold'; 

        coinInfo.appendChild(coinImage);
        coinInfo.appendChild(coinName);
        coinInfo.appendChild(coinSymbol);

        listItem.appendChild(coinInfo);
        listItem.addEventListener('click', () => {
            fetchCurrencyDetails(coin.id);
            searchResults.style.display = 'none';
        });

        searchResults.appendChild(listItem);
    });
}

// Linear regression prediction model
function predictPrice(historicalPrices) {
    const data = historicalPrices.map((price, index) => [index, price]);
    const result = regression.linear(data);
    const lastDataPoint = data[data.length - 1];
    const predictedPrice = result.predict([lastDataPoint[0] + 1])[1];

    return predictedPrice;
}
function fetchCurrencyDetails(currencyId) {
    Promise.all([
        fetch(`https://api.coingecko.com/api/v3/coins/${currencyId}/market_chart?vs_currency=usd&days=60&interval=daily`),
        fetch(`https://api.coingecko.com/api/v3/coins/${currencyId}`)
    ])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            const historicalPrices = data[0].prices.map(entry => entry[1]);
            const currentPrice = data[1].market_data.current_price.usd;
            const imageUrl = data[1].image.large;
            const movingAverage7Days = calculateMovingAverage(historicalPrices, 7);
            const movingAverage30Days = calculateMovingAverage(historicalPrices, 30);
            const rsi = calculateRSI(historicalPrices);
            const bollingerBands = calculateBollingerBands(historicalPrices);
            const priceChange1Day = calculatePriceChange(historicalPrices, 1);
            const priceChange7Days = calculatePriceChange(historicalPrices, 7);
            const volumeChange1Day = calculateVolumeChange(historicalPrices, 1);
            const volumeChange7Days = calculateVolumeChange(historicalPrices, 7);
            console.log("Bollinger Bands:", bollingerBands);
            console.log("Price Change (1 day):", priceChange1Day);
            console.log("Price Change (7 days):", priceChange7Days);
            console.log("Volume Change (1 day):", volumeChange1Day);
            console.log("Volume Change (7 days):", volumeChange7Days);

            // const selectedCurrency = document.getElementById('selectedCurrency');
            // selectedCurrency.innerHTML = '';

            const selectedCurrency = document.getElementById('selectedCurrency');
            selectedCurrency.innerHTML = '';

            const coinInfo = document.createElement('div');
            coinInfo.className = 'coin-info';

            const coinImageContainer = document.createElement('div');
            coinImageContainer.className = 'coin-image-container';
            const coinImage = document.createElement('img');
            coinImage.id = 'coinImage';
            coinImage.src = imageUrl;
            coinImage.alt = 'Coin Image';
            coinImageContainer.appendChild(coinImage);

            const currentPriceElement = document.createElement('div');
            currentPriceElement.id = 'currentPrice';
            currentPriceElement.className = 'info-item';
            currentPriceElement.textContent = 'Current Price: $' + currentPrice;

            const predictedPriceElement = document.createElement('div');
            predictedPriceElement.id = 'predictedPrice';
            predictedPriceElement.className = 'info-item';

            const rollingWindowPrices = historicalPrices.slice(-365); // Use the last 365 days of data as the rolling window
            const predictedPrice = predictPrice(rollingWindowPrices);
            predictedPriceElement.textContent = 'Predicted Price: $' + predictedPrice.toFixed(2);

            coinInfo.appendChild(coinImageContainer);
            coinInfo.appendChild(currentPriceElement);
            coinInfo.appendChild(predictedPriceElement);

            selectedCurrency.appendChild(coinInfo);

            renderChart(historicalPrices);
            renderComparisonChart(currentPrice, predictedPrice);
        })
        .catch(error => console.error('Error:', error));
        
}

function calculateMovingAverage(prices, windowSize) {
    const movingAverages = [];
    for (let i = windowSize - 1; i < prices.length; i++) {
        const sum = prices.slice(i - windowSize + 1, i + 1).reduce((acc, entry) => acc + entry.price, 0);
        const average = sum / windowSize;
        movingAverages.push(average);
    }
    return movingAverages;
}

// Calculate the Relative Strength Index (RSI) of an array of prices
function calculateRSI(prices) {
    const gains = [];
    const losses = [];

    for (let i = 1; i < prices.length; i++) {
        const priceDiff = prices[i].price - prices[i - 1].price;
        if (priceDiff > 0) {
            gains.push(priceDiff);
            losses.push(0);
        } else {
            gains.push(0);
            losses.push(-priceDiff);
        }
    }

    const avgGain = gains.reduce((acc, val) => acc + val, 0) / gains.length;
    const avgLoss = losses.reduce((acc, val) => acc + val, 0) / losses.length;

    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    return rsi;
}

// Calculate Bollinger Bands of an array of prices
function calculateBollingerBands(prices) {
    const windowSize = 20;
    const stdDeviations = 2;

    const smas = calculateMovingAverage(prices, windowSize);
    const deviations = [];

    for (let i = windowSize - 1; i < prices.length; i++) {
        const sumOfSquares = prices
            .slice(i - windowSize + 1, i + 1)
            .reduce((acc, entry) => acc + Math.pow(entry.price - smas[i], 2), 0);
        const standardDeviation = Math.sqrt(sumOfSquares / windowSize);
        deviations.push({
            upper: smas[i] + stdDeviations * standardDeviation,
            lower: smas[i] - stdDeviations * standardDeviation,
        });
    }

    return deviations;
}

// Calculate the Simple Moving Average (SMA) of an array of prices over a specified window size
function calculateSimpleMovingAverage(prices, windowSize) {
    const smas = [];

    for (let i = windowSize - 1; i < prices.length; i++) {
        const sum = prices.slice(i - windowSize + 1, i + 1).reduce((acc, entry) => acc + entry.price, 0);
        const average = sum / windowSize;
        smas.push(average);
    }

    return smas;
}

// Calculate the percentage change in price over a specified interval
function calculatePriceChange(prices, interval) {
    const priceChanges = [];

    for (let i = interval; i < prices.length; i++) {
        const currentPrice = prices[i].price;
        const previousPrice = prices[i - interval].price;
        const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
        priceChanges.push(priceChange);
    }

    return priceChanges;
}

// Calculate the percentage change in volume over a specified interval
function calculateVolumeChange(prices, interval) {
    const volumeChanges = [];

    for (let i = interval; i < prices.length; i++) {
        const currentVolume = prices[i].volume;
        const previousVolume = prices[i - interval].volume;
        const volumeChange = ((currentVolume - previousVolume) / previousVolume) * 100;
        volumeChanges.push(volumeChange);
    }

    return volumeChanges;
}

// Example usage: Generate features from price data
function generateFeatures(prices) {
    const movingAverages = calculateMovingAverage(prices, 10);
    const rsi = calculateRSI(prices);
    const bollingerBands = calculateBollingerBands(prices);
    const sma = calculateSimpleMovingAverage(prices, 20);
    const priceChanges = calculatePriceChange(prices, 1);
    const volumeChanges = calculateVolumeChange(prices, 1);

    // Print generated features to the console
    console.log('Moving Averages:', movingAverages);
    console.log('RSI:', rsi);
    console.log('Bollinger Bands:', bollingerBands);
    console.log('SMA:', sma);
    console.log('Price Changes:', priceChanges);
    console.log('Volume Changes:', volumeChanges);
}



const prices = [];

// Function to fetch prices from the Binance API
async function fetchBinancePrices() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price');
        const data = await response.json();
        return data.map(entry => ({ price: parseFloat(entry.price), volume: parseFloat(entry.volume) }));
    } catch (error) {
        console.error('Error fetching Binance prices:', error);
        return [];
    }
}

// Example usage
async function updatePricesAndFeatures() {
    const binancePrices = await fetchBinancePrices();
    
    if (binancePrices.length > 0) {
        // Update the prices array
        prices.length = 0; // Clear existing prices
        Array.prototype.push.apply(prices, binancePrices);

        // Generate features based on the updated price data
        generateFeatures(prices);
    } else {
        console.error('No Binance prices data available.');
    }
}

// Call the function to update prices and features
updatePricesAndFeatures();

// Generate features based on the price data
generateFeatures(prices);

// Render the chart
let chart = null;
function renderChart(prices) {
    const dates = generateDates(prices.length);

    const options = {
        series: [
            {
                name: 'Price',
                data: prices,
            },
        ],
        chart: {
            type: 'line',
            height: 350,
        },
        xaxis: {
            type: 'datetime',
            categories: dates,
        },
    };

    if (chart === null) {
        // Create a new chart instance
        chart = new ApexCharts(
            document.querySelector('#chartContainer'),
            options
        );
        chart.render();
    } else {
        // Update the series data of the existing chart
        chart.updateSeries(options.series);
    }
}

// Render the comparison chart
let comparisonChart = null;
function renderComparisonChart(currentPrice, predictedPrice) {
    const chartData = [
        {
            x: 'Current Price',
            y: currentPrice,
        },
        {
            x: 'Predicted Price',
            y: predictedPrice,
        },
    ];

    const options = {
        series: [
            {
                data: chartData,
            },
        ],
        chart: {
            type: 'bar',
            height: 350,
        },
        plotOptions: {
            bar: {
                horizontal: true,
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return '$' + val.toFixed(2);
            },
            style: {
                fontSize: '12px',
                fontWeight: 'bold',
                colors: ['#000'],
            },
        },
        xaxis: {
            categories: ['Price'],
        },
    };

    if (comparisonChart === null) {
        // Create a new chart instance
        comparisonChart = new ApexCharts(
            document.querySelector('#comparisonChartContainer'),
            options
        );
        comparisonChart.render();
    } else {
        // Update the series data of the existing chart
        comparisonChart.updateSeries(options.series);
    }
}

// Generate an array of dates based on the number of data points
function generateDates(numPoints) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numPoints + 1);
    const dates = [];

    for (let i = 0; i < numPoints; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        dates.push(currentDate.getTime());
    }

    return dates;
}

let searchResultsVisible = false;

// Handle search input
function handleSearchInput() {
    const searchTerm = (document.getElementById('searchInput')).value.toLowerCase();
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (searchTerm.length > 0) {
        const matchedCurrencies = cryptocurrencies.filter((coin) =>
            coin.name.toLowerCase().includes(searchTerm)
        );

        displayCryptocurrencies(matchedCurrencies);

        // Set the visibility state of the dropdown menu to true
        searchResultsVisible = true;
    } else {
        // Set the visibility state of the dropdown menu based on the previous state
        searchResultsVisible = false;
    }

    // Update the display property of the dropdown menu based on the visibility state
    // searchResults.style.display = searchResultsVisible ? 'block' : 'none';

    // Add event listeners to each coin name element to hide the search results dropdown when clicked
    const coinNameElements = document.querySelectorAll('.coin-name');
    coinNameElements.forEach(element => {
        element.addEventListener('click', () => {
            searchResults.style.display = 'none';
        });
    });
}

const searchResults = document.getElementById('searchResults');

(document.getElementById('searchInput')).addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();

    // Show/hide search results based on input value
    if (query.length > 0) {
        searchResults.classList.add('visible');
    } else {
        searchResults.classList.remove('visible');
    }
});

// Add event listener to the search input
const searchInput = document.getElementById('searchInput');
(document.getElementById('searchInput')).addEventListener('input', handleSearchInput);



fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const coinListContainer = document.getElementById('coinList');

        if (data && data.length > 0) {
            const coins = data.map(coin => `
                <div id="hi">
                    <img id="he" src="${coin.image}" alt="Coin Icon" >
                    <p>Symbol: ${coin.symbol.toUpperCase()}</p>
                    <p>Price: $${coin.current_price}</p>
                </div>
            `);

            coinListContainer.innerHTML = coins.join('');
        } else {
            coinListContainer.innerHTML = '<p>No data available</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        document.getElementById('coinList').innerHTML = `<p>Error: ${error.message}</p>`;
    });


// Fetch cryptocurrency data and initialize the dashboard
fetchCryptocurrencyData();
// Example AJAX request to record activity
fetch('/record-activity/buy/bitcoin', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')  // Make sure to include CSRF token
    },
    body: JSON.stringify({
        // Additional data if needed
    })
})
.then(response => {
    if (response.ok) {
        console.log('Activity recorded successfully');
    } else {
        console.error('Failed to record activity');
    }
})
.catch(error => console.error('Error:', error));
