const express = require('express');
const router = express.Router();
const { getWidgets, createWidget, deleteWidget } = require('../controllers/widgetController');

router.get('/', getWidgets);
router.post('/', createWidget);
router.delete('/:id', deleteWidget);

module.exports = router;