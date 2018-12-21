<%--
Renders React widgets.
--%>
<%@ include file="./init.jsp" %>

<%--suppress JSUnresolvedVariable, JSUnresolvedFunction --%>
<c:if test="${!liferayPortletRequest.httpServletRequest.getAttribute('SSR')}">
    <script type="text/javascript">
        Liferay.Loader.require("app-demo");
    </script>
</c:if>

<div id="${ns}content"></div>
<script data-union-widget="content" data-union-container="${ns}content" type="application/json">
    {
        "messages": {
            "heading": "${heading}",
            "content": "${content}"
        }
    }
</script>
