import axios from 'axios'
import type { ParsedQs } from 'qs'
import { PostEntity } from '../entities/postEntity'
import { buildEmbed, normalizeEmbedType } from '../utils/embedUtils'

const API_URL = 'https://api.bsky.app/xrpc/app.bsky.feed.searchPosts'

async function fetchRecentPosts(q?: string | ParsedQs | (string | ParsedQs)[]): Promise<PostEntity[]> {
  try {
    const response = await axios.get(API_URL, {
      params: { q, lang: 'fr' }
    })

    return response.data.posts.map((post: any) => {
      const embedType = post.embed ? normalizeEmbedType(post.embed['$type']) : ''

      return {
        author: {
          handle: post.author?.handle,
          displayName: post.author?.displayName,
          avatar: post.author?.avatar
        },
        rkey: post.uri?.split('/').pop(),
        text: post.record?.text,
        createdAt: post.record?.createdAt,
        embed: post.embed ? buildEmbed(embedType, post.embed) : {}
      }
    })
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