import PageShell from '../components/PageShell'
import { DishIcon } from '../components/icons'
import './HomePage.css'

const recommendations = [1, 2, 3, 4]

function HomePage() {
  return (
    <PageShell searchPlaceholder="お店を検索" searchHref="/search">
      <section className="recommend-section">
        <h2>あなたへのおすすめ</h2>
        <div className="recommend-scroll">
          {recommendations.map((id) => (
            <div key={id} className="recommend-card">
              <DishIcon />
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  )
}

export default HomePage
