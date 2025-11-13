const express = require('express');
const { addItem, removeItem, getItems, markItem } = require('../controllers/itemController');
const itemRoute = express.Router()

itemRoute.post('/add', addItem);
itemRoute.post('/remove', removeItem);
itemRoute.post('/get', getItems);
itemRoute.post('/done', markItem)

module.exports = itemRoute;