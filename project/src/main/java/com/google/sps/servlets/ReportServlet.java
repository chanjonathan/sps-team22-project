package com.google.sps.servlets;

import com.google.cloud.storage.*;
import com.google.gson.Gson;
import com.google.sps.database.JDBCLib;
import com.google.sps.objects.Report;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 * Handles requests sent to the /text-form-handler URL. Takes given list and tries to sort and return it.
 */


@WebServlet("/report-handler")
@MultipartConfig

public class ReportServlet extends HttpServlet {

    JDBCLib database;
    Gson gson;

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

        database = new JDBCLib();
        gson = new Gson();

        String requestType = getParameter(request, "requestType", "");

        if (requestType.compareTo("query") == 0) {
            String entryID = getParameter(request, "entryID", "");
            Report report = null;
            try {
                report = database.getEntry(entryID);
            } catch (SQLException e) {
                IOException e2 = new IOException(e.getMessage());
                e2.setStackTrace(e.getStackTrace());
                throw e2;
            }
            String jsonReport = gson.toJson(report);

            response.setContentType("text/html;");
            response.getWriter().println(jsonReport);
        } else if (requestType.compareTo("all") == 0) {
            ArrayList<Report> reports = null;
            try {
                reports = database.getEntries();
            } catch (SQLException exception) {
                IOException newException = new IOException(exception.getMessage());
                newException.setStackTrace(exception.getStackTrace());
                throw newException;
            }
            String jsonReports = gson.toJson(reports);

            response.setContentType("text/html;");
            response.getWriter().println(jsonReports);
        } else {
            if (requestType.compareTo("") == 0) {
                throw new ServletException("No request type specified");
            } else {
                throw new ServletException("Invalid request type: " + requestType);
            }
        }
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

        database = new JDBCLib();

        String requestType = getParameter(request, "requestType", "");
//        String redirectURL = getParameter(request, "redirectURL", "");

        if (requestType.compareTo("create") == 0) {
            String title = getParameter(request, "title", "");
            String latitude = getParameter(request, "latitude", "");
            String longitude = getParameter(request, "longitude", "");
            String date = getParameter(request, "date", "");
            String description = getParameter(request, "description", "");
            String contactDetails = getParameter(request, "contactDetails", "");
            String entryID = "";

            Part filePart = request.getPart("image");
            String fileName = filePart.getSubmittedFileName();
            InputStream fileInputStream = filePart.getInputStream();
            String imageURL = uploadToCloudStorage(fileName, fileInputStream);

            Report report = new Report(title, latitude, longitude, date, description, contactDetails, imageURL, entryID);

            try {
                database.insert(report);
            } catch (SQLException exception) {
                IOException newException = new IOException(exception.getMessage());
                newException.setStackTrace(exception.getStackTrace());
                throw newException;
            }

        } else if (requestType.compareTo("update") == 0) {
            String title = getParameter(request, "title", "");
            String latitude = getParameter(request, "latitude", "");
            String longitude = getParameter(request, "longitude", "");
            String date = getParameter(request, "date", "");
            String description = getParameter(request, "description", "");
            String contactDetails = getParameter(request, "contactDetails", "");
            String entryID = getParameter(request, "entryID", "");

            String imageURL = getParameter(request, "imageURL", "");
            if (imageURL.compareTo("") == 0) {
                Part filePart = request.getPart("image");
                String fileName = filePart.getSubmittedFileName();
                InputStream fileInputStream = filePart.getInputStream();
                imageURL = uploadToCloudStorage(fileName, fileInputStream);
            }

            Report report = new Report(title, latitude, longitude, date, description, contactDetails, imageURL, entryID);

            try {
                database.update(report);
            } catch (SQLException exception) {
                IOException newException = new IOException(exception.getMessage());
                newException.setStackTrace(exception.getStackTrace());
                throw newException;
            }

        } else if (requestType.compareTo("delete") == 0) {
            String entryID = getParameter(request, "postID", "");

            try {
                database.delete(entryID);
            } catch (SQLException exception) {
                IOException newException = new IOException(exception.getMessage());
                newException.setStackTrace(exception.getStackTrace());
                throw newException;
            }

        } else {
            if (requestType.compareTo("") == 0) {
                throw new ServletException("No request type specified");
            } else {
                throw new ServletException("Invalid request type: " + requestType);
            }
        }

//        response.sendRedirect(redirectURL);
    }

    private static String uploadToCloudStorage(String fileName, InputStream fileInputStream) {
        String projectId = "jchan-sps-summer22";
        String bucketName = "jchan-sps-summer22.appspot.com";
        Storage storage =
                StorageOptions.newBuilder().setProjectId(projectId).build().getService();
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

        // Upload the file to Cloud Storage.
        Blob blob = storage.create(blobInfo, fileInputStream);

        // Return the uploaded file's URL.
        return blob.getMediaLink();
    }

    private String getParameter(HttpServletRequest request, String name, String defaultValue) {
        String value = request.getParameter(name);
        if (value == null) {
            return defaultValue;
        }
        return value;
    }
}
