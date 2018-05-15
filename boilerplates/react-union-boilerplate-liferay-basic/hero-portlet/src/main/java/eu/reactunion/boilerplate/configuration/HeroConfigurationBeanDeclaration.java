package eu.reactunion.boilerplate.configuration;

import com.liferay.portal.kernel.settings.definition.ConfigurationBeanDeclaration;

/**
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
public class HeroConfigurationBeanDeclaration implements ConfigurationBeanDeclaration {

    @Override
    public Class<?> getConfigurationBeanClass() {
        return HeroConfiguration.class;
    }
}
