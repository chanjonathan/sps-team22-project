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
    console.log(entryID);

    const fetchedJSON = await fetch("/get-by-id?entryID=" + entryID);
    const report = await fetchedJSON.json();

    document.getElementById("title").innerText = report.title;
    document.getElementById("date").innerText = new Date(report.date).toDateString();
    document.getElementById("description").innerText = report.description;
    document.getElementById("contact-details").innerText = report.contactDetails;
    document.getElementById("image").src = report.imageURL;

}

