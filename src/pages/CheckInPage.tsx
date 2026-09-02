import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeftIcon } from '../components/icons'
import { sampleStores } from '../data/sampleStores'
import './CheckInPage.css'

type SeatType = 'table' | 'counter'

function generateId() {
  return String(Math.floor(1000 + Math.random() * 9000))
}

function CheckInPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const store = sampleStores.find((candidate) => candidate.id === Number(id))

  const [seatType, setSeatType] = useState<SeatType>('table')
  const [partySize, setPartySize] = useState(1)
  const [checkedInId, setCheckedInId] = useState<string | null>(null)

  const [checkOutId, setCheckOutId] = useState('')
  const [checkOutMessage, setCheckOutMessage] = useState('')

  const handleCheckIn = () => {
    setCheckedInId(generateId())
  }

  const handleCheckOut = () => {
    if (checkedInId && checkOutId === checkedInId) {
      setCheckedInId(null)
      setCheckOutId('')
      setCheckOutMessage('退店しました')
    } else {
      setCheckOutMessage('IDが一致しません')
    }
  }

  return (
    <div className="checkin-screen">
      <button type="button" className="checkin-back" onClick={() => navigate(-1)}>
        <ChevronLeftIcon />
        戻る
      </button>

      <div className="checkin-store-name">{store?.name ?? '店舗'}</div>

      <div className="checkin-section">
        <span className="checkin-label">席状況</span>
        <div className="checkin-seat-toggle">
          <button
            type="button"
            className={`checkin-seat-option${seatType === 'table' ? ' checkin-seat-option-active' : ''}`}
            onClick={() => setSeatType('table')}
          >
            卓
          </button>
          <button
            type="button"
            className={`checkin-seat-option${seatType === 'counter' ? ' checkin-seat-option-active' : ''}`}
            onClick={() => setSeatType('counter')}
          >
            カウンター
          </button>
        </div>
      </div>

      <div className="checkin-section">
        <span className="checkin-label">人数</span>
        <div className="checkin-stepper">
          <button type="button" onClick={() => setPartySize((n) => Math.max(1, n - 1))} aria-label="人数を減らす">
            −
          </button>
          <span className="checkin-stepper-value">{partySize}</span>
          <button type="button" onClick={() => setPartySize((n) => n + 1)} aria-label="人数を増やす">
            +
          </button>
          <span className="checkin-stepper-unit">人</span>
        </div>
      </div>

      <div className="checkin-section">
        <span className="checkin-label">ID</span>
        <div className="checkin-id-display">#{checkedInId ?? '----'}</div>
      </div>

      <button type="button" className="checkin-submit" onClick={handleCheckIn} disabled={checkedInId !== null}>
        {checkedInId ? '入店済み' : '入店'}
      </button>

      <hr className="checkin-divider" />

      <div className="checkin-section">
        <span className="checkin-label">ID</span>
        <input
          type="text"
          className="checkin-id-input"
          value={checkOutId}
          onChange={(event) => {
            setCheckOutId(event.target.value)
            setCheckOutMessage('')
          }}
          placeholder="#1234"
        />
      </div>

      {checkOutMessage && <p className="checkin-message">{checkOutMessage}</p>}

      <button type="button" className="checkin-leave" onClick={handleCheckOut}>
        退店
      </button>
    </div>
  )
}

export default CheckInPage
