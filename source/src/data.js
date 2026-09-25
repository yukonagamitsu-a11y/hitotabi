export const TYPES = {
  flight: { icon: '✈️', ja: '飛行機', en: 'Flight' },
  car: { icon: '🚗', ja: 'レンタカー', en: 'Rental car' },
  train: { icon: '🚆', ja: '電車・バス', en: 'Train / Bus' },
  hotel: { icon: '🏨', ja: 'ホテル', en: 'Hotel' },
  meal: { icon: '🍽️', ja: '食事', en: 'Meal' },
  sight: { icon: '📍', ja: '観光', en: 'Sightseeing' },
  other: { icon: '📝', ja: 'その他', en: 'Other' },
}

// 種類ごとに入力できる「一目で見たい」項目
export const EXTRA_FIELDS = {
  flight: ['flightNo', 'terminal', 'gate', 'conf', 'phone'],
  car: ['company', 'conf', 'phone'],
  hotel: ['conf', 'phone'],
  train: ['conf', 'phone'],
  meal: ['conf', 'phone'],
  sight: [],
  other: ['conf', 'phone'],
}

// 到着時刻で自動的に消える種類(それ以外は自分で✓して消す)
export const AUTO_TYPES = ['flight', 'train']

export const TIMEZONES = ['Asia/Tokyo', 'Asia/Seoul', 'Asia/Taipei', 'Asia/Bangkok', 'Asia/Singapore', 'Europe/London', 'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Pacific/Honolulu', 'Australia/Sydney']

export const uid = () => Math.random().toString(36).slice(2, 10)
export const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
export const mapsEmbed = (q) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`

const STR = {
  ja: {
    tagline: '旅の予定を、ひとつに。', eyebrow: 'YOUR NEXT JOURNEY', newTrip: '＋ 旅行をつくる', myTrips: 'あなたの旅行', sampleTitle: '使い方サンプル',
    startHint: 'サンプルを見ながら、あなただけの旅行を始めましょう。', startOwn: '自分の旅行をつくる →', createTitle: '旅行をつくる',
    tripName: '旅行名', destination: '行き先', startDate: '出発日', endDate: '帰宅日', create: 'つくる', cancel: 'キャンセル', back: '← 旅行一覧',
    delTrip: '旅行を削除', delTripQ: 'この旅行を削除しますか?', sampleNote: 'これは閲覧用のサンプルです。編集するには「自分の旅行をつくる」から始めてください。',
    upcoming: 'これからの予定', all: '全旅程', arrDate: '到着日', arrTime: '到着時刻(現地)', arrTz: '到着地のタイムゾーン', arrives: '着', autoHint: '飛行機・電車は到着時刻を過ぎると自動で「しおり」から消えます。それ以外は✓で消えます。消えた予定は「全旅程」で見られます。', finished: '終了', allHint: '終わった予定も含め、すべての予定です。', doneN: (a, b) => `${a} / ${b} 完了`,
    nowLocal: (s) => `現地のいま ${s}。終わった予定は「しおり」から隠れます。`,
    tabPlan: '📖 しおり', tabAll: '🗂 全旅程', tabWish: '⭐ 行きたい場所', tabMap: '🗺 地図', tabMembers: '👥 メンバー',
    journey: '出発から、帰宅まで。', none: '表示する予定がありません。', undated: '日付未定 — あとで日付を決める',
    done: '✓ 完了にする', undo: '↩ 未完了に戻す', gmaps: 'Googleマップ', detail: '詳細', openMaps: 'Googleマップで開く',
    addItem: '＋ 予定を追加', addWish: '＋ 行きたい場所を追加', add: '追加', type: '種類', title: 'タイトル', date: '日付', time: '現地時刻', tz: 'タイムゾーン',
    place: '場所・住所', note: 'メモ', del: '削除', delItemQ: 'この予定を削除しますか?',
    flightNo: '便名', terminal: 'ターミナル', gate: 'ゲート', conf: '予約番号', company: '会社名', phone: '連絡先(電話)', troubleMemo: '自分用のトラブル時メモ', trouble: '⚠ トラブル時', keep: '🔒 消さない', unkeep: '🔓 自動で消す設定に戻す', showAgain: '↺ しおりに戻す', keepHint: '予定が変わったときに、到着時刻で自動で消えないようにします。', troubleTitle: 'トラブルがあったとき', affected: 'この予定が遅れたり変わったりすると影響しそうな予定', noAffected: '影響しそうな予定は登録されていません。', noPhone: '連絡先未登録', call: '電話', memoLabel: 'メモ', addContactHint: '「詳細」から連絡先(電話)を入れておくと、ここに出ます。',
    wishTitle: '行きたい場所', wishHint: '日付を決めていない予定です。「詳細」で日付を入れると、しおりの日程に移ります。', empty: 'まだありません。',
    mapTitle: '地図', mapEmpty: '場所が登録された予定がありません。', membersTitle: 'メンバー', membersHint: '一緒に行く人の名簿です(現在はこの端末内のみに保存されます)。',
    sampleNoMembers: 'サンプルには登録されていません。', name: '名前', placeholderTitle: '例:羽田空港 → 那覇空港', placeholderTrip: '例:沖縄、海辺の休日', placeholderPlace: '例:那覇空港 第1ターミナル',
  },
  en: {
    tagline: 'All your travel plans, in one place.', eyebrow: 'YOUR NEXT JOURNEY', newTrip: '+ New trip', myTrips: 'Your trips', sampleTitle: 'Sample',
    startHint: 'Look around the sample, then start your own trip.', startOwn: 'Create your own trip →', createTitle: 'New trip',
    tripName: 'Trip name', destination: 'Destination', startDate: 'Departure', endDate: 'Return', create: 'Create', cancel: 'Cancel', back: '← All trips',
    delTrip: 'Delete trip', delTripQ: 'Delete this trip?', sampleNote: 'This is a read-only sample. Use "Create your own trip" to start editing.',
    upcoming: 'Upcoming', all: 'Full itinerary', arrDate: 'Arrival date', arrTime: 'Arrival time (local)', arrTz: 'Arrival time zone', arrives: 'arrives', autoHint: 'Flights and trains disappear from the itinerary once they arrive. Everything else disappears when you tick it. Find them all in the Full itinerary tab.', finished: 'Finished', allHint: 'Every item, including finished ones.', doneN: (a, b) => `${a} / ${b} done`,
    nowLocal: (s) => `Local time now: ${s}. Finished items are hidden from the Itinerary tab.`,
    tabPlan: '📖 Itinerary', tabAll: '🗂 Full itinerary', tabWish: '⭐ Wishlist', tabMap: '🗺 Map', tabMembers: '👥 Members',
    journey: 'From departure to home.', none: 'Nothing to show.', undated: 'Undated — decide the day later',
    done: '✓ Mark done', undo: '↩ Mark not done', gmaps: 'Google Maps', detail: 'Details', openMaps: 'Open in Google Maps',
    addItem: '+ Add item', addWish: '+ Add a place', add: 'Add', type: 'Type', title: 'Title', date: 'Date', time: 'Local time', tz: 'Time zone',
    place: 'Place / address', note: 'Notes', del: 'Delete', delItemQ: 'Delete this item?',
    flightNo: 'Flight no.', terminal: 'Terminal', gate: 'Gate', conf: 'Confirmation no.', company: 'Company', phone: 'Contact (phone)', troubleMemo: 'My notes for trouble', trouble: '⚠ If something goes wrong', keep: '🔒 Keep visible', unkeep: '🔓 Back to auto-hide', showAgain: '↺ Show in itinerary', keepHint: 'Stops this from auto-hiding at its arrival time, in case plans change.', troubleTitle: 'If something goes wrong', affected: 'Plans that may be affected if this is delayed or changed', noAffected: 'No related plans found.', noPhone: 'No contact saved', call: 'Call', memoLabel: 'Notes', addContactHint: 'Add a contact phone in Details and it will show up here.',
    wishTitle: 'Places to visit', wishHint: 'Items without a date. Set a date in "Details" to move them into the itinerary.', empty: 'Nothing yet.',
    mapTitle: 'Map', mapEmpty: 'No items have a place yet.', membersTitle: 'Members', membersHint: 'Who is traveling with you (saved on this device only for now).',
    sampleNoMembers: 'The sample has no members.', name: 'Name', placeholderTitle: 'e.g. Haneda → Naha', placeholderTrip: 'e.g. Okinawa beach getaway', placeholderPlace: 'e.g. Naha Airport Terminal 1',
  },
}
export const tr = (lang) => STR[lang] || STR.ja

const DOW = { ja: ['日', '月', '火', '水', '木', '金', '土'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] }
export const fmtDate = (s, lang) => {
  if (!s) return ''
  const [y, m, d] = s.split('-').map(Number)
  const w = DOW[lang][new Date(y, m - 1, d).getDay()]
  return lang === 'ja' ? `${m}月${d}日(${w})` : `${w}, ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]} ${d}`
}
export const fmtRange = (a, b) => `${(a || '').replaceAll('-', '.')} — ${(b || '').replaceAll('-', '.')}`

// 予定の現地時刻を UTC の ms に変換(タイムゾーン対応)
export const itemMs = (item) => msAt(item.date, item.time, item.tz)

// 到着時刻(飛行機・電車)。未入力なら null
export const arrivalMs = (item) => (AUTO_TYPES.includes(item.type) && item.arrTime ? msAt(item.arrDate || item.date, item.arrTime, item.arrTz || item.tz) : null)

// 「終わった予定」か: ✓済み、または到着時刻を過ぎた飛行機・電車
export const isFinished = (item, now) => {
  if (item.done) return true
  if (item.keep) return false
  const a = arrivalMs(item)
  return a != null && a <= now
}

function msAt(date, time, tzName) {
  if (!date) return null
  const t = time || '23:59'
  const tz = tzName || 'Asia/Tokyo'
  const guess = new Date(`${date}T${t}:00Z`).getTime()
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date(guess))
  const g = Object.fromEntries(parts.map((p) => [p.type, p.value]))
  return guess - (Date.UTC(+g.year, +g.month - 1, +g.day, +g.hour, +g.minute) - guess)
}

export const sampleTrip = (lang) => {
  const ja = lang === 'ja'
  const it = (o) => ({ id: uid(), done: false, tz: 'Asia/Tokyo', ...o })
  return {
    id: 'sample', sample: true,
    name: ja ? '沖縄、海辺の休日' : 'Okinawa beach getaway', destination: ja ? '沖縄' : 'Okinawa',
    start: '2026-10-10', end: '2026-10-13', members: [],
    items: [
      it({ type: 'flight', title: ja ? '羽田空港 → 那覇空港' : 'Haneda → Naha', date: '2026-10-10', time: '09:30', place: ja ? '羽田空港 第2ターミナル' : 'Haneda Airport Terminal 2', flightNo: 'ANA 12', terminal: ja ? '第2ターミナル' : 'Terminal 2', gate: '58', conf: 'ABC123', arrDate: '2026-10-10', arrTime: '12:15' }),
      it({ type: 'car', title: ja ? 'レンタカー受取' : 'Pick up rental car', date: '2026-10-10', time: '13:00', place: ja ? '那覇空港' : 'Naha Airport', company: 'Toyota Rent a Car', conf: 'R-4821' }),
      it({ type: 'hotel', title: ja ? '海辺のホテル チェックイン' : 'Seaside Hotel check-in', date: '2026-10-10', time: '15:00', place: ja ? '沖縄県恩納村' : 'Onna, Okinawa', conf: 'H-99120' }),
      it({ type: 'hotel', title: ja ? '海辺のホテル チェックアウト' : 'Seaside Hotel check-out', date: '2026-10-13', time: '10:00', place: ja ? '沖縄県恩納村' : 'Onna, Okinawa', conf: 'H-99120' }),
      it({ type: 'car', title: ja ? 'レンタカー返却' : 'Return rental car', date: '2026-10-13', time: '15:00', place: ja ? '那覇空港' : 'Naha Airport', company: 'Toyota Rent a Car', conf: 'R-4821' }),
      it({ type: 'flight', title: ja ? '那覇空港 → 羽田空港' : 'Naha → Haneda', date: '2026-10-13', time: '17:30', place: ja ? '那覇空港' : 'Naha Airport', flightNo: 'ANA 13', terminal: ja ? '国内線ターミナル' : 'Domestic Terminal', gate: '', conf: 'ABC123', arrDate: '2026-10-13', arrTime: '20:00' }),
      it({ type: 'sight', title: ja ? '沖縄美ら海水族館' : 'Churaumi Aquarium', date: '', time: '', place: ja ? '沖縄美ら海水族館' : 'Okinawa Churaumi Aquarium' }),
    ],
  }
}

// トラブル時の一般的な案内(種類別)。あくまで一般論で、詳細は各社の案内に従うこと。
export const GUIDES = {
  ja: {
    flight: ['遅延・欠航は、まず航空会社のアプリやサイトで最新の状況を確認しましょう。', '振替や払い戻しは航空会社に連絡します。予約番号を手元に用意しておくとスムーズです。', '到着が遅れそうなら、下の予定(レンタカー・ホテルなど)にも早めに一報を入れておきましょう。'],
    train: ['運行情報を確認し、振替輸送や払い戻しの案内に従いましょう。', '到着が遅れそうなら、下の予定にも一報を入れておきましょう。'],
    car: ['受取・返却が遅れそうなときは、営業所へ電話で新しい時間を伝えましょう。', '営業所の営業時間外になる場合は、受取・返却の方法を必ず確認してください。'],
    hotel: ['チェックインが遅れそうなときは、ホテルへ連絡して到着予定を伝えましょう。', '連絡がないと予約が取り消されることがあります。'],
    other: ['予約先へ早めに連絡し、時間変更や取り消しの可否を確認しましょう。'],
  },
  en: {
    flight: ['For delays or cancellations, check the airline app or website for the latest status first.', 'Contact the airline about rebooking or refunds. Keep your confirmation number handy.', 'If you will arrive late, let the plans listed below (rental car, hotel, etc.) know early.'],
    train: ['Check service updates and follow the operator\'s guidance on alternative transport or refunds.', 'If you will arrive late, let the plans listed below know.'],
    car: ['If you will be late for pickup or return, call the branch and give them your new time.', 'If it falls outside opening hours, confirm how pickup or return works.'],
    hotel: ['If you will check in late, contact the hotel and tell them your expected arrival.', 'Without notice, some hotels may cancel the booking.'],
    other: ['Contact the provider early and ask whether the time can be changed or cancelled.'],
  },
}
export const guideFor = (type, lang) => GUIDES[lang][type] || GUIDES[lang].other

// この予定が遅れたときに影響しそうな「あとの予定」(飛行機・電車以外で、これより後・未完了)
export const affectedItems = (item, all, now) => {
  const base = itemMs(item)
  if (base == null) return []
  return all
    .filter((o) => o.id !== item.id && o.date && !isFinished(o, now) && (itemMs(o) ?? 0) >= base && ['car', 'hotel', 'meal', 'train', 'flight', 'other'].includes(o.type))
    .sort((a, b) => itemMs(a) - itemMs(b))
    .slice(0, 4)
}