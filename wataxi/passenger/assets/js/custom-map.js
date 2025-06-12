var map;
var userMarker;
var markers = [];
var directionsService;
var directionsRenderer;
var taxis = [];

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
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 2,
                    scale: 8
                },
                title: `Your Location (Accuracy: ${Math.round(accuracy)}m)`
            });
            markers.push(userMarker);
            
            // Add accuracy circle
            new google.maps.Circle({
                strokeColor: "#4285F4",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#4285F4",
                fillOpacity: 0.2,
                map: map,
                center: userLocation,
                radius: accuracy
            });
            
            // Add destination marker (Bamenda center)
            addDestinationMarker();
            
            // Add random taxis around the user (5 taxis within 2km radius)
            addRandomTaxis(userLocation, 2000, 5);
            
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

function addRandomTaxis(center, radiusMeters, count) {
    // Clear existing taxis
    clearTaxis();
    
    // Generate random taxi positions
    for (let i = 0; i < count; i++) {
        const randomLocation = generateRandomLocation(center, radiusMeters);
        
        const taxi = new google.maps.Marker({
            position: randomLocation,
            map: map,
            icon: {
                url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z'/%3E%3C/svg%3E",
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 20)
            },
            title: 'Available Taxi',
            animation: google.maps.Animation.BOUNCE
        });
        
        taxis.push(taxi);
        markers.push(taxi);
    }
}

function generateRandomLocation(center, radiusMeters) {
    // Convert meters to degrees (approximate)
    const radiusDegrees = radiusMeters / 111320;
    
    // Generate random angle and distance
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.sqrt(Math.random()) * radiusDegrees;
    
    // Calculate new position
    const lat = center.lat + (distance * Math.cos(angle));
    const lng = center.lng + (distance * Math.sin(angle));
    
    return { lat, lng };
}

function clearTaxis() {
    for (let i = 0; i < taxis.length; i++) {
        taxis[i].setMap(null);
    }
    taxis = [];
}

function addDestinationMarker() {
    const destination = {lat: 5.9650, lng: 10.1650};
    markers.push(new google.maps.Marker({
        position: destination,
        map: map,
        icon: {
            url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF0000'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
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
            url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z'/%3E%3C/svg%3E",
            scaledSize: new google.maps.Size(40, 40)
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
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
            scale: 8
        },
        title: 'Default Location'
    }));
    
    addDestinationMarker();
    
    // Add some default taxis (3 taxis within 2km radius)
    addRandomTaxis(center, 2000, 3);
}

// Initialize the map
window.initMap = initMap;