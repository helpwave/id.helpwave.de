<#import "template.ftl" as layout>
<@layout.main>
    <h1>${msg("eventUpdatePasswordTitle")}</h1>
    <p>${msg("eventUpdatePasswordBody1", realm.displayName)}</p>
    <p>${msg("eventUpdatePasswordBody2")}</p>
    <#if ipAddress??>
        <p>${msg("eventUpdatePasswordBody3", ipAddress)}</p>
    </#if>
</@layout.main>