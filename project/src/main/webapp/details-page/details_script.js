import {createMap} from '../map/map.js';

var map;
var entryID;
var latitude;
var longitude;

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

async function loadDetails() {
    entryID = GetURLParameter("entryID");

    const fetchedJSON = await fetch("/get-by-id?entryID=" + entryID);
    const report = await fetchedJSON.json();

    document.getElementById("title-container").innerText = report.title;
    document.getElementById("date-container").innerText = new Date(report.date).toDateString();
    document.getElementById("description-container").innerText = report.description;
    document.getElementById("contact-details-container").innerText = report.contactDetails;
    document.getElementById("image-container").src = report.imageURL;

    document.getElementById("delete-button").addEventListener("click", deletePost);

    latitude = parseInt(report.latitude);
    longitude = parseInt(report.longitude);
}

async function deletePost() {
    await fetch('/delete?' + new URLSearchParams({entryID: entryID}), {method: "DELETE"})
    alert("Report Deleted");
    window.location.href = "/index.html"
}

async function placeMarker() {
    let location = {lat: latitude, lng: longitude};
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(location),
        map: map,
        url: '/',
        animation: google.maps.Animation.DROP
    });
    map.setCenter(location);
    map.setZoom(10);
}

function initialize() {
    map = createMap();
    loadDetails().then(() => placeMarker());
}

window.initialize = initialize;
