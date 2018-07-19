<%--
Renders React widgets.
--%>
<%@ include file="./init.jsp" %>

<%--suppress JSUnresolvedVariable, JSUnresolvedFunction --%>
<script type="text/javascript">
	Liferay.Loader.require("entry-module");
</script>

<div id="${ns}hero"></div>
<script data-union-widget="hero" data-union-container="${ns}hero" type="application/json"></script>

<div id="${ns}content"></div>
<script data-union-widget="content" data-union-container="${ns}content" type="application/json">
    {
        "messages": {
            "heading": "${heading}",
            "content": "${content}"
        }
    }
</script>
