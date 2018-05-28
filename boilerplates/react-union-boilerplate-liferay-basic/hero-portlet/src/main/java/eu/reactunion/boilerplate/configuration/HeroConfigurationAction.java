package eu.reactunion.boilerplate.configuration;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.PortletConfig;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.liferay.portal.kernel.portlet.ConfigurationAction;
import com.liferay.portal.kernel.portlet.DefaultConfigurationAction;
import com.liferay.portal.kernel.util.ParamUtil;
import eu.reactunion.boilerplate.constants.HeroConstants;
import eu.reactunion.boilerplate.constants.HeroPortletKeys;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;

/**
 * The configuration action class enables Configuration item in the portlet's menu with gear icon.
 * Configuration.jsp is used to render the UI.
 *
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
@Component(
    configurationPid = HeroPortletKeys.CONFIGURATION,
    configurationPolicy = ConfigurationPolicy.OPTIONAL,
    immediate = true,
    property = {
        "javax.portlet.name=" + HeroPortletKeys.HERO,
    },
    service = ConfigurationAction.class
)
public class HeroConfigurationAction extends DefaultConfigurationAction {

    @Override
    public void processAction(PortletConfig portletConfig, ActionRequest actionRequest, ActionResponse actionResponse) throws Exception {
        String heading = ParamUtil.getString(actionRequest, HeroConstants.PARAM_HEADING);
        setPreference(actionRequest, HeroConstants.PARAM_HEADING, heading);
        String content = ParamUtil.getString(actionRequest, HeroConstants.PARAM_CONTENT);
        setPreference(actionRequest, HeroConstants.PARAM_CONTENT, content);

        super.processAction(portletConfig, actionRequest, actionResponse);
    }

    @Override
    public void include(PortletConfig portletConfig, HttpServletRequest request, HttpServletResponse response) throws Exception {
        HeroConfigurationUtil.addConfigurationContext(request);

        super.include(portletConfig, request, response);
    }

}
