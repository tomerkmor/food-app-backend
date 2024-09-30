import express from 'express'

const router = express.Router();

import {
    getDate,
    defaultDate,
} from '../controllers/dates.js'


router.route('/:timestamp').get(getDate)
router.route('/').get(defaultDate)

export default router;




