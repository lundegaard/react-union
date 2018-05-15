<%@ include file="./init.jsp" %>

<div id="hero"></div>
<script data-union-widget="hero" data-union-container="hero" type="application/json"></script>

<div id="content"></div>
<script data-union-widget="content" data-union-container="content" type="application/json">
    {
        "textation": {
            "heading": "${heading}",
            "content": "${content}"
        }
    }
</script>
