<%@ include file="/init.jsp" %>

<%--suppress JSUnresolvedVariable, JSUnresolvedFunction --%>
<script type="text/javascript">
Liferay.Loader.require("app-demo@0.0.1/app-demo");
</script>

<div id="${ns}content-root"></div>
<script data-union-widget="content" data-union-container="${ns}content-root" type="application/json">
{
	"messages": {
	"heading": "Welcome",
	"content": "This is sample server content."
	}
}
</script>

