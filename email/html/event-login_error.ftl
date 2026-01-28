<#import "template.ftl" as layout>
<@layout.main>
    <h1>${msg("eventLoginErrorTitle")}</h1>
    <p>${msg("eventLoginErrorBody1", realm.displayName)}</p>
    <p class="text-error">${msg("eventLoginErrorBody2")}</p>
    <#if ipAddress??>
        <p>${msg("eventLoginErrorBody3", ipAddress)}</p>
    </#if>
</@layout.main>