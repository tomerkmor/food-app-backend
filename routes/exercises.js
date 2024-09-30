import express from 'express'

const router = express.Router();

import {
    addActivity,
    getLogs
} from '../controllers/exercises.js'



router.route('/').post(addActivity)
router.route('/:username/logs').get(getLogs)

export default router;




