let express = require('express');
let loungeRouter = express.Router();
const loungeController = require('../controllers/loungeController');

loungeRouter.get('/', loungeController.getAllLounges);

module.exports = loungeRouter