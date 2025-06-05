var map;
var userMarker;
var markers = [];
var directionsService;
var directionsRenderer;

function initMap() {
    // Default center on Bamenda, Northwest Cameroon
    const bamenda = {lat: 5.9631, lng: 10.1591};
    
    // Initialize map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: bamenda,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
            {"featureType": "poi", "stylers": [{"visibility": "off"}]},
            {"featureType": "transit", "stylers": [{"visibility": "off"}]}
        ]
    });

    // Initialize directions service
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: { strokeColor: "#005F20", strokeWeight: 4 }
    });
    directionsRenderer.setMap(map);

    // Try to get precise location
    getPreciseLocation();
}

function getPreciseLocation() {
    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser");
        initDefaultMarkers();
        return;
    }

    // Configuration for high accuracy
    const options = {
        enableHighAccuracy: true,  // Try to use GPS if available
        timeout: 10000,           // Wait max 10 seconds
        maximumAge: 0             // Don't use cached position
    };

    navigator.geolocation.getCurrentPosition(
        position => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            // Show accuracy radius (in meters)
            const accuracy = position.coords.accuracy;
            
            // Center map on user's location
            map.setCenter(userLocation);
            
            // Add user location marker with accuracy circle
            userMarker = new google.maps.Marker({
                position: userLocation,
                map: map,
                icon: {
                    url: 'https://cdn-icons-png.flaticon.com/512/4474/4474284.png',
                    scaledSize: new google.maps.Size(32, 32)
                },
                title: `Your Location (Accuracy: ${Math.round(accuracy)}m)`
            });
            markers.push(userMarker);
            
            // Add accuracy circle
            new google.maps.Circle({
                strokeColor: "#005F20",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#005F20",
                fillOpacity: 0.2,
                map: map,
                center: userLocation,
                radius: accuracy
            });
            
            // Add destination marker (Bamenda center)
            addDestinationMarker();
            
            // Calculate route
            calculateRoute(userLocation, {lat: 5.9631, lng: 10.1591});
        },
        error => {
            handleLocationError(error);
            initDefaultMarkers();
        },
        options
    );
}

function addDestinationMarker() {
    const destination = {lat: 5.9650, lng: 10.1650};
    markers.push(new google.maps.Marker({
        position: destination,
        map: map,
        icon: {
            url: 'https://cdn-icons-png.flaticon.com/512/4474/4474309.png',
            scaledSize: new google.maps.Size(32, 32)
        },
        title: 'Destination'
    }));
    return destination;
}

function calculateRoute(start, end) {
    directionsService.route(
        {
            origin: start,
            destination: end,
            travelMode: 'DRIVING',
            provideRouteAlternatives: false
        },
        (response, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
                addTaxiMarker(response);
            } else {
                console.error('Directions request failed:', status);
            }
        }
    );
}

function addTaxiMarker(response) {
    const route = response.routes[0];
    const path = route.overview_path;
    const midPoint = path[Math.floor(path.length/2)];
    
    markers.push(new google.maps.Marker({
        position: midPoint,
        map: map,
        icon: {
            url: 'https://cdn-icons-png.flaticon.com/512/3079/3079027.png',
            scaledSize: new google.maps.Size(32, 32)
        },
        title: 'Taxi on Route',
        animation: google.maps.Animation.BOUNCE
    }));
}

function handleLocationError(error) {
    let errorMessage = "Error getting your location: ";
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage += "You denied the request for geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            errorMessage += "The request to get location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            errorMessage += "An unknown error occurred.";
            break;
    }
    showError(errorMessage);
}

function showError(message) {
    // Create error display element
    const errorDiv = document.createElement('div');
    errorDiv.style.color = '#FF0000';
    errorDiv.style.padding = '10px';
    errorDiv.style.backgroundColor = '#FFFFFF';
    errorDiv.style.border = '1px solid #FF0000';
    errorDiv.style.position = 'absolute';
    errorDiv.style.top = '10px';
    errorDiv.style.left = '10px';
    errorDiv.style.zIndex = '1000';
    errorDiv.textContent = message;
    
    // Add to map
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => errorDiv.remove(), 5000);
}

function initDefaultMarkers() {
    // Default Bamenda markers
    const center = {lat: 5.9631, lng: 10.1591};
    map.setCenter(center);
    
    markers.push(new google.maps.Marker({
        position: center,
        map: map,
        icon: {
            url: 'https://cdn-icons-png.flaticon.com/512/4474/4474284.png',
            scaledSize: new google.maps.Size(32, 32)
        },
        title: 'Default Location'
    }));
    
    addDestinationMarker();
    
    markers.push(new google.maps.Marker({
        position: {lat: 5.9620, lng: 10.1570},
        map: map,
        icon: {
            url: 'https://cdn-icons-png.flaticon.com/512/3079/3079027.png',
            scaledSize: new google.maps.Size(32, 32)
        },
        title: 'Taxi'
    }));
}

// Initialize the map
window.initMap = initMap;