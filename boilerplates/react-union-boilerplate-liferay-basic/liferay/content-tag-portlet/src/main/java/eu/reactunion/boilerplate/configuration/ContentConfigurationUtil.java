package eu.reactunion.boilerplate.configuration;

import javax.portlet.RenderRequest;
import javax.servlet.http.HttpServletRequest;

import com.liferay.portal.kernel.module.configuration.ConfigurationException;
import com.liferay.portal.kernel.theme.PortletDisplay;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.WebKeys;

import static eu.reactunion.boilerplate.constants.ContentConstants.*;

/**
 * Util class containing useful methods for the work with the portlet configuration.
 *
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
public class ContentConfigurationUtil {

    /**
     * Adds configuration properties to a render request as the attributes.
     *
     * @param request render request
     * @throws ConfigurationException if the portlet configuration can't be retrieved
     */
    public static void addConfigurationContext(RenderRequest request) throws ConfigurationException {
        final ThemeDisplay themeDisplay = (ThemeDisplay) request.getAttribute(WebKeys.THEME_DISPLAY);
        if (themeDisplay != null) {
            ContentConfiguration ContentConfiguration = getContentConfiguration(themeDisplay);

            request.setAttribute(ATTR_HEADING, ContentConfiguration.heading());
            request.setAttribute(ATTR_CONTENT, ContentConfiguration.content());
        }
    }

    /**
     * Adds configuration properties to a servlet request as the attributes.
     *
     * @param request servlet request
     * @throws ConfigurationException if the portlet configuration can't be retrieved
     */
    public static void addConfigurationContext(HttpServletRequest request) throws ConfigurationException {
        final ThemeDisplay themeDisplay = (ThemeDisplay) request.getAttribute(WebKeys.THEME_DISPLAY);
        if (themeDisplay != null) {
            ContentConfiguration contentConfiguration = getContentConfiguration(themeDisplay);

            request.setAttribute(ATTR_HEADING, contentConfiguration.heading());
            request.setAttribute(ATTR_CONTENT, contentConfiguration.content());
        }
    }

    private static ContentConfiguration getContentConfiguration(ThemeDisplay themeDisplay) throws ConfigurationException {
        final PortletDisplay portletDisplay = themeDisplay.getPortletDisplay();
        return portletDisplay.getPortletInstanceConfiguration(ContentConfiguration.class);
    }

}
