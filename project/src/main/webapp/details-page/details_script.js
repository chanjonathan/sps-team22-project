import {createMap} from '../map/map.js';

var map;
var marker = null;
var report;
var edit = false;
var mapListener;

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
        viewElements[i].style.visibility = "visible";
    }
}

function editMode() {
    document.getElementById("edit-title-container").value = report.title;
    document.getElementById("edit-date-container").value = report.date
    document.getElementById("edit-description-container").value = report.description;
    document.getElementById("edit-contact-details-container").value = report.contactDetails;
    document.getElementById("edit-image-container").src = report.imageURL;
    document.getElementById("new-image-upload-container").value = "";

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
    let image = null;
    let data = new FormData()

    if (document.getElementById("edit-image-container").src !== report.imageURL) {
        image = document.getElementById("new-image-upload-container").files[0];
        data.append('image', image)
    }

    fetch('/put?' +
        new URLSearchParams(
            {
                title: document.getElementById("edit-title-container").value,
                latitude: marker.getPosition().lat().toString(),
                longitude: marker.getPosition().lng().toString(),
                date: document.getElementById("edit-date-container").value,
                description: document.getElementById("edit-description-container").value,
                contactDetails: document.getElementById("edit-contact-details-container").value,
                imageURL: report.imageURL,
                entryID: report.entryID,
            }),
        {method: "PUT", body: data}
    ).then(() => {
        loadDetails().then(() => {
            toggleMode();
            placeMarker();
        });
    });
}

function toggleMap() {
    if (edit === true) {
        mapListener = google.maps.event.addListener(map, "click", (mapsMouseEvent) => {
            newMarker(mapsMouseEvent)
        });
    } else {
        google.maps.event.removeListener(mapListener);
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
    });
}

function placeMarker() {
    if (marker != null) {
        marker.setMap(null);
        marker = null;
    }
    let location = {lat: parseFloat(report.latitude), lng: parseFloat(report.longitude)};
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(location),
        map: map,
        url: '/',
        animation: google.maps.Animation.DROP
    });
    map.setCenter(location);
    map.setZoom(10);
}

function loadImage(event) {
    let image = document.getElementById('edit-image-container');
    image.src = URL.createObjectURL(event.target.files[0]);
}

function addListeners() {
    document.getElementById("delete-button").addEventListener("click", deletePost);
    document.getElementById("edit-button").addEventListener("click", editMode);
    document.getElementById("save-button").addEventListener("click", saveEdits);
    document.getElementById("cancel-button").addEventListener("click", cancel);
    document.getElementById("new-image-upload-container").addEventListener("change", (event) => {
        loadImage(event)
    });
}

function initialize() {
    addListeners();
    setDetails();
    map = createMap();
    loadDetails().then(() => placeMarker());
}

window.initialize = initialize;
