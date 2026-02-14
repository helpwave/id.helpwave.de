import type { KcContext } from '../KcContext'
import type { HelpwaveIdTranslationEntries } from '../../i18n/translations'

const PAGE_TITLE_BY_PAGE_ID: Partial<Record<KcContext['pageId'], keyof HelpwaveIdTranslationEntries>> = {
  'login.ftl': 'pageTitleLogin',
  'register.ftl': 'pageTitleRegister',
  'login-reset-password.ftl': 'pageTitleForgotPassword',
  'info.ftl': 'pageTitleInfo',
  'error.ftl': 'pageTitleError',
  'code.ftl': 'pageTitleCode',
  'logout-confirm.ftl': 'pageTitleLogoutConfirm',
  'terms.ftl': 'pageTitleTerms',
  'login-otp.ftl': 'pageTitleLoginOtp',
  'login-update-password.ftl': 'pageTitleUpdatePassword',
  'login-verify-email.ftl': 'pageTitleEmailVerification',
  'delete-account-confirm.ftl': 'pageTitleDeleteAccountConfirm',
  'delete-credential.ftl': 'pageTitleDeleteCredential',
  'frontchannel-logout.ftl': 'pageTitleFrontchannelLogout',
  'idp-review-user-profile.ftl': 'pageTitleIdpReviewProfile',
  'link-idp-action.ftl': 'pageTitleLinkIdp',
  'login-config-totp.ftl': 'pageTitleConfigTotp',
  'login-idp-link-confirm.ftl': 'pageTitleIdpLinkConfirm',
  'login-idp-link-confirm-override.ftl': 'pageTitleIdpLinkConfirmOverride',
  'login-idp-link-email.ftl': 'pageTitleIdpLinkEmail',
  'login-oauth2-device-verify-user-code.ftl': 'pageTitleOauth2DeviceVerifyUserCode',
  'login-oauth-grant.ftl': 'pageTitleOauthGrant',
  'login-page-expired.ftl': 'pageTitlePageExpired',
  'login-passkeys-conditional-authenticate.ftl': 'pageTitlePasskeysConditionalAuthenticate',
  'login-password.ftl': 'pageTitleLoginPassword',
  'login-recovery-authn-code-config.ftl': 'pageTitleRecoveryCodeConfig',
  'login-recovery-authn-code-input.ftl': 'pageTitleRecoveryCodeInput',
  'login-reset-otp.ftl': 'pageTitleResetOtp',
  'login-update-profile.ftl': 'pageTitleUpdateProfile',
  'login-username.ftl': 'pageTitleLoginUsername',
  'login-x509-info.ftl': 'pageTitleX509Info',
  'select-authenticator.ftl': 'pageTitleSelectAuthenticator',
  'select-organization.ftl': 'pageTitleSelectOrganization',
  'update-email.ftl': 'pageTitleUpdateEmail',
  'webauthn-authenticate.ftl': 'pageTitleWebauthnAuthenticate',
  'webauthn-error.ftl': 'pageTitleWebauthnError',
  'webauthn-register.ftl': 'pageTitleWebauthnRegister'
}

export function getPageTitleKey(pageId: KcContext['pageId']): keyof HelpwaveIdTranslationEntries {
  return PAGE_TITLE_BY_PAGE_ID[pageId] ?? 'pageTitleLogin'
}

export function getDocumentTitle(
  pageId: KcContext['pageId'],
  t: (key: keyof HelpwaveIdTranslationEntries) => string
): string {
  return `${t(getPageTitleKey(pageId))} | helpwave id`
}

const MESSAGE_HEADER_TO_KEY: Record<string, keyof HelpwaveIdTranslationEntries> = {
  'Email verification': 'messageHeaderEmailVerification',
  'E-Mail-Verifizierung': 'messageHeaderEmailVerification',
  'Forgot Your Password?': 'messageHeaderForgotPassword',
  'Passwort vergessen?': 'messageHeaderForgotPassword',
  'Confirmation email sent': 'messageHeaderEmailUpdateConfirmation',
  'Bestätigungs-E-Mail gesendet': 'messageHeaderEmailUpdateConfirmation',
  'Email updated': 'messageHeaderEmailUpdated',
  'E-Mail aktualisiert': 'messageHeaderEmailUpdated',
  'Update password': 'messageHeaderUpdatePassword',
  'Passwort ändern': 'messageHeaderUpdatePassword',
  'Success code': 'messageHeaderSuccessCode',
  'Erfolgscode': 'messageHeaderSuccessCode',
  'Error code': 'messageHeaderErrorCode',
  'Fehlercode': 'messageHeaderErrorCode',
  'Perform the following action(s)': 'messageHeaderExecuteActions',
  'Führen Sie die folgende(n) Aktion(en) aus': 'messageHeaderExecuteActions'
}

export function getMessageHeaderKey(header: string | undefined): keyof HelpwaveIdTranslationEntries | undefined {
  if (header === undefined || header === '') return undefined
  return MESSAGE_HEADER_TO_KEY[header.trim()]
}
