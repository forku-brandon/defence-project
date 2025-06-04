var map;
var markers = [];
var directionsService;
var directionsRenderer;

function initMap() {
    // Center on Bamenda, Northwest Cameroon
    const bamenda = {lat: 5.9631, lng: 10.1591};
    
    // Map options with simplified styling
    var mapOptions = {
        zoom: 14,
        center: bamenda,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        panControl: false,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        scrollwheel: false,
        scaleControl: false,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        styles: [
            {
                "featureType": "poi",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "transit",
                "stylers": [{"visibility": "off"}]
            }
        ]
    };

    // Initialize map
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Initialize directions service
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: "#005F20",
            strokeWeight: 4
        }
    });
    directionsRenderer.setMap(map);

    // Online marker icons
    var markersData = {
        'marker_location': [
            {
                location_latitude: 5.9600,
                location_longitude: 10.1515,
                icon_name: 'https://cdn-icons-png.flaticon.com/512/4474/4474284.png',
                data_title: 'Your Location'
            },
            {
                location_latitude: 5.9650,
                location_longitude: 10.1650,
                icon_name: 'https://cdn-icons-png.flaticon.com/512/4474/4474309.png',
                data_title: 'Destination'
            },
            {
                location_latitude: 5.9620,
                location_longitude: 10.1570,
                icon_name: 'https://cdn-icons-png.flaticon.com/512/3079/3079027.png',
                data_title: 'Taxi Driver'
            }
        ]
    };

    // Add markers to map
    for (var key in markersData) {
        markersData[key].forEach(function(item) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(item.location_latitude, item.location_longitude),
                map: map,
                animation: google.maps.Animation.DROP,
                icon: {
                    url: item.icon_name,
                    scaledSize: new google.maps.Size(32, 32)
                },
                title: item.data_title
            });

            if (typeof markers[key] === 'undefined') {
                markers[key] = [];
            }
            markers[key].push(marker);
        });
    }

    // Sample route calculation
    calculateAndDisplayRoute(directionsService, directionsRenderer);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    directionsService.route(
        {
            origin: { query: 'Commercial Avenue, Bamenda' },
            destination: { query: 'Up Station, Bamenda' },
            travelMode: 'DRIVING'
        },
        function(response, status) {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
            } else {
                console.log('Directions request failed due to ' + status);
            }
        });
}

function hideAllMarkers() {
    for (var key in markers) {
        markers[key].forEach(function(marker) {
            marker.setMap(null);
        });
    }
}

function toggleMarkers(category) {
    hideAllMarkers();
    if (typeof markers[category] === 'undefined') return false;
    
    markers[category].forEach(function(marker) {
        marker.setMap(map);
        marker.setAnimation(google.maps.Animation.BOUNCE);
    });
}

function onHtmlClick(location_type, key) {
    google.maps.event.trigger(markers[location_type][key], "click");
}

// Initialize the map
window.initMap = initMap;