export interface SampleStore {
  id: number
  name: string
  rating: number
  priceMin: number
  priceMax: number
  hoursStart: string
  hoursEnd: string
  waitMinutes: number
  description: string
}

export const sampleStores: SampleStore[] = [
  {
    id: 1,
    name: '店舗A',
    rating: 4.5,
    priceMin: 2000,
    priceMax: 4000,
    hoursStart: '18:00',
    hoursEnd: '22:00',
    waitMinutes: 5,
    description: '店舗の紹介文がここに入ります。',
  },
  {
    id: 2,
    name: '店舗B',
    rating: 4.1,
    priceMin: 1500,
    priceMax: 3000,
    hoursStart: '11:00',
    hoursEnd: '21:00',
    waitMinutes: 15,
    description: '店舗の紹介文がここに入ります。',
  },
  {
    id: 3,
    name: '店舗C',
    rating: 3.8,
    priceMin: 1000,
    priceMax: 2000,
    hoursStart: '17:00',
    hoursEnd: '23:00',
    waitMinutes: 0,
    description: '店舗の紹介文がここに入ります。',
  },
]
