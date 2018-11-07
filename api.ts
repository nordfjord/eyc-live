const ROOT = "https://api.xbowling.com"
const SCORE_TIMEOUT_MINUTES = 90
const VENUE_ID = 13904

function formatDate(d: Date) {
  const year = d.getUTCFullYear(),
    month = d.getUTCMonth() + 1,
    date = d.getUTCDate(),
    hours = d.getUTCHours(),
    minutes = d.getUTCMinutes(),
    seconds = d.getUTCSeconds()

  return `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`
}

function createUrl(laneNumber: number) {
  var endDate = formatDate(new Date())
  var startDate = formatDate(
    new Date(+new Date() - SCORE_TIMEOUT_MINUTES * 6e4),
  )

  return `${ROOT}/venue/${VENUE_ID}/lane/${laneNumber}?from=${encodeURIComponent(
    startDate,
  )}&to=${encodeURIComponent(endDate)}`
}

function getLane(laneNumber: number): Promise<Game[]> {
  return fetch(createUrl(laneNumber))
    .then(res => res.json())
    .then((laneData: XbolwingAPIResponse[]) =>
      laneData.map(transformXBowlingResultToGame),
    )
}

const pad = (n: number) => {
  if (n < 10) return "0" + n
  return "" + n
}

const getSquareNumbers = (idx: number) => {
  const squareNumbers = [idx * 2 + 1, idx * 2 + 2]
  if (idx === 9) squareNumbers.push(21)

  return squareNumbers
}

export const range10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const sanitizeName = (name: string) =>
  decodeURIComponent(name).replace(/\+/g, " ")

const transformXBowlingResultToGame = (player: XbolwingAPIResponse) => {
  const name = sanitizeName(player.name)
  const frames = range10.map(n => {
    const squareNumbers = getSquareNumbers(n - 1)
    const squares = squareNumbers.map(
      (n): Square => ({
        score: (player as any)[`squareScore${n}`] as string,
        isSplit: player.splitsOrderedBySquareNumber[n - 1],
        standingPins: (player as any)[`standingPins${pad(n)}`] as number,
      }),
    )
    const score = (player as any)[`frameScore${n}`]

    return {
      id: n,
      score,
      squares,
    }
  })

  return { name, frames }
}

export interface Game {
  name: string
  frames: Frame[]
}

export interface Frame {
  squares: Square[]
  score: string
  id: number
}

export interface Square {
  score: string
  isSplit: boolean
  standingPins: number
}

interface XbolwingAPIResponse {
  partitionKey: string
  rowKey: string
  id: string
  name: string
  bowlingGameId: number
  lane: number
  position: number
  squareScore1: string
  squareScore2: string
  frameScore1: string
  squareScore3: string
  squareScore4: string
  frameScore2: string
  squareScore5: string
  squareScore6: string
  frameScore3: string
  squareScore7: string
  squareScore8: string
  frameScore4: string
  squareScore9: string
  squareScore10: string
  frameScore5: string
  squareScore11: string
  squareScore12: string
  frameScore6: string
  squareScore13: string
  squareScore14: string
  frameScore7: string
  squareScore15: string
  squareScore16: string
  frameScore8: string
  squareScore17: string
  squareScore18: string
  frameScore9: string
  squareScore19: string
  squareScore20: string
  squareScore21: string
  frameScore10: string
  standingPins01: number
  standingPins02: number
  standingPins03: number
  standingPins04: number
  standingPins05: number
  standingPins06: number
  standingPins07: number
  standingPins08: number
  standingPins09: number
  standingPins10: number
  standingPins11: number
  standingPins12: number
  standingPins13: number
  standingPins14: number
  standingPins15: number
  standingPins16: number
  standingPins17: number
  standingPins18: number
  standingPins19: number
  standingPins20: number
  standingPins21: number
  finalScore: number
  handicapScore: number
  latestSquareNumber: number
  isComplet: boolean
  splitsOrderedBySquareNumber: boolean[]
}

export default getLane
