import { useState } from 'react'
import { ArrowLeft, Shield } from 'lucide-react'
import { Button, Input, FormFieldLayout } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useTranslation } from '../../i18n/useTranslation'
import { useTranslatedFieldError } from '../../login/utils/translateFieldError'
import { AlertBox } from '../../login/components/AlertBox'

type AccountPasswordProps = {
    kcContext: Extract<KcContext, { pageId: 'password.ftl' }>,
}

export default function AccountPassword({ kcContext }: AccountPasswordProps) {
    const t = useTranslation()
    const translateError = useTranslatedFieldError()
    const { url, password, account, stateChecker, messagesPerField, message } = kcContext

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('')

    const passwordError = messagesPerField.existsError('password')
        ? messagesPerField.get('password')
        : undefined
    const newPasswordError = messagesPerField.existsError('password-new')
        ? messagesPerField.get('password-new')
        : undefined
    const passwordConfirmError = messagesPerField.existsError('password-confirm')
        ? messagesPerField.get('password-confirm')
        : undefined

    return (
        <div className="flex flex-col gap-8">
            {message && <AlertBox message={message} className="mb-2" />}

            <section className="flex flex-col gap-4">
                <form
                    action={url.passwordUrl}
                    method="post"
                    className="flex flex-col gap-4"
                >
                    <input type="hidden" name="stateChecker" value={stateChecker} />
                    <input
                        type="hidden"
                        name="username"
                        value={account.username ?? ''}
                        autoComplete="username"
                        readOnly
                    />

                    {password.passwordSet && (
                        <div>
                            <FormFieldLayout
                                label={t('password')}
                                invalidDescription={translateError(passwordError)}
                            >
                                {({ id, ariaAttributes }) => (
                                    <Input
                                        id={id}
                                        name="password"
                                        type="password"
                                        value={currentPassword}
                                        onValueChange={(v) => setCurrentPassword(v)}
                                        onEditComplete={() => { }}
                                        autoComplete="current-password"
                                        {...ariaAttributes}
                                    />
                                )}
                            </FormFieldLayout>
                        </div>
                    )}

                    <div>
                        <FormFieldLayout
                            label={t('passwordNew')}
                            invalidDescription={translateError(newPasswordError)}
                            required
                        >
                            {({ id, ariaAttributes }) => (
                                <Input
                                    id={id}
                                    name="password-new"
                                    type="password"
                                    value={newPassword}
                                    onValueChange={(v) => setNewPassword(v)}
                                    onEditComplete={() => { }}
                                    autoComplete="new-password"
                                    required
                                    {...ariaAttributes}
                                />
                            )}
                        </FormFieldLayout>
                    </div>

                    <div>
                        <FormFieldLayout
                            label={t('passwordConfirm')}
                            invalidDescription={translateError(passwordConfirmError)}
                            required
                        >
                            {({ id, ariaAttributes }) => (
                                <Input
                                    id={id}
                                    name="password-confirm"
                                    type="password"
                                    value={newPasswordConfirm}
                                    onValueChange={(v) => setNewPasswordConfirm(v)}
                                    onEditComplete={() => { }}
                                    autoComplete="new-password"
                                    required
                                    {...ariaAttributes}
                                />
                            )}
                        </FormFieldLayout>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button type="submit" name="submitAction" value="Save" color="primary">
                            <Shield className="w-4 h-4" />
                            {t('doUpdate')}
                        </Button>
                        <Button
                            type="button"
                            color="neutral"
                            coloringStyle="outline"
                            onClick={() => {
                                window.location.href = url.accountUrl
                            }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('backToAccount')}
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    )
}
