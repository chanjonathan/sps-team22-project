package com.google.sps.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class JDBCLib {

    String url = "jdbc:mysql://34.134.208.240:3306/collisionReports";
    String user = "root";
    String password = "qw123456";

    // Require: reportDate should be in the form of "YYYY-MM-DD"
    // Description: insert an entry into table collisionReports
    public void insert(String title, String latitude, String longitude,
                       String reportDate, String reportDescription, String contactDetails, String imageURL) {
        String Q1 = "INSERT INTO collisionReports (title, latitude, longitude, reportDate, reportDescription, " +
                "contactDetails, imageURL) \n" +
                "values (\"" + title + "\", \"" + latitude + "\", \"" + longitude +
                "\",  \"" + reportDate +"\", \"" + reportDescription + "\", \"" +
                contactDetails + "\", \"" + imageURL +"\")";

        try {

            Connection connection = DriverManager.getConnection(url,
                    user, password);

            Statement statement = connection.createStatement();

            statement.executeUpdate(Q1);
        } catch (Exception e) {
            e.printStackTrace();
        }


    }

    // Description: print every entry in the table
    public void getEntries() {
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







}
