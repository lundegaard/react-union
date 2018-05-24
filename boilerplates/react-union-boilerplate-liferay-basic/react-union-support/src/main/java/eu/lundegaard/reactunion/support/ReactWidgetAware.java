/*
 * Copyright (C) Lundegaard, s.r.o. 2018 - All Rights Reserved
 * Proprietary and confidential. Unauthorized copying of this file, via any medium is strictly prohibited.
 */
package eu.lundegaard.reactunion.support;

import javax.portlet.RenderRequest;
import java.util.Map;

/**
 * Interface that provides information about React Widget.
 *
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
interface ReactWidgetAware {

    /**
     * Name of supported widget.
     *
     * @return name of supported widget
     */
    String getWidgetName();

    /**
     * Returns widget's init data.
     *
     * @param request
     * @return widget's init data
     */
    Object getWidgetInitData(RenderRequest request);

    /**
     * Returns map of (widgetName, widgetInitData).
     *
     * @param request
     * @return map of (widgetName, widgetInitData)
     */
    Map<String, Object> getWidgetsInitData(RenderRequest request);

}
