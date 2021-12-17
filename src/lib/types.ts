export type PollOption = [string /* option */, number /* votes on this option*/]

export type PollDetail = {
  id: number
  question: string
  options: PollOption[]
  votes: number // total votes on this poll
  open: boolean // true means the poll is currently open
  createdAt: Date
}

export type SortMode = 'latest' | 'popularity'
