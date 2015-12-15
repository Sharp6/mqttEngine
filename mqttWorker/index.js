module.exports = function() {
	var mqtt    = require('mqtt');
	var request = require('request');
	var client  = mqtt.connect('mqtt://192.168.1.124');

	var services = [ {
		name: 'runMonitor',
		url: 'http://localhost:8080/colorTimeSinceLastRun',
		feed: 'runmonitor'
	}, {
		name: 'getHomeDry',
		url: 'http://localhost:3000/intensity/color',
		feed: 'gethomedry'
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