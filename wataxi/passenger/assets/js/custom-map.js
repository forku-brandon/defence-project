var map;
var markers = [];
var directionsService;
var directionsRenderer;
var userMarker;

function initMap() {
    // Default center on Bamenda, Northwest Cameroon
    const bamenda = {lat: 5.9631, lng: 10.1591};
    
    // Map options
    var mapOptions = {
        zoom: 14,
        center: bamenda,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        panControl: false,
        zoomControl: true,
        streetViewControl: false,
        styles: [
            {"featureType": "poi", "stylers": [{"visibility": "off"}]},
            {"featureType": "transit", "stylers": [{"visibility": "off"}]}
        ]
    };

    // Initialize map
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Initialize directions service
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: { strokeColor: "#005F20", strokeWeight: 4 }
    });
    directionsRenderer.setMap(map);

    // Try to get user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                var userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Center map on user's location
                map.setCenter(userLocation);
                
                // Add user location marker
                userMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    icon: {
                        url: 'https://cdn-icons-png.flaticon.com/512/4474/4474284.png',
                        scaledSize: new google.maps.Size(32, 32)
                    },
                    title: 'Your Location'
                });
                markers.push(userMarker);
                
                // Add destination marker (Bamenda center)
                addMarker(bamenda.lat, bamenda.lng, 
                         'https://cdn-icons-png.flaticon.com/512/4474/4474309.png', 
                         'Destination');
                
                // Calculate route from user's location to Bamenda center
                calculateRoute(userLocation, bamenda);
            },
            function(error) {
                // If geolocation fails, use default Bamenda location
                console.error("Geolocation error:", error);
                initDefaultMarkers(bamenda);
            }
        );
    } else {
        // Browser doesn't support Geolocation
        console.error("Geolocation is not supported by this browser.");
        initDefaultMarkers(bamenda);
    }
}

function initDefaultMarkers(center) {
    // Add default markers when geolocation isn't available
    addMarker(center.lat, center.lng, 
             'https://cdn-icons-png.flaticon.com/512/4474/4474284.png', 
             'Your Location');
    
    addMarker(5.9650, 10.1650, 
             'https://cdn-icons-png.flaticon.com/512/4474/4474309.png', 
             'Destination');
    
    addMarker(5.9620, 10.1570, 
             'https://cdn-icons-png.flaticon.com/512/3079/3079027.png', 
             'Taxi Driver');
}

function addMarker(lat, lng, iconUrl, title) {
    var marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map,
        icon: {
            url: iconUrl,
            scaledSize: new google.maps.Size(32, 32)
        },
        title: title
    });
    markers.push(marker);
    return marker;
}

function calculateRoute(start, end) {
    directionsService.route(
        {
            origin: start,
            destination: end,
            travelMode: 'DRIVING'
        },
        function(response, status) {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
                
                // Add a taxi marker along the route
                var route = response.routes[0];
                var path = route.overview_path;
                var midPoint = path[Math.floor(path.length/2)];
                
                addMarker(midPoint.lat(), midPoint.lng(),
                         'https://cdn-icons-png.flaticon.com/512/3079/3079027.png',
                         'Taxi on Route');
            } else {
                console.log('Directions request failed:', status);
            }
        });
}

function hideAllMarkers() {
    markers.forEach(function(marker) {
        marker.setMap(null);
    });
    markers = [];
}

// Initialize the map
window.initMap = initMap;