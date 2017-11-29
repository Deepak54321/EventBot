const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

const REQUIRE_AUTH = true
const AUTH_TOKEN = 'an-example-token'

app.get('/', function (req, res) {
  res.send('Use the /webhook endpoint.')
})
app.get('/webhook', function (req, res) {
  res.send('You must POST your request')
})

app.post('/webhook', function (req, res) {
  // we expect to receive JSON data from api.ai here.
  // the payload is stored on req.body
  console.log(req.body)

  // we have a simple authentication
 /* if (REQUIRE_AUTH) {
    if (req.headers['auth-token'] !== AUTH_TOKEN) {
      return res.status(401).send('Unauthorized')
    }
  }*/

  // and some validation too
  /*if (!req.body || !req.body.result || !req.body.result.parameters) {
    return res.status(400).send('Bad Request')
  }*/

  // the value of Action from api.ai is stored in req.body.result.action
  console.log('* Received action -- %s', req.body.result.action)

  // parameters are stored in req.body.result.parameters
  //var userName = req.body.result.parameters['given-name']
   //var context=req.body.result.contexts[0];
  if(req.body.result.action=='demo')
  {
   var request = require('request');
            request({
                url:'http://www.yamaha-motor-india.com/iym-web-api//51DCDFC2A2BC9/statewiseprice/getprice?product_profile_id=salutorxspcol&state_id=240'
            },function (error,response,body) {
                if (!error && response.statusCode == 200) {
                    var result = JSON.parse(body);
                    var responseCode=result.responseData;
                    var productPrice=responseCode.product_price;
                    var price=productPrice[0].price +'Rs';
           res.status(200).json({
           source: 'webhook',
           speech: price,
           displayText: price,
		    'messages': 
              [{
                   'type':0,
                   'speech':price
               },
                  {'title': 'Please provide your feedback',
                'replies': ['Feedback'],
                'type': 2}],
            })
                }
                else {
                    console(log.error());
                }
            });
   
 
  }
if(req.body.result.action=='demo1')
  {
    
     var pincode=110005;
            var check='';
            var StateId='';
            var CityId='';
            var City='';
            var State='';
            var Country='';
            var lat='';
            var lng='';
            var State_Name='';
            var City_Name='';
            var address='';
            var stateF='';
            var dealerId='';
            var address_components='';
            var message='';

            var request = require('request');
            //1
            request({
                url:'https://maps.googleapis.com/maps/api/geocode/json?address='+pincode+'&key=AIzaSyD_YqB4d_-xKcmNP9jJCiPkJYDS8J3f6pI'
            },function (error,response,body) {
                if (!error && response.statusCode == 200) {
                    var result = JSON.parse(body);
                    var Results = result.results;
                    for (var i = 0; i < Results.length; i++)
                    {
                        address = Results[i].formatted_address;
                        address_components = Results[i].address_components;
                        var len = address_components.length;
                        var gemotry = Results[i].geometry;
                        var location = gemotry.location;
                        lat = location.lat;
                        lng = location.lng;
                        for (var j = 0; j < address_components.length; j++) {
                            if (j == len - 3) {
                                City = address_components[j].long_name;
                            }
                            else if (j == len - 2) {
                                State = address_components[j].long_name;
                            }
                            else if (j == len - 1) {
                                Country = address_components[j].long_name;
                            }
                        }
                    }
                    console.log("State %s",State);
                    console.log("City %s",City);
                    console.log("Country %s",Country);
                   
                    var view = State + City + Country + 'Hi now you can get your dealers' + lat + lng;
                    //2
                    request({
                        url: 'http://www.yamaha-motor-india.com/iym-web-api//51DCDFC2A2BC9/network/state'
                    }, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var res = JSON.parse(body);
                            var responseData = res.responseData;
                            var states = responseData.states;

                            for (var i = 0; i < states.length; i++) {
                                if (states[i].state_name === State) {
                                    StateId = states[i].profile_id;
                                    State_Name = states[i].state_name;

                                }

                            }
                            var reply2 = [
                                {
                                    "content_type": "text",
                                    "title": "Restart",
                                    "payload": "Restart"
                                }
                            ];
                            console.log("State Id %s",StateId);
                            if(StateId=='') {
                                sendQuickReply(sender,"No dealers Found in your area Please restart your conversation", reply2);
                            }

                            //sendTextMessage(sender,StateId);
                            //3
                            request({
                                url: 'http://www.yamaha-motor-india.com/iym-web-api//51DCDFC2A2BC9/network/city?profile_id=' + StateId
                            }, function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    var result = JSON.parse(body);
                                    var responsData = result.responseData;
                                    var citites = responsData.cities;
                                    for (var i = 0; i < citites.length; i++) {

                                        if (citites[i].city_name == City) {
                                            CityId = citites[i].city_profile_id;
                                        }
                                    }
                                    console.log("City Id %s",CityId);
                                    var reply3 = [
                                        {
                                            "content_type": "text",
                                            "title": "Restart",
                                            "payload": "Restart"
                                        }
                                    ];
                                    if(CityId=='') {
                                        //sendQuickReply(sender,"No dealers Found in your area Please restart your conversation", reply3);
                                    }
								
                                  
                                    request({
                                        url: 'http://www.yamaha-motor-india.com/iym-web-api//51DCDFC2A2BC9/network/search?type=sales&profile_id=' + StateId + '&city_profile_id=' + CityId
                                    }, function (error, response, body) {
                                        if (!error && response.statusCode == 200) {
                                            var result = JSON.parse(body);
                                            var resData = result.responseData;
                                            var dealers = resData.dealers;
                                            dealerId=dealers[0].dealer_name;
                                            var dealer_name = dealers[0].dealer_name;
                                            var dealer_add = dealers[0].dealer_address;
                                            var dealer_Mob = dealers[0].sales_manager_mobile;
                                            message = dealer_name + dealer_add + dealer_Mob;
                                           // text1="Helloa";
                                            console.log("Dealer information %s",message);
                                            if(message!='') {
                                            check=true;
                                            }
											else{
												check=false;
											}
											)
                                    }
									else
									{
										
									}
                                           
                                            //sendTextMessage(sender,text1);
                                        }
                                        else {
                                            console(log.error());
                                        }
                                    });
                                   

                                }
                                else {
                                    console(log.error());
                                }
                            });
                        }
                        else {
                            console(log.error());
                        }
                    });

                }
                else {
                    console(log.error());

                }

            });
			//
			if(check==true)
			{
				res.status(200).json({
                                                source: 'webhook',
                                                speech: message,
                                                displayText: message,
                                                'messages':
                                                [{
                                                    'type': 0,
                                                    'speech': message
                                                },
                                                {
                                                    'title': 'Please provide your feedback',
                                                    'replies': ['Feedback'],
                                                    'type': 2
                                                }],
			}
  }
  
})

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})
