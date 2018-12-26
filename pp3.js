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

var lp1	 = 57.00;

var flag;
 

client.on('connect', function send (e) {
	
    console.log('connected!');

	level = (lp1 - 1);

	var data = {"mode":"async","messageType":"e5ea0acdec831c5f0d3a","messages":[{"timestamp":1413191650,"name":'P3',"level":level}]};

	client.publish('iot/data/'+my_device_id, JSON.stringify(data));
	
    console.log(JSON.stringify(data));

	lp1 = level;

	console.log(lp1);

	if(lp1 <= 50 && flag != 'X'){
		so();
	}
	
	setTimeout(send,2000);
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
    url: 'https://192.168.139.61/sap/opu/odata/sap/ZTEST_NEW_SRV/TRIGGERSet?$format=json',
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
	var token = response.headers["x-csrf-token"];
	console.log(token);
	var data = {};
	data.SENSOR = 'P3';
	data.WEIGHT =  lp1;
	data.TIMESTAMP = '2018-12-26T15:26:00';//Date.now();l
                    Request({
                                    url:'https://192.168.139.61/sap/opu/odata/sap/ZTEST_NEW_SRV/TRIGGERSet',
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
//                                  resolve();
                            });	
});	
};