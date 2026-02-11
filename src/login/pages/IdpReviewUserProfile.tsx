import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button, Input, FormFieldLayout } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useI18n } from '../i18n'
import Template from 'keycloakify/login/Template'
import { PageLayout } from '../components/PageLayout'
import { AlertBox } from '../components/AlertBox'
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
                            onValueChange={(v) => setFormData({ ...formData, [attrName]: v })}
                            onEditComplete={() => {}}
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
                {message && <AlertBox message={message} />}

                <form
                    action={kcContext.url.loginAction}
                    method="post"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {Object.keys(attributes).map((attrName) => renderField(attrName))}

                    <Button type="submit" color="primary">
                        <Send className="w-4 h-4" />
                        {t('doSubmit')}
                    </Button>
                </form>
            </PageLayout>
        </Template>
    )
}
