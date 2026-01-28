<#import "template.ftl" as layout>
<@layout.main>
    <h1>${msg("emailVerificationTitle")}</h1>
    <p>${msg("emailVerificationBody1", realm.displayName)}</p>
    <p><strong>${msg("emailVerificationCode")}: ${code}</strong></p>
    <p>${msg("emailVerificationBody2")}</p>
</@layout.main>