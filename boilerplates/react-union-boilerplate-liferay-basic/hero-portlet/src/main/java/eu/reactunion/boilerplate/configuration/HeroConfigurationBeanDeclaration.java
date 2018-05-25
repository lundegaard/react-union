package eu.reactunion.boilerplate.configuration;

import com.liferay.portal.kernel.settings.definition.ConfigurationBeanDeclaration;

/**
 * Registers the configuration class {@link HeroConfiguration}. It enables the system to keep track of any
 * configuration changes as they happen.
 *
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
public class HeroConfigurationBeanDeclaration implements ConfigurationBeanDeclaration {

    /**
     * Returns configuration class.
     *
     * @return configuration class
     */
    @Override
    public Class<?> getConfigurationBeanClass() {
        return HeroConfiguration.class;
    }
}
