package eu.reactunion.boilerplate.portlet;

import javax.portlet.RenderRequest;

import com.liferay.portal.kernel.module.configuration.ConfigurationException;
import com.liferay.portal.kernel.theme.PortletDisplay;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.WebKeys;
import eu.reactunion.boilerplate.configuration.HeroConfiguration;
import org.osgi.service.component.annotations.Component;

import eu.lundegaard.reactunion.support.ReactWidgetSupport;

/**
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
@Component(
        immediate = true,
        service = ReactWidgetSupport.class
)
public class HeroReactWidgetSupport extends ReactWidgetSupport {

//    @Override
//    public Map<String, Object> getWidgetsInitData(RenderRequest request) {
//        Map<String, Object> initData = new HashMap<>();
//
//        final ThemeDisplay themeDisplay = (ThemeDisplay) request.getAttribute(WebKeys.THEME_DISPLAY);
//        if (themeDisplay != null) {
//            final PortletDisplay portletDisplay = themeDisplay.getPortletDisplay();
//            HeroConfiguration heroConfiguration = null;
//            try {
//                heroConfiguration = portletDisplay.getPortletInstanceConfiguration(HeroConfiguration.class);
//                initData.put("content", "{\n" +
//                        "        \"textation\": {\n" +
//                        "            \"heading\": \"" + heroConfiguration.heading() + "\",\n" +
//                        "            \"content\": \"" + heroConfiguration.content() + "\"\n" +
//                        "        }\n" +
//                        "    }");
//            } catch (ConfigurationException e) {
//                throw new RuntimeException("Configuration error", e);
//            }
//        }
//
//        return initData;
//    }

    @Override
    public Object getWidgetInitData(RenderRequest request) {
        final ThemeDisplay themeDisplay = (ThemeDisplay) request.getAttribute(WebKeys.THEME_DISPLAY);
        if (themeDisplay != null) {
            final PortletDisplay portletDisplay = themeDisplay.getPortletDisplay();
            HeroConfiguration heroConfiguration = null;
            try {
                heroConfiguration = portletDisplay.getPortletInstanceConfiguration(HeroConfiguration.class);
                return "{\n" +
                        "        \"textation\": {\n" +
                        "            \"heading\": \"" + heroConfiguration.heading() + "\",\n" +
                        "            \"content\": \"" + heroConfiguration.content() + "\"\n" +
                        "        }\n" +
                        "    }";
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
