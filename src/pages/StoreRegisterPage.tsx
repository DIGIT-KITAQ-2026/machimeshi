import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CameraIcon, ChevronLeftIcon } from '../components/icons'
import './StoreRegisterPage.css'

function StoreRegisterPage() {
  const navigate = useNavigate()
  const [price, setPrice] = useState(2000)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <div className="store-register-screen">
      <button type="button" className="store-register-back" onClick={() => navigate(-1)}>
        <ChevronLeftIcon />
        戻る
      </button>

      <form className="store-register-form" onSubmit={handleSubmit}>
        <label className="store-register-field">
          <span className="store-register-label">店名</span>
          <input type="text" name="name" required />
        </label>

        <div className="store-register-field">
          <span className="store-register-label">金額（目安）</span>
          <div className="store-register-slider-row">
            <input
              type="range"
              min={500}
              max={10000}
              step={500}
              value={price}
              onChange={(event) => setPrice(Number(event.target.value))}
            />
            <span className="store-register-slider-value">¥{price.toLocaleString()}</span>
          </div>
        </div>

        <div className="store-register-field">
          <span className="store-register-label">時間</span>
          <div className="store-register-time-row">
            <input type="time" name="hoursStart" required />
            <span>〜</span>
            <input type="time" name="hoursEnd" required />
          </div>
        </div>

        <label className="store-register-field">
          <span className="store-register-label">ジャンル（タグ）</span>
          <input type="text" name="genre" placeholder="例）居酒屋, 和食" />
        </label>

        <div className="store-register-field">
          <span className="store-register-label">写真（任意）</span>
          <button type="button" className="store-register-photo">
            <CameraIcon />
          </button>
        </div>

        <div className="store-register-row">
          <label className="store-register-field">
            <span className="store-register-label">卓の数</span>
            <input type="number" name="tableCount" min={0} />
          </label>
          <label className="store-register-field">
            <span className="store-register-label">カウンターの数</span>
            <input type="number" name="counterCount" min={0} />
          </label>
        </div>

        <label className="store-register-field">
          <span className="store-register-label">IDの生成方法</span>
          <select name="idGeneration" defaultValue="auto">
            <option value="auto">自動生成</option>
            <option value="from-name">店名から生成</option>
            <option value="manual">手動で入力</option>
          </select>
        </label>

        <button type="submit" className="store-register-submit">
          決定
        </button>
      </form>
    </div>
  )
}

export default StoreRegisterPage
