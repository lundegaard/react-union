package eu.reactunion.boilerplate.portlet.data;

/**
 * Configuration data object for react widget named content.
 *
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
public class Messages {

    private String heading;
    private String content;

    public Messages() {
    }

    public Messages(String heading, String content) {
        this.heading = heading;
        this.content = content;
    }

    public String getHeading() {
        return heading;
    }

    public void setHeading(String heading) {
        this.heading = heading;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
