"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// In-memory store for transactions
const transactions = [];
// Webhook endpoint
router.post('/webhook/transactions', (req, res) => {
    const { data } = req.body;
    if (!Array.isArray(data) || !Array.isArray(data[0])) {
        res.status(400).json({ error: 'Invalid payload format' });
        return;
    }
    const txs = data[0];
    transactions.push(...txs);
    res.json({ status: 'ok', received: txs.length });
});
// Endpoint to get recent transactions
router.get('/transactions', (req, res) => {
    res.json(transactions.slice(-100)); // Return last 100 transactions
});
exports.default = router;
