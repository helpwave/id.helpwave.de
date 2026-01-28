import type { Meta, StoryObj } from '@storybook/react-vite'
import { createKcPageStory } from '../KcPageStory'

const { KcPageStory } = createKcPageStory({ pageId: 'login-page-expired.ftl' })

const meta = {
    title: 'login/login-page-expired.ftl',
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>

export default meta

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
}