package eu.reactunion.boilerplate.configuration;

import javax.portlet.PortletConfig;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.liferay.portal.kernel.portlet.ConfigurationAction;
import com.liferay.portal.kernel.portlet.DefaultConfigurationAction;
import eu.reactunion.boilerplate.constants.ContentPortletKeys;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;

/**
 * The configuration action class enables Configuration item in the portlet's menu with gear icon.
 * Configuration.jsp is used to render the UI.
 *
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
@Component(
    configurationPid = ContentPortletKeys.CONFIGURATION,
    configurationPolicy = ConfigurationPolicy.OPTIONAL,
    immediate = true,
    property = {
        "javax.portlet.name=" + ContentPortletKeys.CONTENT,
    },
    service = ConfigurationAction.class
)
public class ContentConfigurationAction extends DefaultConfigurationAction {

    @Override
    public void include(PortletConfig portletConfig, HttpServletRequest request, HttpServletResponse response) throws Exception {
        ContentConfigurationUtil.addConfigurationContext(request);

        super.include(portletConfig, request, response);
    }

}
