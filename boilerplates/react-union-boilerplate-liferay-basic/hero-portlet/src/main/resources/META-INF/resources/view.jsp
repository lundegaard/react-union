<%@ include file="./init.jsp" %>

<div id="${ns}hero"></div>
<script data-union-widget="hero" data-union-container="${ns}hero" type="application/json"></script>

<div id="${ns}content"></div>
<script data-union-widget="content" data-union-container="${ns}content" type="application/json">
    {
        "textation": {
            "heading": "${heading}",
            "content": "${content}"
        }
    }
</script>
