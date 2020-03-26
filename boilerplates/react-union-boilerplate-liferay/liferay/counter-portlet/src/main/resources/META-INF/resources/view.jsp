<%@ include file="/init.jsp" %>

<%--suppress JSUnresolvedVariable, JSUnresolvedFunction --%>
<script type="text/javascript">
Liferay.Loader.require("app-counter@0.0.1/app-counter");
</script>

<div id="${ns}counter-root"></div>
<script data-union-widget="counter" data-union-container="${ns}counter-root"></script>
