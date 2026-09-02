import { Link, useNavigate, useParams } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { CloseIcon, DishIcon, HeartIcon, ShareIcon } from '../components/icons'
import { sampleStores } from '../data/sampleStores'
import './StoreDetailPage.css'

function StoreDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const store = sampleStores.find((candidate) => candidate.id === Number(id))

  if (!store) {
    return (
      <PageShell searchPlaceholder="何か検索をする" searchHref="/search">
        <p>店舗が見つかりませんでした。</p>
      </PageShell>
    )
  }

  return (
    <PageShell searchPlaceholder="何か検索をする" searchHref="/search">
      <div className="store-header">
        <div className="store-name">{store.name}</div>
        <div className="store-header-actions">
          <button type="button" className="icon-button" aria-label="お気に入り">
            <HeartIcon />
          </button>
          <button type="button" className="icon-button" aria-label="共有">
            <ShareIcon />
          </button>
          <button type="button" className="icon-button" aria-label="閉じる" onClick={() => navigate(-1)}>
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="store-meta">
        ★{store.rating} ・ ¥{store.priceMin.toLocaleString()}〜¥{store.priceMax.toLocaleString()}
      </div>
      <div className="store-hours">
        {store.hoursStart}〜{store.hoursEnd}
      </div>

      <div className="store-photos">
        <div className="store-photo">
          <DishIcon />
        </div>
        <div className="store-photo">
          <DishIcon />
        </div>
      </div>

      <section className="store-overview">
        <h2>概要</h2>
        <p>{store.description}</p>
      </section>

      <Link to={`/store/${store.id}/checkin`} className="store-checkin-link">
        この店舗に入店する
      </Link>
    </PageShell>
  )
}

export default StoreDetailPage
