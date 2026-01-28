<#import "template.ftl" as layout>
<@layout.main>
    <h1>${msg("emailVerificationTitle")}</h1>
    <p>${msg("emailVerificationBody1", realm.displayName)}</p>
    <p>
        <a href="${link}" class="button">${msg("doClickHere")}</a>
    </p>
    <p>${msg("emailVerificationBody2")}</p>
    <p>${msg("emailVerificationBody3")}</p>
</@layout.main>