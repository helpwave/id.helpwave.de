import type { Meta, StoryObj } from '@storybook/react-vite'
import { createKcPageStory } from '../KcPageStory'

const { KcPageStory } = createKcPageStory({ pageId: 'password.ftl' })

const meta = {
    title: 'account/password.ftl',
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <KcPageStory />
}

export const WithCurrentPassword: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                password: {
                    passwordSet: true
                },
                account: {
                    username: 'user',
                    email: 'user@example.com',
                    firstName: 'Test',
                    lastName: 'User'
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
                    type: 'error',
                    summary: 'Invalid password.'
                }
            }}
        />
    )
}
