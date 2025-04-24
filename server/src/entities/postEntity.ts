type AuthorEntity = {
  handle: string
  displayName: string
  avatar: string
}

type ImageEntity = {
  thumb: string
  alt: string
}

type ExternalEntity = {
  thumb: string
  title: string
  description: string
  uri: string
}

type RecordEntity = {
  author: AuthorEntity
  createdAt: string
  text: string
  rkey: string
}

export type EmbedEntity = {
  type: string
  images?: ImageEntity[]
  external?: ExternalEntity
  record?: RecordEntity
}

export type PostEntity = {
  author: AuthorEntity
  rkey: string
  text: string
  createdAt: string
  embed: EmbedEntity
  embedRaw:any
}