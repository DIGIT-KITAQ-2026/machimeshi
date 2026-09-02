import { Link, useSearchParams } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { DishIcon, FilterIcon } from '../components/icons'
import { sampleStores } from '../data/sampleStores'
import './SearchResultsPage.css'

function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''
  const results = query
    ? sampleStores.filter((result) => result.name.toLowerCase().includes(query.toLowerCase()))
    : sampleStores

  return (
    <PageShell searchPlaceholder="何か検索をする" searchHref="/search" searchDefaultValue={query}>
      <div className="results-toolbar">
        <span className="results-count">
          {query ? `「${query}」の検索結果` : '検索結果'}（{results.length}件）
        </span>
        <button type="button" className="icon-button filter-button" aria-label="並び替え・絞り込み">
          <FilterIcon />
        </button>
      </div>

      <ul className="results-list">
        {results.map((result) => (
          <li key={result.id}>
            <Link to={`/store/${result.id}`} className="result-row">
              <div className="result-info">
                <div className="result-name">{result.name}</div>
                <div className="result-meta">
                  ★{result.rating} ・ ¥{result.priceMin.toLocaleString()}〜¥{result.priceMax.toLocaleString()}
                </div>
                <div className="result-hours">
                  {result.hoursStart}〜{result.hoursEnd}
                </div>
              </div>
              <div className="result-thumb">
                <DishIcon />
              </div>
              <span className="wait-badge" aria-label={`待ち時間 ${result.waitMinutes}分`}>
                <span className="wait-number">{result.waitMinutes}</span>
                <span className="wait-unit">分</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  )
}

export default SearchResultsPage
