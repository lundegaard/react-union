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

@Component(
        immediate = true,
        property = {
                "javax.portlet.name=eu_reactunion_ssr_filter_RenderingFlagPortletFilter"
        },
        service = PortletFilter.class
)
public class RenderingFlagPortletFilter implements RenderFilter {

    @Override
    public void doFilter(RenderRequest renderRequest, RenderResponse renderResponse, FilterChain filterChain) throws IOException, PortletException {
        String flag = ServerSideRenderingFilter.SSR_FLAG;
        HttpServletRequest httpServletRequest = PortalUtil.getHttpServletRequest(renderRequest);
        renderRequest.setAttribute(flag, httpServletRequest.getAttribute(flag));
        filterChain.doFilter(renderRequest, renderResponse);
    }

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void destroy() {
    }
}
