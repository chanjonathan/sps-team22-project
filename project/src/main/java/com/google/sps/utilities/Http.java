package com.google.sps.utilities;

import javax.servlet.http.HttpServletRequest;

public class Http {
    public String getParameter(HttpServletRequest request, String name, String defaultValue) {
        String value = request.getParameter(name);
        if (value == null) {
            return defaultValue;
        }
        return value;
    }
}
