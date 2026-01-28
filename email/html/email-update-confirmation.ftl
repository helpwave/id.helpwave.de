<#import "template.ftl" as layout>
<@layout.main>
    <h1>${msg("emailUpdateConfirmationTitle")}</h1>
    <p>${msg("emailUpdateConfirmationBody1", realm.displayName, newEmail)}</p>
    <p>
        <a href="${link}" class="button">${msg("doClickHere")}</a>
    </p>
    <p>${msg("emailUpdateConfirmationBody2")}</p>
</@layout.main>