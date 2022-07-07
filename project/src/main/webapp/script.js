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


/**
 * creatMap function create a map on the homepage
 */
function createMap(){
    // Create a new StyledMapType object, passing it an array of styles,
    // and the name to be displayed on the map type control.
    const styledMapType = new google.maps.StyledMapType(
      [
        { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#c9b2a6" }],
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "geometry.stroke",
          stylers: [{ color: "#dcd2be" }],
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "labels.text.fill",
          stylers: [{ color: "#ae9e90" }],
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry",
          stylers: [{ color: "#dfd2ae" }],
        },
        {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ color: "#dfd2ae" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#93817c" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry.fill",
            stylers: [{ color: "#a5b076" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#447530" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#f5f1e6" }],
          },
          {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [{ color: "#fdfcf8" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#f8c967" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#e9bc62" }],
          },
          {
            featureType: "road.highway.controlled_access",
            elementType: "geometry",
            stylers: [{ color: "#e98d58" }],
          },
          {
            featureType: "road.highway.controlled_access",
            elementType: "geometry.stroke",
            stylers: [{ color: "#db8555" }],
          },
          {
            featureType: "road.local",
            elementType: "labels.text.fill",
            stylers: [{ color: "#806b63" }],
          },
          {
            featureType: "transit.line",
            elementType: "geometry",
            stylers: [{ color: "#dfd2ae" }],
          },
          {
            featureType: "transit.line",
            elementType: "labels.text.fill",
            stylers: [{ color: "#8f7d77" }],
          },
          {
            featureType: "transit.line",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#ebe3cd" }],
          },
          {
            featureType: "transit.station",
            elementType: "geometry",
            stylers: [{ color: "#dfd2ae" }],
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{ color: "#b9d3c2" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#92998d" }],
          },
        ],
        { name: "Styled Map" }
      );
/** Creates a map and adds it to the page. */

    const map = new google.maps.Map(
        document.getElementById('map'),
        {center: {lat: 0, lng: 0}, zoom: 1,
        mapTypeControlOptions: {
            mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "styled_map"],
          }
        }
    );   
    map.mapTypes.set("styled_map", styledMapType);
    map.setMapTypeId("styled_map");
     
    var locations = [
        {lat: -25.344, lng: 131.031},
        {lat: -10.344, lng: 120.031},
        {lat: -5.344, lng: 110.031},
      ];

      var markers = [
        {
            "title": 'Aksa Beach',
            "lat": '-25.344',
            "lng": '131.031',
            "description": 'Aksa Beach is a popular beach and a vacation spot in Aksa village at Malad, Mumbai.',
            "link": "https://www.google.com/maps/place/Aksa+Beach/@19.1760517,72.7908969,16z/data=!3m1!4b1!4m5!3m4!1s0x3be7b42e695a7097:0x48523c8334d8edf7!8m2!3d19.1759612!4d72.7953513"
        },
        {
            "title": 'Juhu Beach',
            "lat": '-10.344',
            "lng": '120.031',
            "description": 'Juhu Beach is one of favourite tourist attractions situated in Mumbai.',
            "link": "https://www.google.com/maps/place/Juhu,+Mumbai,+Maharashtra+400049,+India/@19.1012636,72.8120342,14z/data=!3m1!4b1!4m5!3m4!1s0x3be7c9bf95d4ba07:0x35047c9c36b6cea1!8m2!3d19.1075424!4d72.8263142"
        },
        {
            "title": 'Girgaum Beach',
            "lat": '18.9542149',
            "lng": '72.81203529999993',
            "description": 'Girgaum Beach commonly known as just Chaupati is one of the most famous public beaches in Mumbai.',
            "link": "https://www.google.com/maps/place/Girgaon+Chowpatty/@18.9530436,72.8089395,16z/data=!3m1!4b1!4m5!3m4!1s0x3be7ce0f19846e49:0xdc9efea85298c9bf!8m2!3d18.9518622!4d72.8165592"
        },
        {
            "title": 'Jijamata Udyan',
            "lat": '-5.344',
            "lng": '110.031',
            "description": 'Jijamata Udyan is situated near Byculla station is famous as Mumbai (Bombay) Zoo.',
            "link": 'https://www.google.com/maps/search/Jijamata+Udyan/@18.980938,72.8328219,17z/data=!3m1!4b1'
        }
        ];
    
    for (var i = 0; i < locations.length; i++) { 
        var data = markers[i]; //
        var myLatlng = new google.maps.LatLng(data.lat, data.lng); //
      marker = new google.maps.Marker({
        // position: new google.maps.LatLng(locations[i]),
        position: myLatlng,
        map: map,
        url:'/',
        titel:data.title,
        animation:google.maps.Animation.DROP
        
      });

      var infoWindow = new google.maps.InfoWindow();
      //Attach click event to the marker.
      (function (marker, data) {
        google.maps.event.addListener(marker, "click", function (e) {
            //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
            var contents = "<div style = 'width:200px;min-height:40px'>" + data.description + "</div>";
            contents += '<p>Attribution: click to view details, <a href= "' + data.link +  '">' + data.link + '</a>';
            infoWindow.setContent(contents);
            infoWindow.open(map, marker);
        });
    })(marker, data);		
      }	 
    }
window.createMap = createMap
