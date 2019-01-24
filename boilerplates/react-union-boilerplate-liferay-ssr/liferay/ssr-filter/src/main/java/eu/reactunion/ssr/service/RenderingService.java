package eu.reactunion.ssr.service;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import feign.Feign;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ServiceScope;

@Component(
        immediate = true,
        service = RenderingService.class,
        scope = ServiceScope.SINGLETON
)
public class RenderingService {

    private static final Log log = LogFactoryUtil.getLog(RenderingService.class);

    private final RenderingServiceClient renderingServiceClient = Feign
            .builder()
            // TODO: Make URL configurable.
            .target(RenderingServiceClient.class, "http://localhost:3303");

    private boolean serviceUp = checkHealth();

    public synchronized boolean isServiceUp() {
        return this.serviceUp;
    }

    public synchronized boolean checkHealth() {
        try {
            renderingServiceClient.checkHealth();
            this.serviceUp = true;
        } catch (Exception ex) {
            this.serviceUp = false;
            log.error("Health check of rendering service failed.", ex);
        }

        return this.serviceUp;
    }

    public String render(String html) throws RenderingException {
        if (!isServiceUp()) {
            throw new RenderingException("The rendering service is not reachable.");
        }

        try {
            return renderingServiceClient.render(html);
        } catch (Exception ex) {
            checkHealth();
            throw new RenderingException(ex.getMessage());
        }
    }
}