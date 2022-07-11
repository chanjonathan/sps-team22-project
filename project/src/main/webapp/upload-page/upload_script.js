/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
<<<<<<< HEAD

//Creates searchable roadmap for users to click on
function initAutocomplete() {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 0, lng: 0 },
      zoom: 2,
=======
// @ts-nocheck TODO remove when fixed
// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initAutocomplete() {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: 0, lng: 0},
      zoom: 1,
>>>>>>> ec2c0ce4d528d034d32b449e10a0a7424d0c8ba8
      mapTypeId: "roadmap",
    });
    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);
  
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });
  
    let markers = [];
  
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
  
      if (places.length == 0) {
        return;
      }
  
      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];
  
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
  
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }
  
<<<<<<< HEAD
=======
        const icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
  
>>>>>>> ec2c0ce4d528d034d32b449e10a0a7424d0c8ba8
        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
<<<<<<< HEAD
=======
            icon,
>>>>>>> ec2c0ce4d528d034d32b449e10a0a7424d0c8ba8
            title: place.name,
            position: place.geometry.location,
          })
        );
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
<<<<<<< HEAD
    
    //Creates event handling for clicking on the map -> drops a pin and updates coordinates
    map.addListener("click", (mapsMouseEvent) => {
      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];
  
      // Gets coords for the user's choice
      const myJSON = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
      console.log(myJSON)

      //Then create a new marker for user's choice
      markers.push(
        new google.maps.Marker({
          map,
          title: myJSON,
          position: mapsMouseEvent.latLng,
        })
      );

      //Gets coordinate box to update with dropped pin
      var coords = document.getElementById('coordinates');
      coords.value = myJSON;
      let JSONcoords = JSON.parse(myJSON);      
      var latitude = document.getElementById('latitude');
      latitude.value = JSONcoords.lat;
      var longitude = document.getElementById('longitude');
      longitude.value = JSONcoords.lng;
    });
  }
  
  window.initAutocomplete = initAutocomplete;

=======
}
  
window.initAutocomplete = initAutocomplete;  

function saveReport(){
    
}
>>>>>>> ec2c0ce4d528d034d32b449e10a0a7424d0c8ba8
