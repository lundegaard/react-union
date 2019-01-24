package eu.reactunion.ssr.service;

import feign.Headers;
import feign.RequestLine;

public interface RenderingServiceClient {

    @RequestLine("POST /")
    @Headers({
            "Content-Type: text/html",
            "Accept: text/html"
    })
    String render(String html);

    @RequestLine("GET /health")
    void checkHealth();
}