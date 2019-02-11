package eu.reactunion.boilerplate.portlet;

import javax.portlet.RenderRequest;

import com.liferay.portal.kernel.module.configuration.ConfigurationException;
import com.liferay.portal.kernel.theme.PortletDisplay;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.WebKeys;
import eu.reactunion.boilerplate.configuration.ContentConfiguration;
import eu.reactunion.boilerplate.portlet.data.InitData;
import eu.reactunion.boilerplate.portlet.data.Messages;
import org.osgi.service.component.annotations.Component;

import eu.lundegaard.reactunion.support.ReactWidgetSupport;

/**
 * Implementation of {@link ReactWidgetSupport} which returns Init data from portlet instance configuration.
 *
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
@Component(
        immediate = true,
        service = ContentReactWidgetSupport.class
)
public class ContentReactWidgetSupport extends ReactWidgetSupport {

//    @Override
//    public Map<String, Object> getWidgetsInitData(RenderRequest request) {
//        Map<String, Object> initDataMap = new HashMap<>();
//
//        final ThemeDisplay themeDisplay = (ThemeDisplay) request.getAttribute(WebKeys.THEME_DISPLAY);
//        if (themeDisplay != null) {
//            final PortletDisplay portletDisplay = themeDisplay.getPortletDisplay();
//            ContentConfiguration contentConfiguration = null;
//            try {
//                contentConfiguration = portletDisplay.getPortletInstanceConfiguration(ContentConfiguration.class);
//                InitData initData = new InitData();
//                initData.setMessages(new Messages(contentConfiguration.heading(), contentConfiguration.content()));
//                initDataMap.put("content", initData);
//            } catch (ConfigurationException e) {
//                throw new RuntimeException("Configuration error", e);
//            }
//        }
//
//        return initDataMap;
//    }

    @Override
    public Object getWidgetInitData(RenderRequest request) {
        final ThemeDisplay themeDisplay = (ThemeDisplay) request.getAttribute(WebKeys.THEME_DISPLAY);
        if (themeDisplay != null) {
            final PortletDisplay portletDisplay = themeDisplay.getPortletDisplay();
            ContentConfiguration contentConfiguration = null;
            try {
                contentConfiguration = portletDisplay.getPortletInstanceConfiguration(ContentConfiguration.class);
                InitData initData = new InitData();
                initData.setMessages(new Messages(contentConfiguration.heading(), contentConfiguration.content()));
                return initData;
            } catch (ConfigurationException e) {
                throw new RuntimeException("Configuration error", e);
            }
        }
        return null;
    }

    @Override
    public String getWidgetName() {
        return "content";
    }
}
