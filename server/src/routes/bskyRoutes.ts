import { Router } from 'express'
import { getRecentPosts } from '../controllers/bskyController'

const router = Router()

router.get('/posts', getRecentPosts)

export default router