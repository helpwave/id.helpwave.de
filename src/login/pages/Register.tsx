import { Button } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { RealmChip } from '../components/RealmChip'
import { lazy } from 'react'

const UserProfileFormFields = lazy(
    () => import('keycloakify/login/UserProfileFormFields')
)

type RegisterProps = {
    kcContext: Extract<KcContext, { pageId: 'register.ftl' }>,
};

export default function Register({ kcContext }: RegisterProps) {
    const { i18n } = useI18n({ kcContext })

    const message = kcContext.message

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            displayMessage={!!message}
            headerNode={i18n.msgStr('registerTitle')}
            doUseDefaultCss={false}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    width: '100%',
                    maxWidth: '400px',
                    margin: '0 auto',
                    padding: '1rem'
                }}
            >
                <RealmChip kcContext={kcContext} />

                {message && (
                    <div
                        role="alert"
                        style={{
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            backgroundColor:
                                message.type === 'error'
                                    ? 'var(--hw-color-negative-50, #fee)'
                                    : message.type === 'warning'
                                      ? 'var(--hw-color-warning-50, #ffa)'
                                      : 'var(--hw-color-positive-50, #efe)',
                            color:
                                message.type === 'error'
                                    ? 'var(--hw-color-negative-900, #c00)'
                                    : message.type === 'warning'
                                      ? 'var(--hw-color-warning-900, #880)'
                                      : 'var(--hw-color-positive-900, #060)',
                        }}
                    >
                        {message.summary}
                    </div>
                )}

                <form
                    id="kc-register-form"
                    action={kcContext.url.registrationAction}
                    method="post"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <UserProfileFormFields
                        kcContext={kcContext}
                        i18n={i18n}
                        kcClsx={() => ''}
                        onIsFormSubmittableValueChange={() => {}}
                        doMakeUserConfirmPassword={true}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Button type="submit" color="primary">
                            {i18n.msgStr('doRegister')}
                        </Button>

                        <Button
                            type="button"
                            color="secondary"
                            onClick={() => {
                                window.location.href = kcContext.url.loginUrl
                            }}
                        >
                            {i18n.msgStr('backToLogin')}
                        </Button>
                    </div>
                </form>
            </div>
        </Template>
    )
}