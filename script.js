// Function to fetch train schedules from a free API
async function fetchTrainSchedulesAndShow() {
    const resultDiv = document.getElementById('optimization-result');
    resultDiv.textContent = 'Loading train schedules...';
    try {
        // Using a free railway API
        const response = await fetch('https://api.railwayapi.com/v2/route/train/12301/apikey/your_api_key/');
        const data = await response.json();
        if (data && data.route) {
            let html = '<h3>Train Schedule</h3>';
            html += '<div class="schedule-list">';
            data.route.forEach(station => {
                html += `<div class="station-item">
                    <strong>${station.station.name}</strong>
                    <p>Arrival: ${station.scharr || 'N/A'}</p>
                    <p>Departure: ${station.schdep || 'N/A'}</p>
                </div>`;
            });
            html += '</div>';
            resultDiv.innerHTML = html;
        } else {
            resultDiv.textContent = 'No schedule data available.';
        }
    } catch (e) {
        resultDiv.textContent = 'Failed to fetch train schedules. Please try again later.';
        console.error('Error fetching train schedules:', e);
    }
}

// Function to fetch weather data from OpenWeatherMap API (free tier)
async function fetchWeatherDataAndShow() {
    const resultDiv = document.getElementById('optimization-result');
    resultDiv.textContent = 'Loading weather data...';
    try {
        // Using OpenWeatherMap free API
        const apiKey = '2ed20493d9a80d8092db42fb4c2f2fdf'; // Replace with your free API key
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=2ed20493d9a80d8092db42fb4c2f2fdf&units=metric`);
        const data = await response.json();
        if (data && data.main) {
            let html = '<h3>Weather Information</h3>';
            html += `<div class="weather-info">
                <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
                <p><strong>Weather:</strong> ${data.weather[0].description}</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
            </div>`;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.textContent = 'Weather data not available.';
        }
    } catch (e) {
        resultDiv.textContent = 'Failed to fetch weather data. Please try again later.';
        console.error('Error fetching weather data:', e);
    }
}


// Function to fetch user location using free IP Geolocation API
async function fetchUserLocationAndShow() {
    const resultDiv = document.getElementById('map-result');
    resultDiv.textContent = 'Detecting your location...';
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data && data.latitude && data.longitude) {
            resultDiv.textContent = `Your location: ${data.city}, ${data.region}, ${data.country_name}`;
            if (window.google && window.google.maps && document.getElementById('map')) {
                const map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: data.latitude, lng: data.longitude },
                    zoom: 10
                });
                new google.maps.Marker({
                    position: { lat: data.latitude, lng: data.longitude },
                    map,
                    title: 'Your Location'
                });
            }
        } else {
            resultDiv.textContent = 'Location data not available.';
        }
    } catch (e) {
        resultDiv.textContent = 'Failed to detect location. Please try again later.';
        console.error('Error detecting location:', e);
    }
}

// Function to initialize Google Maps
function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
        zoom: 8
    });
}

// Function to calculate directions using Google Directions API
function calculateDirections() {
    const resultDiv = document.getElementById('map-result');
    resultDiv.textContent = 'Calculating directions...';
    if (window.google && window.google.maps && document.getElementById('map')) {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 28.6139, lng: 77.2090 },
            zoom: 6
        });
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        const request = {
            origin: 'New Delhi',
            destination: 'Kanpur',
            travelMode: 'DRIVING'
        };
        directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(result);
                resultDiv.textContent = 'Directions displayed on map.';
            } else {
                resultDiv.textContent = 'Failed to get directions. Please try again later.';
            }
        });
    } else {
        resultDiv.textContent = 'Google Maps not loaded. Please check your internet connection.';
    }
}

// Function to search for places using Google Places API
function searchPlaces() {
    const resultDiv = document.getElementById('map-result');
    resultDiv.textContent = 'Searching for nearby stations...';
    if (window.google && window.google.maps && document.getElementById('map')) {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 28.6139, lng: 77.2090 }, // Delhi as default
            zoom: 12
        });
        const service = new google.maps.places.PlacesService(map);
        const request = {
            location: { lat: 28.6139, lng: 77.2090 },
            radius: 5000,
            type: ['train_station']
        };
        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                let html = '<h3>Nearby Stations</h3>';
                html += '<div class="stations-list">';
                results.forEach(place => {
                    html += `<div class="station-item">
                        <strong>${place.name}</strong>
                        <p>Rating: ${place.rating || 'N/A'}</p>
                        <p>Address: ${place.vicinity || 'N/A'}</p>
                    </div>`;
                    new google.maps.Marker({
                        position: place.geometry.location,
                        map,
                        title: place.name
                    });
                });
                html += '</div>';
                resultDiv.innerHTML = html;
            } else {
                resultDiv.textContent = 'No stations found in the area.';
            }
        });
    } else {
        resultDiv.textContent = 'Google Maps not loaded. Please check your internet connection.';
    }
}

// Scroll to Optimization section when Start Optimization is clicked
function optionone() {
    const section = document.getElementById('optimization');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

// Load Google Maps script dynamically if not present
if (!window.google || !window.google.maps) {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places';
    script.async = true;
    document.head.appendChild(script);
} 