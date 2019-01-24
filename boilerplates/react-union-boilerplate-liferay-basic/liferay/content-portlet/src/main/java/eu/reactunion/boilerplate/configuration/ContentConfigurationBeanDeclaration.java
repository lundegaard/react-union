package eu.reactunion.boilerplate.configuration;

import com.liferay.portal.kernel.settings.definition.ConfigurationBeanDeclaration;
import org.osgi.service.component.annotations.Component;

/**
 * Registers the configuration class {@link ContentConfiguration}. It enables the system to keep track of any
 * configuration changes as they happen.
 *
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
@Component
public class ContentConfigurationBeanDeclaration implements ConfigurationBeanDeclaration {

    /**
     * Returns configuration class.
     *
     * @return configuration class
     */
    @Override
    public Class<?> getConfigurationBeanClass() {
        return ContentConfiguration.class;
    }
}
