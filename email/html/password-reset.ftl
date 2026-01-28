<#import "template.ftl" as layout>
<@layout.main>
    <h1>${msg("emailResetPasswordTitle")}</h1>
    <p>${msg("emailResetPasswordBody1", realm.displayName)}</p>
    <p>
        <a href="${link}" class="button">${msg("doClickHere")}</a>
    </p>
    <p>${msg("emailResetPasswordBody2")}</p>
    <p>${msg("emailResetPasswordBody3")}</p>
</@layout.main>