import { useState } from 'react'
import { Key, Save } from 'lucide-react'
import { Avatar, Button, Chip, Input, FormFieldLayout } from '@helpwave/hightide'
import type { KcContext } from '../KcContext'
import { useTranslation } from '../../i18n/useTranslation'
import { useTranslatedFieldError } from '../../login/utils/translateFieldError'
import { AlertBox } from '../../login/components/AlertBox'

type AccountSettingsProps = {
    kcContext: Extract<KcContext, { pageId: 'account.ftl' }>,
}

function getDisplayName(kcContext: Extract<KcContext, { pageId: 'account.ftl' }>): string {
    const { account } = kcContext
    const parts = [account.firstName, account.lastName].filter(Boolean) as string[]
    if (parts.length > 0) return parts.join(' ')
    return account.username ?? ''
}

export default function AccountSettings({ kcContext }: AccountSettingsProps) {
    const t = useTranslation()
    const translateError = useTranslatedFieldError()
    const { account, realm, url, stateChecker, messagesPerField, message } = kcContext

    const [username, setUsername] = useState(account.username ?? '')
    const [email, setEmail] = useState(account.email ?? '')
    const [firstName, setFirstName] = useState(account.firstName ?? '')
    const [lastName, setLastName] = useState(account.lastName ?? '')

    const displayName = getDisplayName(kcContext)
    const avatarImage = undefined

    const getFieldError = (fieldName: string) =>
        messagesPerField.existsError(fieldName) ? messagesPerField.get(fieldName) : undefined

    return (
        <div className="flex flex-col gap-8">
            {message && <AlertBox message={message} className="mb-2" />}

            <section className="flex flex-col gap-3">
                <h2 className="text-lg font-bold text-[var(--hw-color-neutral-700)]">
                    {t('accountSectionProfile')}
                </h2>
                <div className="flex items-center gap-3 flex-wrap">
                    <Avatar
                        name={displayName}
                        size="lg"
                        image={avatarImage}
                    />
                    <div className="flex flex-col gap-1">
                        <Chip color="positive" size="sm" coloringStyle="tonal">
                            {t('accountStatusActive')}
                        </Chip>
                        <span className="font-medium text-lg">{displayName || t('username')}</span>
                    </div>
                </div>
            </section>

            <hr className="border-[var(--hw-color-neutral-200)]" />

            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-[var(--hw-color-neutral-700)]">
                    {t('personalInfoTitle')}
                </h2>
                <form
                    action={url.accountUrl}
                    method="post"
                    className="flex flex-col gap-4"
                >
                    <input type="hidden" name="stateChecker" value={stateChecker} />

                    {!realm.registrationEmailAsUsername && (
                        <div>
                            <FormFieldLayout
                                label={t('username')}
                                invalidDescription={translateError(getFieldError('username'))}
                                required={realm.editUsernameAllowed}
                            >
                                {({ id, ariaAttributes }) => (
                                    <Input
                                        id={id}
                                        name="username"
                                        type="text"
                                        value={username}
                                        onValueChange={(v) => setUsername(v)}
                                        onEditComplete={() => {}}
                                        autoComplete="username"
                                        required={realm.editUsernameAllowed}
                                        disabled={!realm.editUsernameAllowed}
                                        {...ariaAttributes}
                                    />
                                )}
                            </FormFieldLayout>
                        </div>
                    )}

                    <div>
                        <FormFieldLayout
                            label={t('email')}
                            invalidDescription={translateError(getFieldError('email'))}
                            required
                        >
                            {({ id, ariaAttributes }) => (
                                <Input
                                    id={id}
                                    name="email"
                                    type="email"
                                    value={email}
                                    onValueChange={(v) => setEmail(v)}
                                    onEditComplete={() => {}}
                                    autoComplete="email"
                                    required
                                    {...ariaAttributes}
                                />
                            )}
                        </FormFieldLayout>
                    </div>

                    <div>
                        <FormFieldLayout
                            label={t('firstName')}
                            invalidDescription={translateError(getFieldError('firstName'))}
                            required
                        >
                            {({ id, ariaAttributes }) => (
                                <Input
                                    id={id}
                                    name="firstName"
                                    type="text"
                                    value={firstName}
                                    onValueChange={(v) => setFirstName(v)}
                                    onEditComplete={() => {}}
                                    autoComplete="given-name"
                                    required
                                    {...ariaAttributes}
                                />
                            )}
                        </FormFieldLayout>
                    </div>

                    <div>
                        <FormFieldLayout
                            label={t('lastName')}
                            invalidDescription={translateError(getFieldError('lastName'))}
                        >
                            {({ id, ariaAttributes }) => (
                                <Input
                                    id={id}
                                    name="lastName"
                                    type="text"
                                    value={lastName}
                                    onValueChange={(v) => setLastName(v)}
                                    onEditComplete={() => {}}
                                    autoComplete="family-name"
                                    {...ariaAttributes}
                                />
                            )}
                        </FormFieldLayout>
                    </div>

                    <Button type="submit" name="submitAction" value="Save" color="primary">
                        <Save className="w-4 h-4" />
                        {t('doSave')}
                    </Button>
                </form>
            </section>

            <hr className="border-[var(--hw-color-neutral-200)]" />

            <section className="flex flex-col gap-3">
                <h2 className="text-lg font-bold text-[var(--hw-color-neutral-700)]">
                    {t('passwordSectionTitle')}
                </h2>
                <Button
                    type="button"
                    color="warning"
                    coloringStyle="outline"
                    onClick={() => {
                        window.location.href = url.passwordUrl
                    }}
                >
                    <Key className="w-4 h-4" />
                    {t('updatePassword')}
                </Button>
            </section>

            <hr className="border-[var(--hw-color-neutral-200)]" />

            <section className="flex flex-col gap-2">
                <h2 className="text-lg font-bold text-[var(--hw-color-neutral-700)]">
                    {t('profilePicture')}
                </h2>
                <p className="text-sm text-[var(--hw-color-neutral-600)]">
                    {t('profilePictureComingSoon')}
                </p>
            </section>
        </div>
    )
}
