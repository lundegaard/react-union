package eu.reactunion.boilerplate.portlet;

import javax.portlet.Portlet;
import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import java.io.IOException;

import com.liferay.portal.kernel.module.configuration.ConfigurationException;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;
import eu.reactunion.boilerplate.configuration.ContentConfigurationUtil;
import eu.reactunion.boilerplate.constants.ContentPortletKeys;
import org.osgi.service.component.annotations.Component;

/**
 * Controller of Hero Portlet, it renders view.jsp with the React widgets.
 *
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
@Component(
	configurationPid = ContentPortletKeys.CONFIGURATION,
	immediate = true,
	property = {
		"com.liferay.portlet.display-category=category.sample",
		"com.liferay.portlet.instanceable=true",
		"javax.portlet.init-param.template-path=/",
		"javax.portlet.init-param.view-template=/view.jsp",
		"javax.portlet.name=" + ContentPortletKeys.CONTENT,
		"javax.portlet.resource-bundle=content.Language",
		"javax.portlet.security-role-ref=power-user,user"
	},
	service = Portlet.class
)
public class ContentPortlet extends MVCPortlet {

	@Override
	public void render(RenderRequest renderRequest, RenderResponse renderResponse) throws IOException, PortletException {
		try {
			ContentConfigurationUtil.addConfigurationContext(renderRequest);
		} catch (ConfigurationException e) {
			throw new PortletException("Configuration error", e);
		}

		super.render(renderRequest, renderResponse);
	}

}