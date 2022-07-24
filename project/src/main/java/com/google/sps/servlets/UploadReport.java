package com.google.sps.servlets;

//Database

import com.google.sps.utilities.Http;

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

//Multi-input Form
//Exception Handling
//Cloud Storage


@WebServlet("/upload")
@MultipartConfig
public class UploadReport extends HttpServlet {

    JDBCLib database;
    Gson gson;
    Http http;

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        database = new JDBCLib();
        http = new Http();

        //Retrieves all the data from the submitted form
        String title = http.getParameter(request, "title", "");
        String latitude = http.getParameter(request, "latitude", "");
        String longitude = http.getParameter(request, "longitude", "");
        String date = http.getParameter(request, "time", "");
        String description = http.getParameter(request, "description", "");
        String contactDetails = http.getParameter(request, "phone", "");
        String entryID = "";
        String imageURL = cloudImg(request, response);

        //Creates report object and adds it to database
        Report report = new Report(title, latitude, longitude, date, description, contactDetails, imageURL, entryID);
        try {
            database.insert(report);
        } catch (SQLException sqlException) {
            ServletException servletException = new ServletException(sqlException.getMessage());
            servletException.setStackTrace(sqlException.getStackTrace());
            throw servletException;
        }

        response.sendRedirect("/");
    }

    /**
     * Takes an image submitted by the user and uploads it to Cloud Storage, returns needed URL or "" if none
     */
    public String cloudImg(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Get the file chosen by the user.
        Part filePart = request.getPart("image");
        String fileName = filePart.getSubmittedFileName();
        InputStream fileInputStream = filePart.getInputStream();

        // Upload the file and get its URL
        String uploadedFileUrl = uploadToCloudStorage(fileName, fileInputStream);

        if (uploadedFileUrl == null) {
            return "";
        }
        return uploadedFileUrl;
    }

    /**
     * Uploads a file to Cloud Storage and returns the uploaded file's URL.
     */
    private static String uploadToCloudStorage(String fileName, InputStream fileInputStream) {
        String projectId = "michelleli";
        String bucketName = "michelleli-sps-summer22.appspot.com";
        Storage storage = StorageOptions.newBuilder().setProjectId(projectId).build().getService();
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

        // Upload the file to Cloud Storage.
        Blob blob = storage.create(blobInfo, fileInputStream);

        // Return the uploaded file's URL.
        return blob.getMediaLink();
    }
}