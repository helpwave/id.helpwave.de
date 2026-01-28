<#import "template.ftl" as layout>
<@layout.main>
    <h1>${msg("executeActionsTitle")}</h1>
    <p>${msg("executeActionsBody1", realm.displayName)}</p>
    <#if requiredActions??>
        <ul>
            <#list requiredActions as action>
                <li>${msg("requiredAction.${action}")}</li>
            </#list>
        </ul>
    </#if>
    <p>
        <a href="${link}" class="button">${msg("doClickHere")}</a>
    </p>
    <p>${msg("executeActionsBody2")}</p>
</@layout.main>