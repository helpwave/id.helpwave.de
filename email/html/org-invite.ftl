<#import "template.ftl" as layout>
<@layout.main>
    <h1>${msg("orgInviteTitle")}</h1>
    <p>${msg("orgInviteBody1", realm.displayName, orgName)}</p>
    <p>
        <a href="${link}" class="button">${msg("doClickHere")}</a>
    </p>
    <p>${msg("orgInviteBody2")}</p>
</@layout.main>