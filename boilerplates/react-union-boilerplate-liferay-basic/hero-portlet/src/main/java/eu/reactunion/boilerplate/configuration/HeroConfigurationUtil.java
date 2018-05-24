package eu.reactunion.boilerplate.configuration;

import javax.servlet.http.HttpServletRequest;

import com.liferay.portal.kernel.module.configuration.ConfigurationException;
import com.liferay.portal.kernel.theme.PortletDisplay;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.WebKeys;

import static eu.reactunion.boilerplate.constants.HeroConstants.*;

/**
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
public class HeroConfigurationUtil {

    public static void addConfigurationContext(HttpServletRequest request) throws ConfigurationException {
        final ThemeDisplay themeDisplay = (ThemeDisplay) request.getAttribute(WebKeys.THEME_DISPLAY);
        if (themeDisplay != null) {
            final PortletDisplay portletDisplay = themeDisplay.getPortletDisplay();
            HeroConfiguration heroConfiguration = portletDisplay.getPortletInstanceConfiguration(HeroConfiguration.class);

            request.setAttribute(ATTR_HEADING, heroConfiguration.heading());
            request.setAttribute(ATTR_CONTENT, heroConfiguration.content());
        }
    }
}
