package eu.reactunion.ssr.filter;

import feign.Headers;
import feign.RequestLine;

public interface RenderingServiceApi {
    @RequestLine("POST /")
    @Headers({
            "Content-Type: text/html",
            "Accept: text/html"
    })
    String render(String html);

    @RequestLine("GET /health")
    void checkHealth();
}
