import { useTranslation } from '../../i18n/useTranslation'
import {
  translateFieldError,
  getMessageKey,
  SENTIMENT_BY_KEY,
  type MessageSentiment
} from '../utils/translateFieldError'

type MessageType = 'error' | 'warning' | 'success' | 'info'

type AlertBoxProps = {
  message: { type: MessageType, summary: string },
  className?: string,
}

const borderColorBySentiment: Record<MessageSentiment, string> = {
  negative: 'var(--hw-color-negative-500)',
  neutral: 'var(--hw-color-warning-500)',
  positive: 'var(--hw-color-positive-500)'
}

const bgColorBySentiment: Record<MessageSentiment, string> = {
  negative: 'var(--hw-color-negative-50)',
  neutral: 'var(--hw-color-warning-50)',
  positive: 'var(--hw-color-positive-50)'
}

const textColorBySentiment: Record<MessageSentiment, string> = {
  negative: 'var(--hw-color-negative-900)',
  neutral: 'var(--hw-color-warning-900)',
  positive: 'var(--hw-color-positive-900)'
}

function sentimentFromMessage(
  type: MessageType,
  summary: string
): MessageSentiment {
  const key = getMessageKey(summary)
  if (key && SENTIMENT_BY_KEY[key]) return SENTIMENT_BY_KEY[key]
  if (type === 'error') return 'negative'
  if (type === 'warning' || type === 'info') return 'neutral'
  return 'positive'
}

const positiveGlowStyle = {
  boxShadow:
    '0 0 0 1px var(--hw-color-positive-500), 0 0 24px 4px var(--hw-color-positive-500)'
}

export function AlertBox({ message, className = '' }: AlertBoxProps) {
  const t = useTranslation()
  const translatedSummary =
    translateFieldError(message.summary, t as (key: string) => string) ?? message.summary
  const sentiment = sentimentFromMessage(message.type, message.summary)
  const borderColor = borderColorBySentiment[sentiment]
  const bgColor = bgColorBySentiment[sentiment]
  const textColor = textColorBySentiment[sentiment]
  const isPositive = sentiment === 'positive'

  return (
    <div
      role="alert"
      className={`rounded-lg p-4 mb-4 border-2 backdrop-blur-md text-center ${className}`}
      style={{
        borderColor,
        backgroundColor: `color-mix(in srgb, ${bgColor} 85%, transparent)`,
        color: textColor,
        ...(isPositive ? positiveGlowStyle : {})
      }}
    >
      <p className="m-0 block w-full break-words">{translatedSummary}</p>
    </div>
  )
}
