import type { ExtendKcContext } from 'keycloakify/account'
import type { KcEnvName, ThemeName } from '../kc.gen'

export type KcContextExtension = {
    themeName: ThemeName,
    properties: Record<KcEnvName, string> & {},
}

export type KcContextExtensionPerPage = {
    'account.ftl': {
        profilePictureApiUrl?: string,
        profilePictureUrl?: string,
    },
}

export type KcContext = ExtendKcContext<KcContextExtension, KcContextExtensionPerPage>
