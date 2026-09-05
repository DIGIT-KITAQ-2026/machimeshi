interface RecommendationListProps {
  suggestions: string[]
  onSelect: (queryText: string) => void
}

/** おすすめ検索機能（機能要件5）: AIが生成したおすすめ検索を表示・選択する */
export default function RecommendationList({ suggestions, onSelect }: RecommendationListProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="recommend-grid">
      {suggestions.map((text) => (
        <button
          key={text}
          type="button"
          className="recommend-card"
          onClick={() => onSelect(text)}
        >
          <span className="recommend-card__text">{text}</span>
        </button>
      ))}
    </div>
  )
}
