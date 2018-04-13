function initMap() {
    // Map options
    var hemadySquare = {
        zoom: 13,
        center: {
            lat: 14.6241,
            lng: 121.0316
        }
    }

    // New map
    var map = new google.maps.Map(document.getElementById('map'), hemadySquare);

    // Array of markers
    var markers = [{
        coords: {
            lat: 14.6241,
            lng: 121.0316
        },
        label: 'H',
        content: 'Hemady Square'
    }];

    // Loop thru markers
    for (let i = 0; i < markers.length; i++) {
        addMarker(markers[i]);
    }

    // Add Marker Function
    function addMarker(props) {
        var marker = new google.maps.Marker({
            position: props.coords,
            map: map,
        });

        // Check for custom icon
        if (props.iconImage) {
            // Set icon image
            marker.setIcon(props.iconImage);
        }

        if (props.label) {
            marker.setLabel(props.label);
        }

        // Check for content
        if (props.content) {
            var infoWindow = new google.maps.InfoWindow({
                content: props.content
            });

            marker.addListener('click', function () {
                infoWindow.open(map, marker);
            });
        }
    }
}