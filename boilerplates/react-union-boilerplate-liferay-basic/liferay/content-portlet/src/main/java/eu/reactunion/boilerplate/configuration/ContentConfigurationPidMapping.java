package eu.reactunion.boilerplate.configuration;

import com.liferay.portal.kernel.settings.definition.ConfigurationPidMapping;
import eu.reactunion.boilerplate.constants.ContentPortletKeys;
import org.osgi.service.component.annotations.Component;

/**
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
@Component
public class ContentConfigurationPidMapping implements ConfigurationPidMapping {

    @Override
    public Class<?> getConfigurationBeanClass() {
        return ContentConfiguration.class;
    }

    @Override
    public String getConfigurationPid() {
        return ContentPortletKeys.CONTENT;
    }
}
