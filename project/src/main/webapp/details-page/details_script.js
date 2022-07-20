import {createMap} from '../map/map.js';

var map;
var marker = null;
var report;
var edit = false;

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
    const entryID = GetURLParameter("entryID");

    const fetchedJSON = await fetch("/get-by-id?entryID=" + entryID);
    report = await fetchedJSON.json();

    document.getElementById("title-container").innerText = report.title;
    document.getElementById("date-container").innerText = new Date(report.date).toDateString();
    document.getElementById("description-container").innerText = report.description;
    document.getElementById("contact-details-container").innerText = report.contactDetails;
    document.getElementById("image-container").src = report.imageURL;
}

async function deletePost() {
    await fetch('/delete?' + new URLSearchParams({entryID: report.entryID}), {method: "DELETE"})
    alert("Report Deleted");
    window.location.href = "/index.html";
}

function toggleDetails() {
    const editElements = document.getElementsByClassName("Edit");
    for (let i = 0; i < editElements.length; i++) {
        if (edit === true) {
            editElements[i].style.display = "";
        } else {
            editElements[i].style.display = "none";
        }
    }
    const viewElements = document.getElementsByClassName("View");
    for (let i = 0; i < viewElements.length; i++) {
        if (edit === true) {
            viewElements[i].style.display = "none";
        } else {
            viewElements[i].style.display = "";
        }
    }
}

function setDetails() {
    const editElements = document.getElementsByClassName("Edit");
    for (let i = 0; i < editElements.length; i++) {
        editElements[i].style.display = "none";
        editElements[i].style.visibility = "visible";

    }
    const viewElements = document.getElementsByClassName("View");
    for (let i = 0; i < viewElements.length; i++) {
        viewElements[i].style.display = "";
    }
}

function editMode() {
    document.getElementById("edit-title-container").value = report.title;
    document.getElementById("edit-date-container").value = report.date
    document.getElementById("edit-description-container").value = report.description;
    document.getElementById("edit-contact-details-container").value = report.contactDetails;
    document.getElementById("edit-image-container").src = report.imageURL;

    toggleMode();
}

function toggleMode() {
    edit = !edit;
    toggleDetails();
    toggleMap();
}

function cancel() {
    toggleMode();
    placeMarker();
}

async function saveEdits() {
    fetch('/put?' + new URLSearchParams(
        {
            title: document.getElementById("edit-title-container").value,
            latitude: marker.position.lat.toString(),
            longitude: marker.position.lng.toString(),
            date: document.getElementById("edit-date-container").value,
            description: document.getElementById("edit-description-container").value,
            contactDetails: document.getElementById("edit-contact-details-container").value,
            imageURL: report.imageURL,
            entryID: report.entryID,
        }),
        {method: "PUT"}).then(() => {
        loadDetails().then(() => {
            toggleMode();
            placeMarker();
        });
    });
}

function toggleMap() {
    if (edit === true) {
        map.addListener("click", (mapsMouseEvent) => {
            newMarker(mapsMouseEvent)
        });
    } else {
        map.removeListener("click", (mapsMouseEvent) => {
            newMarker(mapsMouseEvent)
        });
        placeMarker();
    }
}

function newMarker(mapsMouseEvent) {
    if (marker != null) {
        marker.setMap(null);
        marker = null;
    }
    marker = new google.maps.Marker({
        position: mapsMouseEvent.latLng,
        map: map,
        url: '/',
        animation: google.maps.Animation.DROP,
    })
}

function placeMarker() {
    if (marker != null) {
        marker.setMap(null);
        marker = null;
    }
    let location = {lat: parseInt(report.latitude), lng: parseInt(report.longitude)};
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(location),
        map: map,
        url: '/',
        animation: google.maps.Animation.DROP
    });
    map.setCenter(location);
    map.setZoom(10);
}

function addListeners() {
    document.getElementById("delete-button").addEventListener("click", deletePost);
    document.getElementById("edit-button").addEventListener("click", editMode);
    document.getElementById("save-button").addEventListener("click", saveEdits);
    document.getElementById("cancel-button").addEventListener("click", cancel);
}

function initialize() {
    addListeners();
    setDetails();
    map = createMap();
    loadDetails().then(() => placeMarker());
}

window.initialize = initialize;
