module.exports = function() {
	var mqtt    = require('mqtt');
	var request = require('request');
	var client  = mqtt.connect(process.env.MQTT_URL);

	var services = [ {
		name: 'runMonitor',
		url: process.env.RUNMONITOR_HOST + '/colorTimeSinceLastRun',
		feed: process.env.RUNMONITOR_FEED
	}, {
		name: 'getHomeDry',
		url: process.env.GETHOMEDRY_HOST + '/intensity/color',
		feed: process.env.GETHOMEDRY_FEED
	} ];
	 
	client.on('connect', function () {
	  console.log("MQTT client is connected.");
	  client.subscribe("req");
	  console.log("Subscribed to req topic.");
	});
	 
	client.on('message', function (topic, message) {
	  // message is Buffer 
	  console.log(message.toString());
	  if(topic == "req" && message == "all") {
	  	callAllServices();
	  }
	  //client.end();
	});	

	var callService = function(service) {
		console.log("Calling service " + service.name + "." );
		request(service.url, function(err, response, body) {
			if(err) {
				console.log("Error from service " + service.name + ": " + err);
				return;
			} else {
				console.log("Service " + service.name + " answered: " + body + ".");
				client.publish(service.feed, body);
				return;
			}
		});
	};

	var callAllServices = function() {
		services.forEach(function(aService) {
			callService(aService);
		});
	};

	return {
		callAllServices: callAllServices
	}
}