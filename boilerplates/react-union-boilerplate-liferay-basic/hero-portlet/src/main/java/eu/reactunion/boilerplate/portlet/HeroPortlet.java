package eu.reactunion.boilerplate.portlet;

import javax.portlet.Portlet;
import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import java.io.IOException;

import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;
import eu.reactunion.boilerplate.constants.HeroPortletKeys;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * Controller of Hero Portlet, it renders view.jsp with the React widgets.
 *
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
@Component(
	configurationPid = HeroPortletKeys.CONFIGURATION,
	immediate = true,
	property = {
		"com.liferay.portlet.display-category=category.sample",
		"com.liferay.portlet.instanceable=true",
		"javax.portlet.init-param.template-path=/",
		"javax.portlet.init-param.view-template=/view.jsp",
		"javax.portlet.name=" + HeroPortletKeys.HERO,
		"javax.portlet.resource-bundle=content.Language",
		"javax.portlet.security-role-ref=power-user,user"
	},
	service = Portlet.class
)
public class HeroPortlet extends MVCPortlet {

	@Reference
	private HeroReactWidgetSupport reactWidgetSupport;

	@Override
	public void render(RenderRequest renderRequest, RenderResponse renderResponse) throws IOException, PortletException {
		reactWidgetSupport.setWidgetsInitData(renderRequest);

		super.render(renderRequest, renderResponse);
	}

}