package com.google.sps.servlets;

//Database
import com.google.cloud.storage.*;
import com.google.gson.Gson;
import com.google.sps.database.JDBCLib;
import com.google.sps.objects.Report;

//Multi-input Form
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//Exception Handling
import java.io.IOException;
import javax.servlet.ServletException;

//Cloud Storage
import java.io.InputStream;
import javax.servlet.http.Part;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;


@WebServlet("/upload")
@MultipartConfig
public class UploadReport extends HttpServlet {

    JDBCLib database;
    Gson gson;
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        database = new JDBCLib();

        //Retrieves all the data from the submitted form
        String title = getParameterOrDefault(request, "title", "");
        String latitude = getParameterOrDefault(request, "latitude", "");
        String longitude = getParameterOrDefault(request, "longitude", "");
        String date = getParameterOrDefault(request, "time", "");
        String description = getParameterOrDefault(request, "description", "");
        String contactDetails = getParameterOrDefault(request, "phone", "");
        String entryID = "";
        String imageURL = cloudImg(request, response);

        //Creates report object and adds it to database
        Report report = new Report(title, latitude, longitude, date, description, contactDetails, imageURL, entryID);
        database.insert(report);

        response.sendRedirect("/");
    }

    //Ensures no null values in database
    private String getParameterOrDefault(HttpServletRequest request, String name, String defaultValue) {
        String value = request.getParameter(name);
        if (value == null) {
            return defaultValue;
        }
        return value;
    }

    /** Takes an image submitted by the user and uploads it to Cloud Storage, returns needed URL or "" if none */
    public String cloudImg(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Get the file chosen by the user.
        Part filePart = request.getPart("image");
        String fileName = filePart.getSubmittedFileName();
        InputStream fileInputStream = filePart.getInputStream();

        // Upload the file and get its URL
        String uploadedFileUrl = uploadToCloudStorage(fileName, fileInputStream);
        
        if (uploadedFileUrl == null){
            return "";
        }
        return uploadedFileUrl;
    }

    /** Uploads a file to Cloud Storage and returns the uploaded file's URL. */
    private static String uploadToCloudStorage(String fileName, InputStream fileInputStream) {
        String projectId = "michelleli";
        String bucketName = "michelleli-sps-summer22.appspot.com";
        Storage storage =
            StorageOptions.newBuilder().setProjectId(projectId).build().getService();
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

        // Upload the file to Cloud Storage.
        Blob blob = storage.create(blobInfo, fileInputStream);

        // Return the uploaded file's URL.
        return blob.getMediaLink();
    }
}