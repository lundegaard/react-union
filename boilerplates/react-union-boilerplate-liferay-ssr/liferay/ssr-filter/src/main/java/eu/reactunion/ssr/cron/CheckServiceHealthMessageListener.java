package eu.reactunion.ssr.cron;

import com.liferay.portal.configuration.metatype.bnd.util.ConfigurableUtil;
import com.liferay.portal.kernel.messaging.BaseMessageListener;
import com.liferay.portal.kernel.messaging.DestinationNames;
import com.liferay.portal.kernel.messaging.Message;
import com.liferay.portal.kernel.messaging.MessageListener;
import com.liferay.portal.kernel.scheduler.*;
import eu.reactunion.ssr.service.RenderingService;
import org.osgi.service.component.annotations.*;

import java.util.Date;
import java.util.Map;

@Component(
        immediate = true,
        service = MessageListener.class,
        configurationPid = "eu.reactunion.ssr.cron.CheckServiceHealthConfiguration"
)
public class CheckServiceHealthMessageListener extends BaseMessageListener {

    private volatile boolean initialized;

    @Reference(unbind = "-")
    private SchedulerEngineHelper schedulerEngineHelper;

    @Reference(unbind = "-")
    private TriggerFactory triggerFactory;

    @Reference
    private RenderingService renderingService;

    private SchedulerEntry schedulerEntry;

    @Override
    protected void doReceive(Message message) {
        if (!renderingService.isServiceUp()) {
            renderingService.checkHealth();
        }
    }

    @Activate
    @Modified
    protected void activate(Map<String, Object> properties) throws SchedulerException {
        final CheckServiceHealthConfiguration configuration = ConfigurableUtil.createConfigurable(CheckServiceHealthConfiguration.class, properties);
        final String listenerClass = getClass().getName();
        final Trigger trigger = triggerFactory.createTrigger(listenerClass, listenerClass, new Date(), null, configuration.cronExpression());

        // TODO: Newer version of SchedulerEntryImpl has a better constructor (no setters necessary).
        this.schedulerEntry = new SchedulerEntryImpl();
        ((SchedulerEntryImpl) this.schedulerEntry).setEventListenerClass(listenerClass);
        ((SchedulerEntryImpl) this.schedulerEntry).setTrigger(trigger);

        if (initialized) {
            deactivate();
        }

        this.schedulerEngineHelper.register(this, schedulerEntry, DestinationNames.SCHEDULER_DISPATCH);
        initialized = true;
    }

    @Deactivate
    protected void deactivate() throws SchedulerException {
        this.schedulerEngineHelper.unschedule(this.schedulerEntry, StorageType.MEMORY_CLUSTERED);
        schedulerEngineHelper.delete(this.schedulerEntry, StorageType.MEMORY_CLUSTERED);
        this.schedulerEngineHelper.unregister(this);
        initialized = false;
    }
}
