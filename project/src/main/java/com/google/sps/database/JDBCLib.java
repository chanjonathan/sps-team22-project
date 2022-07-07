package com.google.sps.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

import com.google.sps.objects.Report;

public class JDBCLib {

    String url = "jdbc:mysql://34.134.208.240:3306/collisionReports";
    String user = "root";
    String password = "qw123456";

    // Require: reportDate of report object should be in the form of "YYYY-MM-DD"
    // Description: insert an entry into table collisionReports
    public void insert(Report report) {
        String Query = "INSERT INTO collisionReports (title, latitude, longitude, reportDate, reportDescription, " +
                "contactDetails, imageURL) \n" +
                "values (\"" + report.title + "\", \"" + report.latitude + "\", \"" + report.longitude +
                "\",  \"" + report.date +"\", \"" + report.description + "\", \"" +
                report.contactDetails + "\", \"" + report.imageURL +"\")";

        try {

            Connection connection = DriverManager.getConnection(url,
                    user, password);

            Statement statement = connection.createStatement();

            statement.executeUpdate(Query);
        } catch (Exception e) {
            e.printStackTrace();
        }


    }

    // Description: print every entry in the table
    // used for test
    public void printEntries() {
        String QUERY = "SELECT * FROM collisionReports";

        try {

            Connection connection = DriverManager.getConnection(url,
                    user, password);

            Statement statement = connection.createStatement();

            ResultSet resultSet = statement.executeQuery(QUERY);

            while (resultSet.next()) {
                System.out.println(resultSet.getString("title"));
                System.out.println(resultSet.getString("latitude"));
                System.out.println(resultSet.getString("longitude"));
                System.out.println(resultSet.getString("reportDate"));
                System.out.println(resultSet.getString("reportDescription"));
                System.out.println(resultSet.getString("contactDetails"));
                System.out.println(resultSet.getString("imageURL"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Description: delete an entry with the given entryID in the table
    public void delete(String entryID) {
        String Query = "delete from collisionReports where entryID = " + entryID;


        try {

            Connection connection = DriverManager.getConnection(url,
                    user, password);

            Statement statement = connection.createStatement();

            statement.executeUpdate(Query);
        } catch (Exception e) {
            e.printStackTrace();

        }

    }

    // Description: update an entry with the given entryID in the table
    // !!! make sure the entryID is correct
    public void update(Report report) {
        String entryID = report.entryID;
        String Query = "UPDATE collisionReports\n" +
                "SET title = \"" + report.title + "\", latitude = \"" + report.latitude + "\", longitude = \"" +
                report.latitude + "\", reportDate = \"" + report.date + "\", reportDescription = \"" +
                report.description + "\", contactDetails = \"" + report.contactDetails + "\", imageURL = \"" +
                report.imageURL + "\"\n" +
                "WHERE entryID = " + entryID + ";";
        try {

            Connection connection = DriverManager.getConnection(url,
                    user, password);

            Statement statement = connection.createStatement();

            statement.executeUpdate(Query);
        } catch (Exception e) {
            e.printStackTrace();

        }
    }

    //
    public Report getEntry(String entryID) {
        String Query = "SELECT * FROM collisionReports where entryID = " + entryID;

        try {

            Connection connection = DriverManager.getConnection(url,
                    user, password);

            Statement statement = connection.createStatement();

            ResultSet resultSet = statement.executeQuery(Query);

            while (resultSet.next()) {
                String title = resultSet.getString("title");
                String latitude = resultSet.getString("latitude");
                String longitude = resultSet.getString("longitude");
                String reportDate = resultSet.getString("reportDate");
                String reportDescription = resultSet.getString("reportDescription");
                String contactDetails = resultSet.getString("contactDetails");
                String imageURL = resultSet.getString("imageURL");

                Report report = new Report(title,latitude,longitude,
                        reportDate,reportDescription,contactDetails,imageURL,entryID);

                return report;
            }

            return null;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    // return all the entries in the table as a list of reports
    public ArrayList<Report>getEntries () {
        String QUERY = "SELECT * FROM collisionReports";
        ArrayList<Report> reports = new ArrayList<>();

        try {

            Connection connection = DriverManager.getConnection(url,
                    user, password);

            Statement statement = connection.createStatement();

            ResultSet resultSet = statement.executeQuery(QUERY);

            while (resultSet.next()) {
                String title = resultSet.getString("title");
                String latitude = resultSet.getString("latitude");
                String longitude = resultSet.getString("longitude");
                String reportDate = resultSet.getString("reportDate");
                String reportDescription = resultSet.getString("reportDescription");
                String contactDetails = resultSet.getString("contactDetails");
                String imageURL = resultSet.getString("imageURL");
                String entryID = resultSet.getString("entryID");

                Report report = new Report(title,latitude,longitude,
                        reportDate,reportDescription,contactDetails,imageURL,entryID);

                reports.add(report);
            }
            return reports;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}