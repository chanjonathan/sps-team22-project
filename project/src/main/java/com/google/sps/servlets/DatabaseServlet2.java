package com.google.sps.servlets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.DriverManager;


import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/retrieve-reports")
public class DatabaseServlet2 extends HttpServlet {

    public static final String CREDENTIALS_STRING = "jdbc:mysql://hwang-sps-summer22:us-central1:reports/collisionReports?user=root&password=qw123456&useSSL=false&useLegacyDatetimeCode=false&serverTimezone=UTC";
    static Connection connection;

    public static void initConnection() {
        if (connection != null) {
            System.out.println("[WARN] Connection has already been established.");
            return;
        }

        try {
            Class.forName("com.sql.cj.jdbc.Driver");
        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }

    public static void addUser(String username, String password) {
        try {
            PreparedStatement preparedStatement = connection.prepareStatement("INSERT INTO UserRegistry(username, pw) VALUES (?,?)");
            preparedStatement.setString(1, username);
            preparedStatement.setString(2, password);
            preparedStatement.execute();
            preparedStatement.close();
        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }
}