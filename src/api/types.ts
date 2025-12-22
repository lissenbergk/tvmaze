export type Country = {
  name: string
  code: string
  timezone: string
}

export type Network = {
  id: number
  name: string
  country: Country
  officialSite: string
}

export type Schedule = {
  time: string
  days: string[]
}

export type Rating = {
  average: number | null
}

export type Externals = {
  tvrage: number | null
  thetvdb: number | null
  imdb: string | null
}

export type Image = {
  medium: string
  original: string
}

export type Link = {
  href: string
  name?: string
}

export type Links = {
  self: Link
  previousepisode?: Link
}

export type Show = {
  id: number
  url: string
  name: string
  type: string
  language: string
  genres: string[]
  status: string
  runtime: number | null
  averageRuntime: number | null
  premiered: string | null
  ended: string | null
  officialSite: string | null
  schedule: Schedule
  rating: Rating
  weight: number
  network: Network | null
  webChannel: null
  dvdCountry: null
  externals: Externals
  image: Image | null
  summary: string | null
  updated: number
  _links: Links
}
