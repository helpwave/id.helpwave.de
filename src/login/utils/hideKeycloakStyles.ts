export const hideKeycloakStyles = `
    #kc-header,
    #kc-header-wrapper,
    .kc-header,
    .kc-logo-text,
    [id*="kc-logo"],
    [class*="kc-logo"],
    [id*="header"],
    [class*="header"]:not([class*="Helpwave"]):not([class*="helpwave"]),
    [id*="brand"],
    [class*="brand"],
    [id*="kc-brand"],
    [class*="kc-brand"],
    .kc-alert,
    .kcAlertClass,
    .kc-form-header,
    .kcFormHeaderClass {
        display: none !important;
    }
`