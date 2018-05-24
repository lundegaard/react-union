/*
 * Copyright (C) Lundegaard, s.r.o. 2018 - All Rights Reserved
 * Proprietary and confidential. Unauthorized copying of this file, via any medium is strictly prohibited.
 */
package eu.lundegaard.reactunion.support;

import javax.portlet.RenderRequest;
import java.util.HashMap;
import java.util.Map;

import static eu.lundegaard.reactunion.support.ReactUnionConstants.*;

/**
 * Support class for the work with a React widget.
 *
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
public abstract class ReactWidgetSupport implements ReactWidgetAware {

    public static final String UNKNOWN_WIDGET = "unknownWidget";

    /**
     * Sets widget's init data to the request attribute 'reactWidgetInitData_${unionWidget}'.
     *
     * @param request portlet render request
     */
    public void setWidgetsInitData(RenderRequest request) {
        final Map<String, Object> widgetsInitData = getWidgetsInitData(request);
        if (widgetsInitData != null) {
            widgetsInitData.forEach((widgetName, widgetData) ->
                    request.setAttribute(ATTR_WIDGET_INIT_DATA_PREFIX + widgetName, widgetData));
        }
    }

    @Override
    public Map<String, Object> getWidgetsInitData(RenderRequest request) {
        final Object widgetInitData = getWidgetInitData(request);
        Map<String, Object> widgetsInitData = new HashMap<>();
        widgetsInitData.put(getWidgetName(), widgetInitData);
        return widgetsInitData;
    }

    @Override
    public Object getWidgetInitData(RenderRequest request) {
        return null;
    }

    @Override
    public String getWidgetName() {
        return UNKNOWN_WIDGET;
    }
}
