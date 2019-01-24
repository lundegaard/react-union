package eu.reactunion.ssr.cron;

import aQute.bnd.annotation.metatype.Meta;

@Meta.OCD(id = "eu.reactunion.ssr.cron.CheckServiceHealthConfiguration")
public interface CheckServiceHealthConfiguration {

    @Meta.AD(
            deflt = "0 0/5 * * * ?",
            required = false
    )
    String cronExpression();
}
