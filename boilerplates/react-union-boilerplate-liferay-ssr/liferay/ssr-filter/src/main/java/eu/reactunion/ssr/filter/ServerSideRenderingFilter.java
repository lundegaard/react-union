package eu.reactunion.ssr.filter;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.servlet.BaseFilter;
import com.liferay.portal.kernel.servlet.BufferCacheServletResponse;
import eu.reactunion.ssr.service.RenderingException;
import eu.reactunion.ssr.service.RenderingService;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
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

    public static final String SSR_KEY = "SSR";

    private static final Log log = LogFactoryUtil.getLog(ServerSideRenderingFilter.class);

    @Reference
    private RenderingService renderingService;

    @Override
    protected void processFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws Exception {
        if (isDummyLayoutRequest(request)) {
            super.processFilter(request, response, filterChain);
            return;
        }

        // TODO: Investigate if BufferCacheServletResponse has any disadvantages when used only as a buffer.
        // https://dev.liferay.com/en/develop/tutorials/-/knowledge_base/7-0/jsp-overrides-using-portlet-filters
        BufferCacheServletResponse bufferCacheServletResponse = new BufferCacheServletResponse(response);

        // NOTE: Used to prevent loops when rendering fails and is retried by calling processFilter();
        boolean retrying = isRequestMarked(request);
        markRequest(request, renderingService.isServiceUp() && !retrying);

        super.processFilter(request, bufferCacheServletResponse, filterChain);
        String content = bufferCacheServletResponse.getString();
        PrintWriter responseWriter = response.getWriter();

        if (renderingService.isServiceUp() && !retrying && isResponseRenderable(response)) {
            try {
                responseWriter.write(renderingService.render(content));
            } catch (RenderingException ex) {
                log.error("Rendering server failed to render.", ex);
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

    private void markRequest(HttpServletRequest request, boolean value) {
        request.setAttribute(SSR_KEY, value);
    }

    @SuppressWarnings("unused")
    private boolean isRequestMarked(HttpServletRequest request) {
        try {
            boolean marked = (boolean) request.getAttribute(SSR_KEY);
        } catch (NullPointerException ex) {
            return false;
        }

        return true;
    }

    @Override
    protected Log getLog() {
        return log;
    }
}
