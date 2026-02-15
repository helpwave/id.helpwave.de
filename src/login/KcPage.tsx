import { Suspense, lazy } from 'react'
import type { KcContext } from './KcContext'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Info from './pages/Info'
import Error from './pages/Error'
import Code from './pages/Code'
import LogoutConfirm from './pages/LogoutConfirm'
import Terms from './pages/Terms'
import LoginOtp from './pages/LoginOtp'
import LoginUpdatePassword from './pages/LoginUpdatePassword'
import LoginVerifyEmail from './pages/LoginVerifyEmail'
import DeleteAccountConfirm from './pages/DeleteAccountConfirm'
import DeleteCredential from './pages/DeleteCredential'
import FrontchannelLogout from './pages/FrontchannelLogout'
import IdpReviewUserProfile from './pages/IdpReviewUserProfile'
import LinkIdpAction from './pages/LinkIdpAction'
import LoginConfigTotp from './pages/LoginConfigTotp'
import LoginIdpLinkConfirm from './pages/LoginIdpLinkConfirm'
import LoginIdpLinkConfirmOverride from './pages/LoginIdpLinkConfirmOverride'
import LoginIdpLinkEmail from './pages/LoginIdpLinkEmail'
import LoginOauth2DeviceVerifyUserCode from './pages/LoginOauth2DeviceVerifyUserCode'
import LoginOauthGrant from './pages/LoginOauthGrant'
import LoginPageExpired from './pages/LoginPageExpired'
import LoginPasskeysConditionalAuthenticate from './pages/LoginPasskeysConditionalAuthenticate'
import LoginPassword from './pages/LoginPassword'
import LoginRecoveryAuthnCodeConfig from './pages/LoginRecoveryAuthnCodeConfig'
import LoginRecoveryAuthnCodeInput from './pages/LoginRecoveryAuthnCodeInput'
import LoginResetOtp from './pages/LoginResetOtp'
import LoginUpdateProfile from './pages/LoginUpdateProfile'
import LoginUsername from './pages/LoginUsername'
import LoginX509Info from './pages/LoginX509Info'
import SelectAuthenticator from './pages/SelectAuthenticator'
import SelectOrganization from './pages/SelectOrganization'
import UpdateEmail from './pages/UpdateEmail'
import WebauthnAuthenticate from './pages/WebauthnAuthenticate'
import WebauthnError from './pages/WebauthnError'
import WebauthnRegister from './pages/WebauthnRegister'
import DefaultPage from 'keycloakify/login/DefaultPage'
import Template from 'keycloakify/login/Template'
import { HelpwaveLogo } from '@helpwave/hightide'
import { useI18n } from './i18n'

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props
    const { i18n } = useI18n({ kcContext })

    return (
        <Suspense
            fallback={(
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <HelpwaveLogo animate="loading" color="currentColor" height={128} width={128} />
                </div>
            )}
        >
            {(() => {
                switch (kcContext.pageId) {
                    case 'login.ftl':
                        return <Login kcContext={kcContext} />
                    case 'register.ftl':
                        return <Register kcContext={kcContext} />
                    case 'login-reset-password.ftl':
                        return <ForgotPassword kcContext={kcContext} />
                    case 'info.ftl':
                        return <Info kcContext={kcContext} />
                    case 'error.ftl':
                        return <Error kcContext={kcContext} />
                    case 'code.ftl':
                        return <Code kcContext={kcContext} />
                    case 'logout-confirm.ftl':
                        return <LogoutConfirm kcContext={kcContext} />
                    case 'terms.ftl':
                        return <Terms kcContext={kcContext} />
                    case 'login-otp.ftl':
                        return <LoginOtp kcContext={kcContext} />
                    case 'login-update-password.ftl':
                        return <LoginUpdatePassword kcContext={kcContext} />
                    case 'login-verify-email.ftl':
                        return <LoginVerifyEmail kcContext={kcContext} />
                    case 'delete-account-confirm.ftl':
                        return <DeleteAccountConfirm kcContext={kcContext} />
                    case 'delete-credential.ftl':
                        return <DeleteCredential kcContext={kcContext} />
                    case 'frontchannel-logout.ftl':
                        return <FrontchannelLogout kcContext={kcContext} />
                    case 'idp-review-user-profile.ftl':
                        return <IdpReviewUserProfile kcContext={kcContext} />
                    case 'link-idp-action.ftl':
                        return <LinkIdpAction kcContext={kcContext} />
                    case 'login-config-totp.ftl':
                        return <LoginConfigTotp kcContext={kcContext} />
                    case 'login-idp-link-confirm.ftl':
                        return <LoginIdpLinkConfirm kcContext={kcContext} />
                    case 'login-idp-link-confirm-override.ftl':
                        return <LoginIdpLinkConfirmOverride kcContext={kcContext} />
                    case 'login-idp-link-email.ftl':
                        return <LoginIdpLinkEmail kcContext={kcContext} />
                    case 'login-oauth2-device-verify-user-code.ftl':
                        return <LoginOauth2DeviceVerifyUserCode kcContext={kcContext} />
                    case 'login-oauth-grant.ftl':
                        return <LoginOauthGrant kcContext={kcContext} />
                    case 'login-page-expired.ftl':
                        return <LoginPageExpired kcContext={kcContext} />
                    case 'login-passkeys-conditional-authenticate.ftl':
                        return <LoginPasskeysConditionalAuthenticate kcContext={kcContext} />
                    case 'login-password.ftl':
                        return <LoginPassword kcContext={kcContext} />
                    case 'login-recovery-authn-code-config.ftl':
                        return <LoginRecoveryAuthnCodeConfig kcContext={kcContext} />
                    case 'login-recovery-authn-code-input.ftl':
                        return <LoginRecoveryAuthnCodeInput kcContext={kcContext} />
                    case 'login-reset-otp.ftl':
                        return <LoginResetOtp kcContext={kcContext} />
                    case 'login-update-profile.ftl':
                        return <LoginUpdateProfile kcContext={kcContext} />
                    case 'login-username.ftl':
                        return <LoginUsername kcContext={kcContext} />
                    case 'login-x509-info.ftl':
                        return <LoginX509Info kcContext={kcContext} />
                    case 'select-authenticator.ftl':
                        return <SelectAuthenticator kcContext={kcContext} />
                    case 'select-organization.ftl':
                        return <SelectOrganization kcContext={kcContext} />
                    case 'update-email.ftl':
                        return <UpdateEmail kcContext={kcContext} />
                    case 'webauthn-authenticate.ftl':
                        return <WebauthnAuthenticate kcContext={kcContext} />
                    case 'webauthn-error.ftl':
                        return <WebauthnError kcContext={kcContext} />
                    case 'webauthn-register.ftl':
                        return <WebauthnRegister kcContext={kcContext} />
                    default: {
                        const UserProfileFormFields = lazy(
                            () => import('keycloakify/login/UserProfileFormFields')
                        )

                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                Template={Template}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={true}
                            />
                        )
                    }
                }
            })()}
        </Suspense>
    )
}
