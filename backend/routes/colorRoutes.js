const express = require('express');
const router = express.Router();
const colorController = require('../controller/colorController');

router.post('/place-bet', colorController.placeBet);  // Place a bet
router.put('/process-result/:roundId', colorController.processResult); // Process result
router.get('/history', colorController.getHistory);  // Get game history
// router.get('/wallet-balance', colorController.fetchWalletBalance);  // Get game history
router.delete('/reset-game', colorController.resetAll);  // Get game history

module.exports = router;
