package src.main.java.com.google.sps.objects;

public class Report {

    public String title;
    public String latitude;
    public String longitude;
    public String date;
    public String description;
    public String contactDetails;
    public String imageURL;
    public String entryID;

    public Report(String title,
                  String latitude,
                  String longitude,
                  String date,
                  String description,
                  String contactDetails,
                  String imageURL,
                  String entryID) {

        this.title = title;
        this.latitude = latitude;
        this.longitude = longitude;
        this.date = date;
        this.description = description;
        this.contactDetails = contactDetails;
        this.imageURL = imageURL;
        this.entryID = entryID;
    }
}