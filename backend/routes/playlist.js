const express = require('express');
const router = express.Router();
const { getPlaylistStats } = require('../controllers/playlistController');

router.get('/stats', getPlaylistStats);

module.exports = router;
