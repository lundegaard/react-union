<%@ include file="/init.jsp" %>

<%--suppress JSUnresolvedVariable, JSUnresolvedFunction --%>
<script type="text/javascript">
Liferay.Loader.require("app-demo@0.17.0/app-demo");
</script>

<div id="${ns}hero-root"></div>
<script data-union-widget="hero" data-union-container="${ns}hero-root"></script>
