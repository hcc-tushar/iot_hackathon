// ========================================================================

// CONFIGURATION

// ========================================================================

var my_account_id='p2000553253';

var my_device_id='8b52bc6c-c8cf-442e-842f-37f4628226cb';

var my_oauth_token='fa1d52ea881c43db1f7afd4749502c';

// ========================================================================

var endpoint = 'wss://iotmmsp2000553253trial.hanatrial.ondemand.com/com.sap.iotservices.mms/v1/api/ws/mqtt';

var options = {

    keepalive: 60,

    username: my_device_id,

    password: my_oauth_token, 

    connectTimeout: 5 * 10000,

    clientId: my_device_id,

    protocolId: 'MQIsdp',

    protocolVersion: 3,

    clean: true,

    will: null,

	port: 443,
	
    host: endpoint
};

console.log(options);

// ========================================================================

var mqtt    = require('mqtt');

var client  = mqtt.connect(endpoint, options);

var lp1	 = 35.00;

var flag;
 

client.on('connect', function send (e) {
	
    console.log('connected!');

	level = (lp1 - 1);
	if(level > 0){
	var data = {"mode":"async","messageType":"e5ea0acdec831c5f0d3a","messages":[{"timestamp":1413191650,"name":'P3',"level":level}]};

	client.publish('iot/data/'+my_device_id, JSON.stringify(data));
	
    console.log(JSON.stringify(data));

	lp1 = level;

	console.log(lp1);

	if(lp1 <= 20 && flag != 'X'){
		so();
	}
	
	setTimeout(send,3000);
	}
	});

client.on('error', function (e) {

    console.log('error!');

});

client.on('offline', function (e) {

  console.log('offline!');
  console.log(e);
});

client.on('close', function (e) {

    console.log('close!');
});

client.on('message', function (topic, message) {

  // message is Buffer

  console.log(message.toString());

  //client.end();

});
function so(){
var https = require('https');
var Request = require("request"),
	username = 'tsharma', password = 'sap@abap12',
	auth = 'Basic ' + new Buffer('tsharma:sap@abap12').toString("base64"),j = Request.jar();
	
var options = {
    url: "https://192.168.139.61/sap/opu/odata/sap/ZSO_IOT_REV_SRV/TriggerSet(SENSOR='PP1')?$format=json",
	jar: j,
	rejectUnauthorized:false,
              headers:{
                "Content-Type":"application/json",
				'accept': 'application/json',
      		    "Authorization":auth,
				"x-csrf-token":"fetch"
              }
	};

Request.get(options, (error, response, body) => {
    if(error) {
		console.log('error');
	} 
	else { 
	if(response.statusCode == 200){
		console.log(response.body);
		var d = JSON.parse(response.body);
		var fw = d.d.SENSOR;
		if(fw == 'Y'){
		var token = response.headers["x-csrf-token"];
	console.log(token);
	var data = {};
	data.SENSOR = 'PP3';
	data.WEIGHT =  lp1;
	data.TOLERANCE = lp1;
	data.TIMESTAMP = ts(); //'2018-12-26T15:24:00';//Date.now();l
                    Request({
                                    url: 'https://192.168.139.61/sap/opu/odata/sap/ZSO_IOT_REV_SRV/TriggerSet',
                                    method: 'POST',
                                    jar: j,
									rejectUnauthorized:false,
									headers:{
                                              "Authorization":auth,
                                              "Content-Type":"application/json",
                                              "X-CSRF-Token":token, // set CSRF Token for post or update
                                    },
                                    json: data
                            }, function(error, response, body){
                                  if(!error) {
								  console.log(response.status);flag = 'X';}
								  else {console.log(error)}
                            });
							
	}
							}}
});
}

function ts(){

	var dt = new Date(),
	current_date = dt.getDate(),
	current_month = dt.getMonth() + 1,
	current_year = dt.getFullYear(),
	current_hrs = dt.getHours(),
	current_mins = dt.getMinutes(),
	current_secs = dt.getSeconds(),
	current_datetime;

// Add 0 before date, month, hrs, mins or secs if they are less than 0
	current_date = current_date < 10 ? '0' + current_date : current_date;
	current_month = current_month < 10 ? '0' + current_month : current_month;
	current_hrs = current_hrs < 10 ? '0' + current_hrs : current_hrs;
	current_mins = current_mins < 10 ? '0' + current_mins : current_mins;
	current_secs = current_secs < 10 ? '0' + current_secs : current_secs;

// Current datetime
// String such as 2016-07-16T19:20:30
	current_datetime = current_year + '-' + current_month + '-' + current_date + 'T' + current_hrs + ':' + current_mins + ':' + current_secs;
	return current_datetime;
};
