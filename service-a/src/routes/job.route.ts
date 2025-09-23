import { Router } from 'express'
import { getStatus, submitJob } from '../controllers/job.controller'

const router = Router()

router.route('/submit').post(submitJob)

router.route('/status/:id').get(getStatus)

export default router
