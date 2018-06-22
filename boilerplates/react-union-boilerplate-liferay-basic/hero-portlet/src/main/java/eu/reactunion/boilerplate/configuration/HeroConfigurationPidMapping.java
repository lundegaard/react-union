package eu.reactunion.boilerplate.configuration;

import com.liferay.portal.kernel.settings.definition.ConfigurationPidMapping;
import eu.reactunion.boilerplate.constants.HeroPortletKeys;
import org.osgi.service.component.annotations.Component;

/**
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
@Component
public class HeroConfigurationPidMapping implements ConfigurationPidMapping {

    @Override
    public Class<?> getConfigurationBeanClass() {
        return HeroConfiguration.class;
    }

    @Override
    public String getConfigurationPid() {
        return HeroPortletKeys.HERO;
    }
}
