package com.google.sps.servlets;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

package com.example.cloudsql;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import javax.sql.DataSource;


@WebServlet("/retrieve-reports2")
public class DatabaseServlet extends HttpServlet {

    HikariConfig config = new HikariConfig();

    config.setJdbcUrl(String.format("jdbc:mysql://hwang-sps-summer22:us-central1:reports/", "collisionReports"));
    config.setUsername("root");
    config.setPassword("qw123456");

    config.addDataSourceProperty("socketFactory", "com.google.cloud.sql.mysql.SocketFactory");
    config.addDataSourceProperty("cloudSqlInstance", INSTANCE_CONNECTION_NAME);

    config.addDataSourceProperty("ipTypes", "PUBLIC,PRIVATE");

    DataSource pool = new HikariDataSource(config);

}