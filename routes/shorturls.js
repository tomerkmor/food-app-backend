import express from 'express'

const router = express.Router();

import {
    createUrl,
    getUrl
} from '../controllers/shorturls.js'


router.route('/').post(createUrl)
router.route('/:short_url').get(getUrl)


export default router;




