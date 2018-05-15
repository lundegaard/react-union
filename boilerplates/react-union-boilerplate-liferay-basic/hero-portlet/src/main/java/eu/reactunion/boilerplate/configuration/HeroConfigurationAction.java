package eu.reactunion.boilerplate.configuration;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.PortletConfig;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.liferay.portal.kernel.module.configuration.ConfigurationProvider;
import com.liferay.portal.kernel.portlet.ConfigurationAction;
import com.liferay.portal.kernel.portlet.DefaultConfigurationAction;
import com.liferay.portal.kernel.util.ParamUtil;
import eu.reactunion.boilerplate.constants.HeroPortletKeys;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
@Component(
    configurationPid = "eu.reactunion.boilerplate.configuration.HeroConfiguration",
    configurationPolicy = ConfigurationPolicy.OPTIONAL,
    immediate = true,
    property = {
        "javax.portlet.name=" + HeroPortletKeys.HERO,
    },
    service = ConfigurationAction.class
)
public class HeroConfigurationAction extends DefaultConfigurationAction {

    @Reference
    private ConfigurationProvider configurationProvider;

    @Override
    public void processAction(PortletConfig portletConfig, ActionRequest actionRequest, ActionResponse actionResponse) throws Exception {
        String heading = ParamUtil.getString(actionRequest, "heading");
        setPreference(actionRequest, "heading", heading);
        String content = ParamUtil.getString(actionRequest, "content");
        setPreference(actionRequest, "content", content);

        super.processAction(portletConfig, actionRequest, actionResponse);
    }

    @Override
    public void include(PortletConfig portletConfig, HttpServletRequest request, HttpServletResponse response) throws Exception {
        HeroConfigurationUtil.addConfigurationContext(request);

        super.include(portletConfig, request, response);
    }

}
