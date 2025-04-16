export type PostEntity = {
  author: {
    handle: string,
    displayName: string,
    avatar: string
  }
  uri: string,
  text: string,
  createdAt: string
}