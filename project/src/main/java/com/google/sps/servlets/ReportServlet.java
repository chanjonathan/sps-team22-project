package com.google.sps.servlets;

import com.google.gson.Gson;
import com.google.sps.database.JDBCLib;
import com.google.sps.objects.Report;
import com.google.sps.database.JDBCLib;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import java.util.ArrayList;

/**
 * Handles requests sent to the /text-form-handler URL. Takes given list and tries to sort and return it.
 */


@WebServlet("/report")
public class ReportServlet extends HttpServlet {

    JDBCLib database;
    Gson gson;

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        database = new JDBCLib();
        gson = new Gson();

        String requestType = getParameter(request, "requestType", "");

        if (requestType.compareTo("query") == 0) {
            String entryID = getParameter(request, "entryID", "");
            Report report = database.getEntry(entryID);
            String jsonReport = gson.toJson(report);

            response.setContentType("text/html;");
            response.getWriter().println(jsonReport);

        } else if (requestType.compareTo("all") == 0) {
            ArrayList<Report> reports = database.getEntries();
            String jsonReports = gson.toJson(reports);

            response.setContentType("text/html;");
            response.getWriter().println(jsonReports);
        } else {
            if (requestType.compareTo("") == 0) {
                throw new IOException("No request type specified");
            } else {
                throw new IOException("Invalid request type: " + requestType);
            }
        }
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

        database = new JDBCLib();

        String requestType = getParameter(request, "requestType", "");
        String redirectURL = getParameter(request, "redirectURL", "");

        if (requestType.compareTo("create") == 0) {
            String title = getParameter(request, "title", "");
            String latitude = getParameter(request, "latitude", "");
            String longitude = getParameter(request, "longitude", "");
            String date = getParameter(request, "date", "");
            String description = getParameter(request, "description", "");
            String contactDetails = getParameter(request, "contactDetails", "");
            String imageURL = getParameter(request, "imageURL", "");
            String entryID = getParameter(request, "entryID", "");

            Report report = new Report(title, latitude, longitude, date, description, contactDetails, imageURL, entryID);

            database.insert(report);
        } else if (requestType.compareTo("update") == 0) {
            String title = getParameter(request, "title", "");
            String latitude = getParameter(request, "latitude", "");
            String longitude = getParameter(request, "longitude", "");
            String date = getParameter(request, "date", "");
            String description = getParameter(request, "description", "");
            String contactDetails = getParameter(request, "contactDetails", "");
            String imageURL = getParameter(request, "imageURL", "");
            String entryID = getParameter(request, "entryID", "");


            Report report = new Report(title, latitude, longitude, date, description, contactDetails, imageURL, entryID);

            database.update(report);
        } else if (requestType.compareTo("delete") == 0) {
            String entryID = getParameter(request, "postID", "");

            database.delete(entryID);
        } else {
            if (requestType.compareTo("") == 0) {
                throw new IOException("No request type specified");
            } else {
                throw new IOException("Invalid request type: " + requestType);
            }
        }

        response.sendRedirect(redirectURL);
    }

    private String getParameter(HttpServletRequest request, String name, String defaultValue) {
        String value = request.getParameter(name);
        if (value == null) {
            return defaultValue;
        }
        return value;
    }
}
