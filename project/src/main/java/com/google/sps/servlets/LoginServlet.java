package com.google.sps.servlets;

import com.google.common.hash.Hashing;
import com.google.sps.database.JDBCLib;
import com.google.sps.utilities.Http;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;

/**
 * Handles requests sent to the /text-form-handler URL. Takes given list and tries to sort and return it.
 */


@WebServlet("/delete")
@MultipartConfig

public class LoginServlet extends HttpServlet {

    JDBCLib database;
    Http http;

    public LoginServlet() {
        database = new JDBCLib();
        http = new Http();
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String username = http.getParameter(request, "username", "");
        String password = http.getParameter(request, "password", "");

        String passwordHash = Hashing.sha256().hashString("your input", StandardCharsets.UTF_8).toString();
        String storedHash = null;

        try {
            storedHash = database.getStoredHash(username);
        } catch (SQLException sqlException) {
            ServletException servletException = new ServletException(sqlException.getMessage());
            servletException.setStackTrace(sqlException.getStackTrace());
            throw servletException;
        }

        if (storedHash == null) {
            // username not found
            return;
        }

        if (storedHash.compareTo(passwordHash) == 0) {
            // grant access
        } else {
            // username and password do not match
        }
    }
}
