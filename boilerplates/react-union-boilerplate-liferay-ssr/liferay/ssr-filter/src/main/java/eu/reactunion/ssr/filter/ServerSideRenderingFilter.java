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
import java.io.PrintWriter;

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

    private static final String SSR_FLAG = "SSR";

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
        if (isDummyLayoutRequest(request)) {
            super.processFilter(request, response, filterChain);
            return;
        }

        BufferCacheServletResponse bufferCacheServletResponse = new BufferCacheServletResponse(response);
        boolean requestAlreadyFlagged = isRequestFlagged(request);

        if (renderingServerUp && !requestAlreadyFlagged) {
            flagRequestForServerSideRendering(request);
        } else {
            flagRequestForClientSideRendering(request);
        }

        super.processFilter(request, bufferCacheServletResponse, filterChain);
        String content = bufferCacheServletResponse.getString();
        PrintWriter responseWriter = response.getWriter();

        if (renderingServerUp && !requestAlreadyFlagged && isResponseRenderable(response)) {
            try {
                responseWriter.write(renderingServerApi.render(content));
            } catch (Exception ex) {
                _log.error("Rendering server failed to render.", ex);
                checkRenderingServerHealth();
                processFilter(request, response, filterChain);
            }
        } else {
            responseWriter.write(content);
        }
    }

    private boolean isResponseRenderable(HttpServletResponse response) {
        return response.getContentType() != null && response.getContentType().contains("text/html");
    }

    private boolean isDummyLayoutRequest(HttpServletRequest request) {
        return request.getRequestURI() != null && request.getRequestURI().startsWith("/c/portal/layout");
    }

    private void checkRenderingServerHealth() {
        try {
            renderingServerApi.checkHealth();
            renderingServerUp = true;
        } catch (Exception ex) {
            renderingServerUp = false;
            _log.error("Health check of rendering server failed.", ex);
        }
    }

    private void flagRequestForServerSideRendering(HttpServletRequest request) {
        request.setAttribute(SSR_FLAG, true);
    }

    private void flagRequestForClientSideRendering(HttpServletRequest request) {
        request.setAttribute(SSR_FLAG, false);
    }

    @SuppressWarnings("unused")
    private boolean isRequestFlagged(HttpServletRequest request) {
        try {
            boolean flagged = (boolean) request.getAttribute(SSR_FLAG);
        } catch (NullPointerException ex) {
            return false;
        }

        return true;
    }

    @Override
    protected Log getLog() {
        return _log;
    }
}
