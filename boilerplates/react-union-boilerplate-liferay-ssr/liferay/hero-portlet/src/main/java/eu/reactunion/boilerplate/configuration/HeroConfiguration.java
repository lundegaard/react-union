package eu.reactunion.boilerplate.configuration;

import aQute.bnd.annotation.metatype.Meta;
import com.liferay.portal.configuration.metatype.annotations.ExtendedObjectClassDefinition;
import eu.reactunion.boilerplate.constants.HeroPortletKeys;

/**
 * Configuration class of the Hero portlet.
 *
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
@ExtendedObjectClassDefinition(
        category = "foundation",
        scope = ExtendedObjectClassDefinition.Scope.PORTLET_INSTANCE
)
@Meta.OCD(id = HeroPortletKeys.CONFIGURATION)
public interface HeroConfiguration {

    @Meta.AD(
            required = true,
            deflt = ""
    )
    String heading();

    @Meta.AD(
            required = true,
            deflt = ""
    )
    String content();

}
