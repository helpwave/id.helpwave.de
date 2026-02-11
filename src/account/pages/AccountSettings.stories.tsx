import type { Meta, StoryObj } from '@storybook/react-vite'
import { createKcPageStory } from '../KcPageStory'

const { KcPageStory } = createKcPageStory({ pageId: 'account.ftl' })

const meta = {
    title: 'account/account.ftl',
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <KcPageStory />
}

export const WithUser: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                account: {
                    username: 'jane.doe',
                    email: 'jane.doe@example.com',
                    firstName: 'Jane',
                    lastName: 'Doe'
                },
                realm: {
                    registrationEmailAsUsername: false,
                    editUsernameAllowed: true
                }
            }}
        />
    )
}

export const WithMessage: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                account: {
                    username: 'user',
                    email: 'user@example.com',
                    firstName: 'Test',
                    lastName: 'User'
                },
                message: {
                    type: 'success',
                    summary: 'Your account has been updated.'
                }
            }}
        />
    )
}

export const UsernameReadOnly: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                account: {
                    username: 'fixed.username',
                    email: 'user@example.com',
                    firstName: 'Test',
                    lastName: 'User'
                },
                realm: {
                    registrationEmailAsUsername: false,
                    editUsernameAllowed: false
                }
            }}
        />
    )
}
