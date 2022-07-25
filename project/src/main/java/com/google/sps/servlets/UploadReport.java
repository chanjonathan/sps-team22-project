package com.google.sps.servlets;

//Database

import com.google.cloud.storage.*;
import com.google.gson.Gson;
import com.google.sps.database.JDBCLib;
import com.google.sps.objects.Report;
import com.google.sps.utilities.Http;

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
import java.util.List;
import java.util.stream.Collectors;

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
        ArrayList<String> imageURLs = cloudImg(request, response);

        //Creates report object and adds it to database
        Report report = new Report(title, latitude, longitude, date, description, contactDetails, imageURLs, entryID);
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
    public ArrayList<String> cloudImg(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Get the file chosen by the user.
        List<Part> fileParts = request.getParts().stream().
                filter(part -> "images".equals(part.getName())).collect(Collectors.toList());

        ArrayList<String> uploadedFileUrls = new ArrayList<String>();
        for (Part filePart : fileParts) {
            String fileName = filePart.getSubmittedFileName();
            InputStream fileInputStream = filePart.getInputStream();

            if (fileName.compareTo("") != 0) {
                String uploadedFileUrl = uploadToCloudStorage(fileName, fileInputStream);
                if (uploadedFileUrl == null) {
                    uploadedFileUrl = "";
                }
                uploadedFileUrls.add(uploadedFileUrl);
            }
        }
        return uploadedFileUrls;
    }

    /**
     * Uploads a file to Cloud Storage and returns the uploaded file's URL.
     */
    private static String uploadToCloudStorage(String fileName, InputStream fileInputStream) {
        fileName += System.currentTimeMillis();

        String projectId = "jchan";
        String bucketName = "jchan-sps-summer22.appspot.com";
        Storage storage = StorageOptions.newBuilder().setProjectId(projectId).build().getService();
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

        // Upload the file to Cloud Storage.
        Blob blob = storage.create(blobInfo, fileInputStream);

        // Return the uploaded file's URL.
        return blob.getMediaLink();
    }
}