package eu.reactunion.ssr.filter;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.servlet.BaseFilter;
import com.liferay.portal.kernel.servlet.BufferCacheServletResponse;
import feign.Feign;
import org.osgi.service.component.annotations.Component;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component(
        immediate = true,
        property = {
                "dispatcher=REQUEST",
                "dispatcher=FORWARD",
                "servlet-context-name=",
                "servlet-filter-name=Server-side Rendering Filter",
                "url-pattern=/*",
                "after-filter=Cache Filter"
        },
        service = Filter.class
)
public class ServerSideRenderingFilter extends BaseFilter {
    private static final Log _log = LogFactoryUtil.getLog(ServerSideRenderingFilter.class);

    private final RenderingServerApi renderingServerApi = Feign
            .builder()
            .target(RenderingServerApi.class, "http://localhost:3303");

    private boolean renderingServerUp = true;

    @Override
    public void init(FilterConfig filterConfig) {
        super.init(filterConfig);
        checkRenderingServerHealth();
    }

    @Override
    protected void processFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws Exception {
        BufferCacheServletResponse bufferCacheServletResponse = new BufferCacheServletResponse(response);

        if (renderingServerUp) {
            flagRequestForServerSideRendering(request);
        }

        super.processFilter(request, bufferCacheServletResponse, filterChain);

        // TODO: Stop if no Union widget has been rendered.
        if (renderingServerUp && isRenderable(request, response)) {
            try {
                String content = bufferCacheServletResponse.getString();
                response.getWriter().write(renderingServerApi.render(content));
            } catch (Exception ex) {
                _log.error("Node.js rendering server failed to render.", ex);
                // FIXME: The request is still marked for SSR and will not include the JavaScript bundle.
                response.getWriter().write(bufferCacheServletResponse.getString());
            }
        } else {
            response.getWriter().write(bufferCacheServletResponse.getString());
        }
    }

    private boolean isRenderable(HttpServletRequest request, HttpServletResponse response) {
        if (response.getContentType() == null || !response.getContentType().contains("text/html")) {
            return false;
        }

        return request.getRequestURI() != null && !request.getRequestURI().startsWith("/c/portal/layout");
    }

    private void checkRenderingServerHealth() {
        try {
            renderingServerApi.checkHealth();
            renderingServerUp = true;
        } catch (Exception ex) {
            renderingServerUp = false;
            _log.error("Health check of Node.js rendering server failed.", ex);
        }
    }

    private void flagRequestForServerSideRendering(HttpServletRequest request) {
        // TODO: Move "SSR" to constants.
        request.setAttribute("SSR", true);
    }

    @Override
    protected Log getLog() {
        return _log;
    }
}
