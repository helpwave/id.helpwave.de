import { useState } from 'react'
import { Button, Input, FormFieldLayout } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useTranslation } from '../../i18n/useTranslation'
import { useTranslatedFieldError } from '../../login/utils/translateFieldError'

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
                        marginBottom: '0.5rem'
                    }}
                >
                    {message.summary}
                </div>
            )}

            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-[var(--hw-color-neutral-700)]">
                    {t('passwordSectionTitle')}
                </h2>
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
                                        onEditComplete={() => {}}
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
                                    onEditComplete={() => {}}
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
                                    onEditComplete={() => {}}
                                    autoComplete="new-password"
                                    required
                                    {...ariaAttributes}
                                />
                            )}
                        </FormFieldLayout>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button type="submit" name="submitAction" value="Save" color="primary">
                            {t('doSave')}
                        </Button>
                        <Button
                            type="button"
                            color="neutral"
                            onClick={() => {
                                window.location.href = url.accountUrl
                            }}
                        >
                            {t('backToAccount')}
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    )
}
