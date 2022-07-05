package com.google.sps.servlets;

import java.io.IOException;
import java.util.ArrayList;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import org.javatuples;
import org.javatuples.Tuple;

import src.main.java.com.google.sps.objects.Report;


/**
 * Handles requests sent to the /text-form-handler URL. Takes given list and tries to sort and return it.
 */


@WebServlet("/reports")
public class ReportsServlet extends HttpServlet {


    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {


        String nwLongitude = getParameter(request, "nwLongitude", "");
        String nwLatitude = getParameter(request, "Latitudeget", "");

        String seLongitude = getParameter(request, "seLongitude", "");
        String seLatitude = getParameter(request, "seLatitude", "");

        ArrayList<Report> reports = new ArrayList<Report>();

        // method for instantiating report with correct arguments from database to be implemented later
        // a test report list for now
        Report report1 = new Report("crash1", "2020-2-20", "crash happen", "100", "200", "asdf@asdf.com", "google.com");
        Report report2 = new Report("crash2", "2020-2-21", "crash happened again", "200", "100", "qwer@qwer.com", "bing.com");
        reports.add(report1);
        reports.add(report2);

        Gson gson = new Gson();
        String jsonReports = gson.toJson(reports);

        response.setContentType("text/html;");
        response.getWriter().println(jsonReports);
    }


    private String getParameter(HttpServletRequest request, String name, String defaultValue) {
        String value = request.getParameter(name);
        if (value == null) {
            return defaultValue;
        }
        return value;
    }
}
