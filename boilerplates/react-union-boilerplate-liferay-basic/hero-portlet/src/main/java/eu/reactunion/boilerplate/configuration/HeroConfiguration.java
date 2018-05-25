package eu.reactunion.boilerplate.configuration;

import aQute.bnd.annotation.metatype.Meta;
import com.liferay.portal.configuration.metatype.annotations.ExtendedObjectClassDefinition;

/**
 * Configuration class of the Hero portlet.
 *
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
@ExtendedObjectClassDefinition(
        category = "ReactUnion",
        scope = ExtendedObjectClassDefinition.Scope.PORTLET_INSTANCE
)
@Meta.OCD(id = "eu.reactunion.boilerplate.configuration.HeroConfiguration")
public interface HeroConfiguration {

    // required true doesn't work, it doesn't find default values. Probably bug.
    @Meta.AD(
            required = false
    )
    String heading();

    // required true doesn't work, it doesn't find default values. Probably bug.
    @Meta.AD(
            required = false
    )
    String content();

}
