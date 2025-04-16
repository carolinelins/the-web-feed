import { Request, Response } from 'express'
import { fetchRecentPosts } from '../services/bskyService'

async function getRecentPosts(req: Request, res: Response) {
  try {
    const { q } = req.query

    const posts = await fetchRecentPosts(q)
    res.json(posts)
  } catch (error: any) {
    res.status(error.status).json(error)
  }
}

export {
  getRecentPosts
}