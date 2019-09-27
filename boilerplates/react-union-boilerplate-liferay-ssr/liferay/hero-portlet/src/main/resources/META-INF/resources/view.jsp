<%--
Renders React widgets.
--%>
<%@ include file="./init.jsp" %>

<%--suppress JSUnresolvedVariable, JSUnresolvedFunction --%>
<c:if test="${!SSR}">
    <script type="text/javascript">
        Liferay.Loader.require("react-union-boilerplate-liferay-ssr@0.13.1/app-demo");
    </script>
</c:if>

<div id="${ns}hero"></div>
<script data-union-widget="hero" data-union-container="${ns}hero" type="application/json"></script>
