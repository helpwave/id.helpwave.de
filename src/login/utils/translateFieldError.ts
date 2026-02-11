import { useTranslation } from '../../i18n/useTranslation'

export type MessageSentiment = 'positive' | 'neutral' | 'negative'

export type MessageType = 'error' | 'warning' | 'success' | 'info'

type MessageEntry = { key: string, sentiment: MessageSentiment }

function buildMessageMap (): Record<string, MessageEntry> {
  const negative = (key: string): MessageEntry => ({ key, sentiment: 'negative' })
  const neutral = (key: string): MessageEntry => ({ key, sentiment: 'neutral' })
  const positive = (key: string): MessageEntry => ({ key, sentiment: 'positive' })
  const entries: Array<[string, MessageEntry]> = [
    ['Invalid username or password.', negative('errorInvalidUsernameOrPassword')],
    ['Invalid username or password', negative('errorInvalidUsernameOrPassword')],
    ['Ungültiger Benutzername oder Passwort.', negative('errorInvalidUsernameOrPassword')],
    ['Ungültiger Benutzername oder Passwort', negative('errorInvalidUsernameOrPassword')],
    ['Invalid username.', negative('errorInvalidUsername')],
    ['Invalid username', negative('errorInvalidUsername')],
    ['Ungültiger Benutzername.', negative('errorInvalidUsername')],
    ['Ungültiger Benutzername', negative('errorInvalidUsername')],
    ['Invalid password.', negative('errorInvalidPassword')],
    ['Invalid password', negative('errorInvalidPassword')],
    ['Ungültiges Passwort.', negative('errorInvalidPassword')],
    ['Ungültiges Passwort', negative('errorInvalidPassword')],
    ['Invalid email.', negative('errorInvalidEmail')],
    ['Invalid email', negative('errorInvalidEmail')],
    ['Ungültige E-Mail.', negative('errorInvalidEmail')],
    ['Ungültige E-Mail', negative('errorInvalidEmail')],
    ['Invalid code.', negative('errorInvalidCode')],
    ['Invalid code', negative('errorInvalidCode')],
    ['Ungültiger Code.', negative('errorInvalidCode')],
    ['Ungültiger Code', negative('errorInvalidCode')],
    ['Invalid recovery code.', negative('errorInvalidRecoveryCode')],
    ['Invalid recovery code', negative('errorInvalidRecoveryCode')],
    ['Ungültiger Wiederherstellungscode.', negative('errorInvalidRecoveryCode')],
    ['Ungültiger Wiederherstellungscode', negative('errorInvalidRecoveryCode')],
    ['Invalid user code.', negative('errorInvalidUserCode')],
    ['Invalid user code', negative('errorInvalidUserCode')],
    ['Ungültiger Benutzercode.', negative('errorInvalidUserCode')],
    ['Ungültiger Benutzercode', negative('errorInvalidUserCode')],
    ["Passwords don't match.", negative('errorPasswordMismatch')],
    ["Passwords don't match", negative('errorPasswordMismatch')],
    ['Passwords do not match.', negative('errorPasswordMismatch')],
    ['Passwords do not match', negative('errorPasswordMismatch')],
    ['Passwörter stimmen nicht überein.', negative('errorPasswordMismatch')],
    ['Passwörter stimmen nicht überein', negative('errorPasswordMismatch')],
    ['Password confirmation doesn\'t match.', negative('errorPasswordMismatch')],
    ['Password confirmation doesn\'t match', negative('errorPasswordMismatch')],
    ['Account is temporarily disabled, contact your administrator or try again later.', negative('errorAccountTemporarilyDisabled')],
    ['Account is temporarily disabled, contact your administrator or try again later', negative('errorAccountTemporarilyDisabled')],
    ['Konto ist vorübergehend deaktiviert. Wenden Sie sich an Ihren Administrator oder versuchen Sie es später erneut.', negative('errorAccountTemporarilyDisabled')],
    ['Konto ist vorübergehend deaktiviert. Wenden Sie sich an Ihren Administrator oder versuchen Sie es später erneut', negative('errorAccountTemporarilyDisabled')],
    ['Account is disabled, contact your administrator.', negative('errorAccountDisabled')],
    ['Account is disabled, contact your administrator', negative('errorAccountDisabled')],
    ['Konto ist deaktiviert. Wenden Sie sich an Ihren Administrator.', negative('errorAccountDisabled')],
    ['Konto ist deaktiviert. Wenden Sie sich an Ihren Administrator', negative('errorAccountDisabled')],
    ['Incorrect current password.', negative('errorIncorrectCurrentPassword')],
    ['Incorrect current password', negative('errorIncorrectCurrentPassword')],
    ['Falsches aktuelles Passwort.', negative('errorIncorrectCurrentPassword')],
    ['Falsches aktuelles Passwort', negative('errorIncorrectCurrentPassword')],
    ['Invalid existing password.', negative('errorInvalidExistingPassword')],
    ['Invalid existing password', negative('errorInvalidExistingPassword')],
    ['Ungültiges bestehendes Passwort.', negative('errorInvalidExistingPassword')],
    ['Ungültiges bestehendes Passwort', negative('errorInvalidExistingPassword')],
    ['Please specify password.', negative('errorPleaseSpecifyPassword')],
    ['Please specify password', negative('errorPleaseSpecifyPassword')],
    ['Bitte geben Sie ein Passwort an.', negative('errorPleaseSpecifyPassword')],
    ['Bitte geben Sie ein Passwort an', negative('errorPleaseSpecifyPassword')],
    ['Username already exists.', negative('errorUsernameExists')],
    ['Username already exists', negative('errorUsernameExists')],
    ['Benutzername existiert bereits.', negative('errorUsernameExists')],
    ['Benutzername existiert bereits', negative('errorUsernameExists')],
    ['Email already exists.', negative('errorEmailExists')],
    ['Email already exists', negative('errorEmailExists')],
    ['E-Mail existiert bereits.', negative('errorEmailExists')],
    ['E-Mail existiert bereits', negative('errorEmailExists')],
    ['Login timeout. Please sign in again.', negative('errorExpiredCode')],
    ['Login timeout. Please sign in again', negative('errorExpiredCode')],
    ['Anmeldung abgelaufen. Bitte melden Sie sich erneut an.', negative('errorExpiredCode')],
    ['Anmeldung abgelaufen. Bitte melden Sie sich erneut an', negative('errorExpiredCode')],
    ['Action expired. Please continue with login now.', negative('errorExpiredAction')],
    ['Action expired. Please continue with login now', negative('errorExpiredAction')],
    ['Invalid authenticator code.', negative('errorInvalidTotp')],
    ['Invalid authenticator code', negative('errorInvalidTotp')],
    ['Ungültiger Authentifikatorcode.', negative('errorInvalidTotp')],
    ['Ungültiger Authentifikatorcode', negative('errorInvalidTotp')],
    ['Please specify authenticator code.', negative('errorMissingTotp')],
    ['Please specify authenticator code', negative('errorMissingTotp')],
    ['Bitte geben Sie den Authentifikatorcode an.', negative('errorMissingTotp')],
    ['Bitte geben Sie den Authentifikatorcode an', negative('errorMissingTotp')],
    ['You need to set up Mobile Authenticator to activate your account.', negative('errorConfigureTotp')],
    ['You need to set up Mobile Authenticator to activate your account', negative('errorConfigureTotp')],
    ['Failed to send email, please try again later.', negative('errorEmailSendError')],
    ['Failed to send email, please try again later', negative('errorEmailSendError')],
    ['E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.', negative('errorEmailSendError')],
    ['E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut', negative('errorEmailSendError')],
    ['Invalid recovery authentication code.', negative('errorInvalidRecoveryCode')],
    ['Invalid recovery authentication code', negative('errorInvalidRecoveryCode')],
    ['Password successfully changed.', positive('successPasswordChanged')],
    ['Password successfully changed', positive('successPasswordChanged')],
    ['Passwort erfolgreich geändert.', positive('successPasswordChanged')],
    ['Passwort erfolgreich geändert', positive('successPasswordChanged')],
    ['Your password has been updated.', positive('successPasswordUpdated')],
    ['Your password has been updated', positive('successPasswordUpdated')],
    ['Ihr Passwort wurde aktualisiert.', positive('successPasswordUpdated')],
    ['Ihr Passwort wurde aktualisiert', positive('successPasswordUpdated')],
    ['Mobile authenticator configured.', positive('successMobileAuthenticatorConfigured')],
    ['Mobile authenticator configured', positive('successMobileAuthenticatorConfigured')],
    ['Mobiler Authentifikator konfiguriert.', positive('successMobileAuthenticatorConfigured')],
    ['Mobiler Authentifikator konfiguriert', positive('successMobileAuthenticatorConfigured')],
    ['Your account has been updated.', positive('successAccountUpdated')],
    ['Your account has been updated', positive('successAccountUpdated')],
    ['Ihr Konto wurde aktualisiert.', positive('successAccountUpdated')],
    ['Ihr Konto wurde aktualisiert', positive('successAccountUpdated')],
    ['You should receive an email shortly with further instructions.', positive('successEmailSent')],
    ['You should receive an email shortly with further instructions', positive('successEmailSent')],
    ['Sie sollten in Kürze eine E-Mail mit weiteren Anweisungen erhalten.', positive('successEmailSent')],
    ['Sie sollten in Kürze eine E-Mail mit weiteren Anweisungen erhalten', positive('successEmailSent')],
    ['The time allotted for the connection has elapsed.<br/>The login process will restart from the beginning.', neutral('sessionExpired')],
    ['The time allotted for the connection has elapsed.<br>The login process will restart from the beginning.', neutral('sessionExpired')]
  ]
  return Object.fromEntries(entries)
}

const MESSAGE_MAP = buildMessageMap()

export function getMessageKey(message: string | undefined): string | undefined {
  if (message === undefined || message === '') return undefined
  return MESSAGE_MAP[message.trim()]?.key
}

export function getSentimentForMessage(summary: string | undefined, type: MessageType): MessageSentiment {
  if (summary !== undefined && summary !== '') {
    const entry = MESSAGE_MAP[summary.trim()]
    if (entry) return entry.sentiment
  }
  if (type === 'error') return 'negative'
  if (type === 'warning' || type === 'info') return 'neutral'
  return 'positive'
}

export function translateFieldError(
  message: string | undefined,
  t: (key: string) => string
): string | undefined {
  if (message === undefined || message === '') return undefined
  const trimmed = message.trim()
  const key = MESSAGE_MAP[trimmed]?.key
  return key ? t(key) : trimmed
}

export function useTranslatedFieldError(): (message: string | undefined) => string | undefined {
  const t = useTranslation()
  return (message: string | undefined) => translateFieldError(message, t as (key: string) => string)
}
