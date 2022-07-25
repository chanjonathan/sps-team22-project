

var map;
var markers = [];
var userLocation;

// Fill start and end time inputs with appropriate datetimes
function fillDateTimes() {
    const date = new Date();
    const offset = (24 * 60 * 60 * 1000) * 7;

    const localNow = (new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString()).slice(0, -1);
    const localStart = (new Date(date.getTime() - date.getTimezoneOffset() * 60000 - offset).toISOString()).slice(0, -1);

    document.getElementById("start-time").value = localStart;
    document.getElementById("end-time").value = localNow;
}


function createMap() {
    // Create a new StyledMapType object, passing it an array of styles,
    // and the name to be displayed on the map type control.
    const styledMapType = new google.maps.StyledMapType(
        [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#202c3e"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "gamma": 0.01
                    },
                    {
                        "lightness": 20
                    },
                    {
                        "weight": "1.39"
                    },
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "weight": "0.96"
                    },
                    {
                        "saturation": "9"
                    },
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 30
                    },
                    {
                        "saturation": "9"
                    },
                    {
                        "color": "#29446b"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "saturation": 20
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 20
                    },
                    {
                        "saturation": -20
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 10
                    },
                    {
                        "saturation": -30
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#193a55"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "saturation": 25
                    },
                    {
                        "lightness": 25
                    },
                    {
                        "weight": "0.01"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "lightness": -20
                    }
                ]
            },
        ],
        {name: "Styled Map"}
    );
    /** Creates a map and adds it to the page. */

    var map = new google.maps.Map(
        document.getElementById('map'),
        {
            center: {lat: 0, lng: 0}, zoom: 1,
            mapTypeControlOptions: {
                mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "styled_map"],
            }
        }
    );
    map.mapTypes.set("styled_map", styledMapType);
    map.setMapTypeId("styled_map");
    map.setZoom(3);

    return map;
}

function setFocus(map) {
    function setCenter(position) {
        let location = {lat: position.coords.latitude, lng: position.coords.longitude}
        map.setCenter(location);
        map.setZoom(11);
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setCenter);
    }
}

// retrieves reporters from server and places corresponding markers
async function placeMarkers() {

    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
        markers[i] = null;
    }

    markers = [];

    const start = document.getElementById("start-time").value;
    const end = document.getElementById("end-time").value;

    const fetchedJSON = await fetch("/list-by-date-and-coordinates?start=" + start + "&end=" + end);
    const reports = await fetchedJSON.json();

    for (let i = 0; i < reports.length; i++) {
        let latitude = parseFloat(reports[i].latitude);
        let longitude = parseFloat(reports[i].longitude);
        let location = {lat: latitude, lng: longitude};

        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(location),
            map: map,
            url: '/',
            animation: google.maps.Animation.DROP,
        })

        var infoWindow = new google.maps.InfoWindow({maxWidth: 400});

        //Attach click event to the marker.
        google.maps.event.addListener(marker, "click", function (e) {
            //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
            var description = reports[i].description;
            var contents = "<div style='font-weight: bold '>" + reports[i].title + "</div><br>";
            contents += "<div style = 'width:100%;min-height:40px'>" + description.substring(0, Math.min(100, description.length)) + "...</div>";
            contents += '<img src= "' + reports[i].imageURLs[0] + '" style = "width:100%"></a>' +
                '<div>' +
                '<a href="/details-page/details.html?entryID=' + reports[i].entryID + '">' +
                '<button >Details</button>' +
                '</a>' +
                '<button onclick = "deleteMarker(' + reports[i].entryID + ')" style="float: right">Delete</button>' +
                '</div>';
            infoWindow.setContent(contents);
            infoWindow.open(map, marker);
        })
        marker.report = reports[i];
        markers.push(marker);
    }
}

async function deleteMarker(id) {
    await fetch('/delete?' + new URLSearchParams({entryID: id}), {method: "DELETE"})
    alert("Report Deleted");
    placeMarkers();
}

function initialize() {
    fillDateTimes();
    map = createMap();
    setFocus(map);
    placeMarkers();
}

window.deleteMarker = deleteMarker;
window.initialize = initialize