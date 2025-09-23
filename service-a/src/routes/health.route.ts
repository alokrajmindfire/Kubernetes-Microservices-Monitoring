import { Router } from 'express'
import { getHealth, getRoot } from '../controllers/health.controller'

const router = Router()

router.route('/').get(getRoot)

router.route('/api/health').get(getHealth)

export default router
