package src.main.java.com.google.sps.servlets;

import com.google.gson.Gson;
import src.main.java.com.google.sps.objects.Report;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


/**
 * Handles requests sent to the /text-form-handler URL. Takes given list and tries to sort and return it.
 */


@WebServlet("/report")
public class ReportsServlet extends HttpServlet {


    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        String requestType = getParameter(request, "reportID", "");


            Report report = new Report("crash", "100", "200", "2020-2-20", "crash happen", "asdf@asdf.com", "google.com");

            Gson gson = new Gson();
            String jsonReport = gson.toJson(report);

            response.setContentType("text/html;");
            response.getWriter().println(jsonReport);

    }


    private String getParameter(HttpServletRequest request, String name, String defaultValue) {
        String value = request.getParameter(name);
        if (value == null) {
            return defaultValue;
        }
        return value;
    }
}
