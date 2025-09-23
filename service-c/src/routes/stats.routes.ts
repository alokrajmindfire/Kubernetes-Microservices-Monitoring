import { Router } from 'express'
import { getMetrics, getStats } from '../controllers/stats.controller'

const router = Router()

router.route('/stats').get(getStats)
router.route('/metrics').get(getMetrics)

export default router
