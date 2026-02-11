import { useTranslation } from '../../i18n/useTranslation'
import {
  translateFieldError,
  getSentimentForMessage,
  type MessageSentiment,
  type MessageType
} from '../utils/translateFieldError'

type AlertBoxProps = {
  message: { type: MessageType, summary: string },
  className?: string,
  sentiment?: MessageSentiment,
}

const borderColorBySentiment: Record<MessageSentiment, string> = {
  negative: 'var(--color-negative-hover)',
  neutral: 'var(--color-warning)',
  positive: 'var(--color-positive-hover)'
}

const bgColorBySentiment: Record<MessageSentiment, string> = {
  negative: 'var(--color-negative)',
  neutral: 'var(--color-surface-warning)',
  positive: 'var(--color-green-100)'
}

const textColorBySentiment: Record<MessageSentiment, string> = {
  negative: 'var(--color-on-negative)',
  neutral: 'var(--color-orange-900)',
  positive: 'var(--color-green-900)'
}

export function AlertBox({ message, className = '', sentiment: sentimentProp }: AlertBoxProps) {
  const t = useTranslation()
  const translatedSummary =
    translateFieldError(message.summary, t as (key: string) => string) ?? message.summary
  const sentiment = sentimentProp ?? getSentimentForMessage(message.summary, message.type)
  const borderColor = borderColorBySentiment[sentiment]
  const bgColor = bgColorBySentiment[sentiment]
  const textColor = textColorBySentiment[sentiment]
  const isNegative = sentiment === 'negative'
  const backgroundColor = isNegative
    ? bgColor
    : `color-mix(in srgb, ${bgColor} 85%, transparent)`

  return (
    <div
      role="alert"
      className={`rounded-lg p-4 mb-4 border-2 backdrop-blur-md text-center ${className}`}
      style={{
        borderColor,
        backgroundColor,
        color: textColor
      }}
    >
      <p className="m-0 block w-full break-words">{translatedSummary}</p>
    </div>
  )
}
