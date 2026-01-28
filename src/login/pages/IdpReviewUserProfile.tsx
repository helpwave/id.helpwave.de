import { useState } from 'react'
import { Button, Input, FormFieldLayout } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { useTranslation } from '../../i18n/useTranslation'
import { useTranslatedFieldError } from '../utils/translateFieldError'

type IdpReviewUserProfileProps = {
    kcContext: Extract<KcContext, { pageId: 'idp-review-user-profile.ftl' }>,
};

export default function IdpReviewUserProfile({ kcContext }: IdpReviewUserProfileProps) {
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
        return initial
    })

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
        const inputType = fieldType === 'email' ? 'email' : 'text'

        return (
            <div key={attrName} className="mb-4">
                <FormFieldLayout
                    label={attr.displayName ?? attrName}
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
                                    : 'var(--hw-color-positive-50)',
                            color:
                                message.type === 'error'
                                    ? 'var(--hw-color-negative-900)'
                                    : 'var(--hw-color-positive-900)',
                            marginBottom: '1rem'
                        }}
                    >
                        {message.summary}
                    </div>
                )}

                <form
                    action={kcContext.url.loginAction}
                    method="post"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {Object.keys(attributes).map((attrName) => renderField(attrName))}

                    <Button type="submit" color="primary">
                        {t('doSubmit')}
                    </Button>
                </form>
            </PageLayout>
        </Template>
    )
}
