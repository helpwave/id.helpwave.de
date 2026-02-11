import { useTranslation } from '../../i18n/useTranslation'

const MESSAGE_TO_KEY: Record<string, string> = {
  'Invalid username or password.': 'errorInvalidUsernameOrPassword',
  'Invalid username or password': 'errorInvalidUsernameOrPassword',
  'Ungültiger Benutzername oder Passwort.': 'errorInvalidUsernameOrPassword',
  'Ungültiger Benutzername oder Passwort': 'errorInvalidUsernameOrPassword',
  'Invalid username.': 'errorInvalidUsername',
  'Invalid username': 'errorInvalidUsername',
  'Ungültiger Benutzername.': 'errorInvalidUsername',
  'Ungültiger Benutzername': 'errorInvalidUsername',
  'Invalid password.': 'errorInvalidPassword',
  'Invalid password': 'errorInvalidPassword',
  'Ungültiges Passwort.': 'errorInvalidPassword',
  'Ungültiges Passwort': 'errorInvalidPassword',
  'Invalid email.': 'errorInvalidEmail',
  'Invalid email': 'errorInvalidEmail',
  'Ungültige E-Mail.': 'errorInvalidEmail',
  'Ungültige E-Mail': 'errorInvalidEmail',
  'Invalid code.': 'errorInvalidCode',
  'Invalid code': 'errorInvalidCode',
  'Ungültiger Code.': 'errorInvalidCode',
  'Ungültiger Code': 'errorInvalidCode',
  'Invalid recovery code.': 'errorInvalidRecoveryCode',
  'Invalid recovery code': 'errorInvalidRecoveryCode',
  'Ungültiger Wiederherstellungscode.': 'errorInvalidRecoveryCode',
  'Ungültiger Wiederherstellungscode': 'errorInvalidRecoveryCode',
  'Invalid user code.': 'errorInvalidUserCode',
  'Invalid user code': 'errorInvalidUserCode',
  'Ungültiger Benutzercode.': 'errorInvalidUserCode',
  'Ungültiger Benutzercode': 'errorInvalidUserCode',
  "Passwords don't match.": 'errorPasswordMismatch',
  "Passwords don't match": 'errorPasswordMismatch',
  'Passwords do not match.': 'errorPasswordMismatch',
  'Passwords do not match': 'errorPasswordMismatch',
  'Passwörter stimmen nicht überein.': 'errorPasswordMismatch',
  'Passwörter stimmen nicht überein': 'errorPasswordMismatch',
  'Account is temporarily disabled, contact your administrator or try again later.': 'errorAccountTemporarilyDisabled',
  'Account is temporarily disabled, contact your administrator or try again later': 'errorAccountTemporarilyDisabled',
  'Konto ist vorübergehend deaktiviert. Wenden Sie sich an Ihren Administrator oder versuchen Sie es später erneut.': 'errorAccountTemporarilyDisabled',
  'Konto ist vorübergehend deaktiviert. Wenden Sie sich an Ihren Administrator oder versuchen Sie es später erneut': 'errorAccountTemporarilyDisabled',
  'Incorrect current password.': 'errorIncorrectCurrentPassword',
  'Incorrect current password': 'errorIncorrectCurrentPassword',
  'Falsches aktuelles Passwort.': 'errorIncorrectCurrentPassword',
  'Falsches aktuelles Passwort': 'errorIncorrectCurrentPassword',
  'Invalid existing password.': 'errorInvalidExistingPassword',
  'Invalid existing password': 'errorInvalidExistingPassword',
  'Ungültiges bestehendes Passwort.': 'errorInvalidExistingPassword',
  'Ungültiges bestehendes Passwort': 'errorInvalidExistingPassword',
  'Please specify password.': 'errorPleaseSpecifyPassword',
  'Please specify password': 'errorPleaseSpecifyPassword',
  'Bitte geben Sie ein Passwort an.': 'errorPleaseSpecifyPassword',
  'Bitte geben Sie ein Passwort an': 'errorPleaseSpecifyPassword',
  'Password successfully changed.': 'successPasswordChanged',
  'Password successfully changed': 'successPasswordChanged',
  'Passwort erfolgreich geändert.': 'successPasswordChanged',
  'Passwort erfolgreich geändert': 'successPasswordChanged',
  'Mobile authenticator configured.': 'successMobileAuthenticatorConfigured',
  'Mobile authenticator configured': 'successMobileAuthenticatorConfigured',
  'Mobiler Authentifikator konfiguriert.': 'successMobileAuthenticatorConfigured',
  'Mobiler Authentifikator konfiguriert': 'successMobileAuthenticatorConfigured',
  'Your account has been updated.': 'successAccountUpdated',
  'Your account has been updated': 'successAccountUpdated',
  'Ihr Konto wurde aktualisiert.': 'successAccountUpdated',
  'Ihr Konto wurde aktualisiert': 'successAccountUpdated',
}

export type MessageSentiment = 'positive' | 'neutral' | 'negative'

export const SENTIMENT_BY_KEY: Record<string, MessageSentiment> = {
  errorInvalidUsernameOrPassword: 'negative',
  errorInvalidUsername: 'negative',
  errorInvalidPassword: 'negative',
  errorInvalidEmail: 'negative',
  errorInvalidCode: 'negative',
  errorInvalidRecoveryCode: 'negative',
  errorInvalidUserCode: 'negative',
  errorPasswordMismatch: 'negative',
  errorAccountTemporarilyDisabled: 'negative',
  errorIncorrectCurrentPassword: 'negative',
  errorInvalidExistingPassword: 'negative',
  errorPleaseSpecifyPassword: 'negative',
  successPasswordChanged: 'positive',
  successMobileAuthenticatorConfigured: 'positive',
  successAccountUpdated: 'positive',
}

export function getMessageKey(message: string | undefined): string | undefined {
  if (message === undefined || message === '') return undefined
  return MESSAGE_TO_KEY[message.trim()]
}

export function translateFieldError(
  message: string | undefined,
  t: (key: string) => string
): string | undefined {
  if (message === undefined || message === '') return undefined
  const trimmed = message.trim()
  const key = MESSAGE_TO_KEY[trimmed]
  return key ? t(key) : trimmed
}

export function useTranslatedFieldError(): (message: string | undefined) => string | undefined {
  const t = useTranslation()
  return (message: string | undefined) => translateFieldError(message, t as (key: string) => string)
}
