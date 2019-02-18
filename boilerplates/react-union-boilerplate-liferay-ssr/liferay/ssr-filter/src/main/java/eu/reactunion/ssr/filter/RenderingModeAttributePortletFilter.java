package eu.reactunion.ssr.filter;

import com.liferay.portal.kernel.util.PortalUtil;
import org.osgi.service.component.annotations.Component;

import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.portlet.filter.FilterChain;
import javax.portlet.filter.FilterConfig;
import javax.portlet.filter.PortletFilter;
import javax.portlet.filter.RenderFilter;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * This portlet filter enables direct access to the SSR variable in JSPs, which can be used to check if the portlet HTML
 * will be sent to the rendering service after being rendered.
 * <p>
 * Because the React Union Rendering Service automatically adds all the script elements, it is necessary to replicate
 * this behaviour in the JSP iff SSR is disabled. Otherwise, the application would be started twice (or not at all).
 */
@Component(
        immediate = true,
        property = {
                "javax.portlet.name=eu_reactunion_ssr_filter_RenderingModeAttributePortletFilter"
        },
        service = PortletFilter.class
)
public class RenderingModeAttributePortletFilter implements RenderFilter {

    @Override
    public void doFilter(RenderRequest renderRequest, RenderResponse renderResponse, FilterChain filterChain) throws IOException, PortletException {
        String key = ServerSideRenderingFilter.SSR_KEY;
        HttpServletRequest httpServletRequest = PortalUtil.getHttpServletRequest(renderRequest);
        renderRequest.setAttribute(key, httpServletRequest.getAttribute(key));
        filterChain.doFilter(renderRequest, renderResponse);
    }

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void destroy() {
    }
}
