// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


var map;
var markers = [];

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
            {elementType: "geometry", stylers: [{color: "#ebe3cd"}]},
            {elementType: "labels.text.fill", stylers: [{color: "#523735"}]},
            {elementType: "labels.text.stroke", stylers: [{color: "#f5f1e6"}]},
            {
                featureType: "administrative",
                elementType: "geometry.stroke",
                stylers: [{color: "#c9b2a6"}],
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "geometry.stroke",
                stylers: [{color: "#dcd2be"}],
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "labels.text.fill",
                stylers: [{color: "#ae9e90"}],
            },
            {
                featureType: "landscape.natural",
                elementType: "geometry",
                stylers: [{color: "#dfd2ae"}],
            },
            {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{color: "#dfd2ae"}],
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{color: "#93817c"}],
            },
            {
                featureType: "poi.park",
                elementType: "geometry.fill",
                stylers: [{color: "#a5b076"}],
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{color: "#447530"}],
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{color: "#f5f1e6"}],
            },
            {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [{color: "#fdfcf8"}],
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{color: "#f8c967"}],
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{color: "#e9bc62"}],
            },
            {
                featureType: "road.highway.controlled_access",
                elementType: "geometry",
                stylers: [{color: "#e98d58"}],
            },
            {
                featureType: "road.highway.controlled_access",
                elementType: "geometry.stroke",
                stylers: [{color: "#db8555"}],
            },
            {
                featureType: "road.local",
                elementType: "labels.text.fill",
                stylers: [{color: "#806b63"}],
            },
            {
                featureType: "transit.line",
                elementType: "geometry",
                stylers: [{color: "#dfd2ae"}],
            },
            {
                featureType: "transit.line",
                elementType: "labels.text.fill",
                stylers: [{color: "#8f7d77"}],
            },
            {
                featureType: "transit.line",
                elementType: "labels.text.stroke",
                stylers: [{color: "#ebe3cd"}],
            },
            {
                featureType: "transit.station",
                elementType: "geometry",
                stylers: [{color: "#dfd2ae"}],
            },
            {
                featureType: "water",
                elementType: "geometry.fill",
                stylers: [{color: "#b9d3c2"}],
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{color: "#92998d"}],
            },
        ],
        {name: "Styled Map"}
    );
    /** Creates a map and adds it to the page. */

    map = new google.maps.Map(
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
        console.log(location);
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(location),
            map: map,
            url: '/',
            animation: google.maps.Animation.DROP,
        })

        var infoWindow = new google.maps.InfoWindow();

        //Attach click event to the marker.
        google.maps.event.addListener(marker, "click", function (e) {
            //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
            var description = reports[i].description;
            var contents = "<div style='font-weight: bold '>" + reports[i].title + "</div><br>";
            contents += "<div style = 'width:100%;min-height:40px'>" + description.substring(0,Math.min(100,description.length)) + "....</div>";
            contents += '<img src= "' + reports[i].imageURL +  '"style = "width:100%"></a><div><button  onclick = "DeleteMarker(' + reports[i].entryID + ')" >Delete</button><a href="/details-page/details.html?entryID=' + reports[i].entryID + '"><button >Details</button></div></a>';
            infoWindow.setContent(contents);
            infoWindow.open(map, marker);

        })       

        marker.report = reports[i];
        markers.push(marker);
    }
}

async function DeleteMarker(id) {
    await fetch('/delete?' + new URLSearchParams({entryID: id}), {method: "DELETE"})
    alert("Report Deleted");
    placeMarkers();
}

function initialize() {
    fillDateTimes();
    createMap();
    placeMarkers();
}

window.initialize = initialize

