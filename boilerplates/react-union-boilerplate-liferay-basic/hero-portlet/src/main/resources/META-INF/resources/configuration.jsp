<%--
JSP for the configuration class and configuration action.
--%>
<%@ include file="./init.jsp" %>

<%@ page import="com.liferay.portal.kernel.util.Constants" %>

<liferay-portlet:actionURL portletConfiguration="${true}"
                           var="configurationActionURL" />

<liferay-portlet:renderURL portletConfiguration="${true}"
                           var="configurationRenderURL" />

<aui:form action="${configurationActionURL}" method="post" name="fm">

    <aui:input name="<%= Constants.CMD %>" type="hidden"
               value="<%= Constants.UPDATE %>" />

    <aui:input name="redirect" type="hidden"
               value="${configurationRenderURL}" />

    <aui:fieldset>
        <aui:input name="preferences--heading--" label="form.heading" type="text"
                   value="${heading}" required="true" />
        <aui:input name="preferences--content--" label="form.content" type="text"
                   value="${content}" required="true" />
    </aui:fieldset>
    <aui:button-row>
        <aui:button type="submit"></aui:button>
    </aui:button-row>
</aui:form>