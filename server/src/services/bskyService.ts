import axios from 'axios'
import type { ParsedQs } from 'qs'
import { PostEntity } from '../entities/postEntity'

const API_URL = 'https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts'

async function fetchRecentPosts(q?: string | ParsedQs | (string | ParsedQs)[]): Promise<PostEntity[]> {
  try {
    const response = await axios.get(API_URL, {
      params: { q, lang: 'fr' }
    })

    return response.data.posts.map((post: any) => ({
      author: {
        handle: post.author?.handle,
        displayName: post.author?.displayName,
        avatar: post.author?.avatar
      },
      uri: post.uri,
      text: post.record?.text,
      createdAt: post.record?.createdAt
    }))
  } catch (error: any) {
    console.log('Erreur dans la requête API BlueSky : ', error)
    throw {
      status: error.status,
      message: error.response.data.message
    }
  }
}

export {
  fetchRecentPosts
}