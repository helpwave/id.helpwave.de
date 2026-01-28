<#import "template.ftl" as layout>
<@layout.main>
    <h1>${msg("identityProviderLinkTitle")}</h1>
    <p>${msg("identityProviderLinkBody1", realm.displayName, identityProviderAlias)}</p>
    <p>
        <a href="${link}" class="button">${msg("doClickHere")}</a>
    </p>
    <p>${msg("identityProviderLinkBody2")}</p>
</@layout.main>