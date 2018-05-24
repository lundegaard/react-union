package eu.reactunion.boilerplate.portlet;

import javax.portlet.RenderRequest;

import com.liferay.portal.kernel.module.configuration.ConfigurationException;
import com.liferay.portal.kernel.theme.PortletDisplay;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.WebKeys;
import eu.reactunion.boilerplate.configuration.HeroConfiguration;
import eu.reactunion.boilerplate.portlet.data.InitData;
import eu.reactunion.boilerplate.portlet.data.Textation;
import org.osgi.service.component.annotations.Component;

import eu.lundegaard.reactunion.support.ReactWidgetSupport;

/**
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
@Component(
        immediate = true,
        service = HeroReactWidgetSupport.class
)
public class HeroReactWidgetSupport extends ReactWidgetSupport {

//    @Override
//    public Map<String, Object> getWidgetsInitData(RenderRequest request) {
//        Map<String, Object> initDataMap = new HashMap<>();
//
//        final ThemeDisplay themeDisplay = (ThemeDisplay) request.getAttribute(WebKeys.THEME_DISPLAY);
//        if (themeDisplay != null) {
//            final PortletDisplay portletDisplay = themeDisplay.getPortletDisplay();
//            HeroConfiguration heroConfiguration = null;
//            try {
//                heroConfiguration = portletDisplay.getPortletInstanceConfiguration(HeroConfiguration.class);
//                InitData initData = new InitData();
//                initData.setTextation(new Textation(heroConfiguration.heading(), heroConfiguration.content()));
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
            HeroConfiguration heroConfiguration = null;
            try {
                heroConfiguration = portletDisplay.getPortletInstanceConfiguration(HeroConfiguration.class);
                InitData initData = new InitData();
                initData.setTextation(new Textation(heroConfiguration.heading(), heroConfiguration.content()));
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
