import { useState } from 'react'
import { Button, Input, FormFieldLayout, CheckboxUncontrolled } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'
import type { HelpwaveIdTranslationEntries } from '../../i18n/translations'
import { useTranslatedFieldError } from '../utils/translateFieldError'

type RegisterProps = {
    kcContext: Extract<KcContext, { pageId: 'register.ftl' }>,
};

export default function Register({ kcContext }: RegisterProps) {
    const { i18n } = useI18n({ kcContext })
    const t = useTranslation()
    const translateError = useTranslatedFieldError()

    const profile = kcContext.profile
    const attributes = profile?.attributesByName ?? {}

    const [formData, setFormData] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {}
        Object.values(attributes).forEach((attr) => {
            initial[attr.name] = attr.value ?? ''
        })
        if (!('password' in initial)) initial['password'] = ''
        if (!('password-confirm' in initial)) initial['password-confirm'] = ''
        return initial
    })
    const [termsAccepted, setTermsAccepted] = useState(false)

    const getFieldLabel = (attrName: string, displayName: string | undefined): string => {
        const keyMap: Record<string, keyof HelpwaveIdTranslationEntries> = {
            'username': 'username',
            'email': 'email',
            'firstName': 'firstName',
            'lastName': 'lastName',
            'password': 'password',
            'password-confirm': 'passwordConfirm',
        }
        const key = keyMap[attrName]
        return key ? t(key) : (displayName ?? attrName)
    }

    const message = kcContext.message

    const getFieldError = (fieldName: string) => {
        return kcContext.messagesPerField?.existsError(fieldName)
            ? kcContext.messagesPerField.get(fieldName)
            : undefined
    }

    const renderField = (attrName: string) => {
        const attr = attributes[attrName]
        if (!attr) return null

        const fieldType = attr.annotations.inputType ?? 'text'
        const isPassword = attrName === 'password' || attrName === 'password-confirm'
        const inputType = isPassword ? 'password' : fieldType === 'email' ? 'email' : 'text'

        return (
            <div key={attrName} className="mb-4">
                <FormFieldLayout
                    label={getFieldLabel(attrName, attr.displayName)}
                    invalidDescription={translateError(getFieldError(attrName))}
                    required={attr.required}
                >
                {({ id, ariaAttributes }) => (
                    <Input
                        id={id}
                        name={attrName}
                        type={inputType}
                        value={formData[attrName] ?? ''}
                        onChange={(e) => setFormData({ ...formData, [attrName]: e.target.value })}
                        autoComplete={attr.autocomplete ?? 'off'}
                        required={attr.required}
                        readOnly={attr.readOnly}
                        disabled={attr.readOnly}
                        {...ariaAttributes}
                    />
                )}
                </FormFieldLayout>
            </div>
        )
    }

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            displayMessage={!!message}
            headerNode={null}
            doUseDefaultCss={false}
        >
            <PageLayout kcContext={kcContext}>
                {message && (
                    <div
                        role="alert"
                        style={{
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            backgroundColor:
                                message.type === 'error'
                                    ? 'var(--hw-color-negative-50)'
                                    : message.type === 'warning'
                                      ? 'var(--hw-color-warning-50)'
                                      : 'var(--hw-color-positive-50)',
                            color:
                                message.type === 'error'
                                    ? 'var(--hw-color-negative-900)'
                                    : message.type === 'warning'
                                      ? 'var(--hw-color-warning-900)'
                                      : 'var(--hw-color-positive-900)',
                            marginBottom: '1rem'
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
                    {Object.keys(attributes).map((attrName) => {
                        if (attrName === 'password' || attrName === 'password-confirm') return null
                        return renderField(attrName)
                    })}

                    {attributes['password'] ? renderField('password') : (
                        <div className="mb-4">
                            <FormFieldLayout
                                label={t('password')}
                                invalidDescription={translateError(getFieldError('password'))}
                                required
                            >
                                {({ id, ariaAttributes }) => (
                                    <Input
                                        id={id}
                                        name="password"
                                        type="password"
                                        value={formData['password'] ?? ''}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        autoComplete="new-password"
                                        required
                                        {...ariaAttributes}
                                    />
                                )}
                            </FormFieldLayout>
                        </div>
                    )}

                    {attributes['password-confirm'] ? renderField('password-confirm') : (
                        <div className="mb-4">
                            <FormFieldLayout
                                label={t('passwordConfirm')}
                                invalidDescription={translateError(getFieldError('password-confirm'))}
                                required
                            >
                                {({ id, ariaAttributes }) => (
                                    <Input
                                        id={id}
                                        name="password-confirm"
                                        type="password"
                                        value={formData['password-confirm'] ?? ''}
                                        onChange={(e) => setFormData({ ...formData, 'password-confirm': e.target.value })}
                                        autoComplete="new-password"
                                        required
                                        {...ariaAttributes}
                                    />
                                )}
                            </FormFieldLayout>
                        </div>
                    )}

                    {kcContext.termsAcceptanceRequired && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckboxUncontrolled
                                value={termsAccepted}
                                onValueChange={(value) => setTermsAccepted(value)}
                                onEditComplete={() => {}}
                                size="md"
                            />
                            <label
                                onClick={() => setTermsAccepted(!termsAccepted)}
                                onKeyDown={(e) => e.key === 'Enter' && setTermsAccepted((prev) => !prev)}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                role="button"
                                tabIndex={0}
                            >
                                <a href={(() => {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const url = kcContext.url as any
                                    return url.termsUrl ?? kcContext.url.loginUrl.replace('/login', '/terms')
                                })()} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                    {t('acceptTerms')}
                                </a>
                            </label>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Button type="submit" color="primary">
                            {t('doRegister')}
                        </Button>

                        <Button
                            type="button"
                            color="neutral"
                            onClick={() => {
                                window.location.href = kcContext.url.loginUrl
                            }}
                        >
                            <ArrowLeft size={16} style={{ marginRight: '0.5rem', display: 'inline-block' }} />
                            {t('backToLogin')}
                        </Button>
                    </div>
                </form>
            </PageLayout>
        </Template>
    )
}