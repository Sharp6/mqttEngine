var express = require('express');
var router = express.Router();

var mqttWorker = require('./../mqttWorker')();

/* GET home page. */
router.get('/', function(req, res) {
	mqttWorker.callAllServices();
  res.send('ok');
});

module.exports = router;
