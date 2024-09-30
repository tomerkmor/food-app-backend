import express from 'express'

const router = express.Router();

import {
    getUserInfo
} from '../controllers/whoami.js'


router.route('/').get(getUserInfo)

export default router;




