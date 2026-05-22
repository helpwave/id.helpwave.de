import type { ExtendKcContext } from 'keycloakify/login'
import type { KcEnvName, ThemeName } from '../kc.gen'

export type KcContextExtension = {
    themeName: ThemeName,
    properties: Record<KcEnvName, string> & {},
    // NOTE: Here you can declare more properties to extend the KcContext
    // See: https://docs.keycloakify.dev/faq-and-help/some-values-you-need-are-missing-from-in-kccontext
};

export type KcContextExtensionPerPage = {
    'register.ftl': {
        turnstileSiteKey?: string,
    },
    'terms.ftl': {
        // Set by the helpwave-policy-acceptance Required Action. When present, the page
        // renders policy-specific UI (a link to the policy + an accept checkbox) instead
        // of the built-in terms-and-conditions text.
        policyId?: string,
        policyUrl?: string,
        policyVersion?: string,
        policyAcceptanceLabelKey?: string,
        policyLinkLabelKey?: string,
        policyRequiredErrorKey?: string,
        policyRequiredError?: boolean,
    },
};

export type KcContext = ExtendKcContext<KcContextExtension, KcContextExtensionPerPage>;
