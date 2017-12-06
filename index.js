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
  console.log('* Received action -- %s', req.body.result.action)
  
 
  if(req.body.result.action=='Priceapi')
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
	
	if(req.body.result.action=='phone')
  {
	   var result=req.body.result;
			var context=result.contexts[0];
			var PhoneNumber=context.parameters.phonenumber;
	  console.log("%s",PhoneNumber);
	  if(PhoneNumber.length>10)
	  {
		  var message='please share your email';
		    res.status(200).json({
           					source: 'webhook',
          					speech: 'please share your email',
           					displayText: 'please share your email',
		    				"followupEvent":{
						"name":"re_phone",
							"data":
							{
								"phonenumber":PhoneNumber
							}
						}
	    
            					})
	  }
	  else
	  {
		   res.status(200).json({
           					source: 'webhook',
          					speech: 'Invalid phone Number Please enter again',
           					displayText: 'Invalid phone Number Please enter again',
		    				"followupEvent":{
						"name":"re_phone",
							"data":
							{
								"phonenumber":""
							}
						}
	    
            					})
	  }
  
  }
	
	if(req.body.result.action=='hotel')
  {
	  var adult=7;
   res.status(200).json({
           				source: 'webhook',
          					speech: 'message',
           					displayText: 'message',
		    				"followupEvent":{
						"name":"re_ask",
							"data":
							{
								//"check_in":"",
								//"check_out":"",
								"adults":adult
							}
						}
	      /* "speech": "The value was invalid so I changed it to its default. What is your value for MyField2?",
            "displayText": "The value was invalid so I changed it to its default. What is your value for MyField2?",
            "contextOut": [
                {
                    //"name": "dc324995-cd5d-48b2-a74d-d2fca6fa0cc3_id_dialog_context",
			"name":"HotelBooking",
                    "parameters": {
                         "check_in":"",
			 "check_out":"",
			  "adults":"3"
                    },
                    "lifespan": 2
                }
            ]*/
            					})
  }
if(req.body.result.action=='Dealerapi')
  {
	        var result=req.body.result;
			var context=result.contexts[0];
			var dealerpin=context.parameters.pincode;
			console.log("user pincode to find dealer %s",dealerpin);
			var test = 'heelo';
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
                url:'https://maps.googleapis.com/maps/api/geocode/json?address='+dealerpin+'&key=AIzaSyD_YqB4d_-xKcmNP9jJCiPkJYDS8J3f6pI'
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
                            if(StateId!='') {
                                //call();
								//sendQuickReply(sender,"No dealers Found in your area Please restart your conversation", reply2);
                            

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
                                    if(CityId!='') {
                                        //sendQuickReply(sender,"No dealers Found in your area Please restart your conversation", reply3);
                                    

                                  
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
                                            var text1 = dealer_name + dealer_add + dealer_Mob;
											message=text1;
											test= message;
                                            //text1="Helloa";
                                            console.log("Dealer information %s",message);
											console.log("batman begins");
                                            if(message!='') {
												  var text2=true;
											
											callback();
											//console.log("Dealer information inside %s",check);
											}
											else
											{
												call();
												
											//console.log("Dealer information inside1 %s",check);
											}
                                     
                                    //}
                                           
                                            //sendTextMessage(sender,text1);
                                        }
                                        else {
                                            console(log.error());
                                        }
										
                                    });
									//dealer api call ends here
								}
								else
								{
									call();
								}
                                   

                                }
                                else {
                                    console(log.error());
                                }
                            });
							//city api end here
						}
						else
						{
							call();
						}
							
                        }
                        else {
                            console(log.error());
                        }
                    });
					
					function callback(){
						 res.status(200).json({
           					source: 'webhook',
          					speech: message,
           					displayText: message,
		    				'messages': 
              					[{
                   					'type':0,
                   					'speech':message
               					},
                  				{'title': 'Please provide your feedback',
                				'replies': ['Feedback'],
                				'type': 2}],
            					})
					}
					function call()
					{
						var mes='Dealer not found in your area';
							 res.status(200).json({
           					source: 'webhook',
          					speech: mes,
           					displayText: mes,
		    				'messages': 
              					[{
                   					'type':0,
                   					'speech':mes
               					},
                  				{'title': 'Please provide your feedback',
                				'replies': ['Feedback'],
                				'type': 2}],
            					})
					}
                }
                else {
                    console(log.error());

                }
//now insert here

            });
			
  }
  //testdrive
  if(req.body.result.action=='testDealerapi')
  {
	        var result=req.body.result;
			var context=result.contexts[0];
			var dealerpin=context.parameters.TestPincode;
			console.log("user pincode to find dealer %s",dealerpin);
			var test = 'heelo';
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
                url:'https://maps.googleapis.com/maps/api/geocode/json?address='+dealerpin+'&key=AIzaSyD_YqB4d_-xKcmNP9jJCiPkJYDS8J3f6pI'
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
                            if(StateId!='') {
                                //call();
								//sendQuickReply(sender,"No dealers Found in your area Please restart your conversation", reply2);
                            

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
                                    if(CityId!='') {
                                        //sendQuickReply(sender,"No dealers Found in your area Please restart your conversation", reply3);
                                    

                                  
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
                                            var text1 = dealer_name + dealer_add + dealer_Mob;
											message=text1;
											test= message;
                                            //text1="Helloa";
                                            console.log("Dealer information %s",message);
											console.log("batman begins");
                                            if(message!='') {
												  var text2=true;
											
											callback();
											//console.log("Dealer information inside %s",check);
											}
											else
											{
												call();
												
											//console.log("Dealer information inside1 %s",check);
											}
                                     
                                    //}
                                           
                                            //sendTextMessage(sender,text1);
                                        }
                                        else {
                                            console(log.error());
                                        }
										
                                    });
									//dealer api call ends here
								}
								else
								{
									call();
								}
                                   

                                }
                                else {
                                    console(log.error());
                                }
                            });
							//city api end here
						}
						else
						{
							call();
						}
							
                        }
                        else {
                            console(log.error());
                        }
                    });
					
					function callback(){
						 res.status(200).json({
           					source: 'webhook',
          					speech: message,
           					displayText: message,
		    				'messages': 
              					[{
                   					'type':0,
                   					'speech':message
               					},
                  				{'title': 'Please provide your feedback',
                				'replies': ['Feedback'],
                				'type': 2}],
            					})
					}
					function call()
					{
						var mes='Dealer not found in your area';
							 res.status(200).json({
           					source: 'webhook',
          					speech: mes,
           					displayText: mes,
		    				'messages': 
              					[{
                   					'type':0,
                   					'speech':mes
               					},
                  				{'title': 'Please provide your feedback',
                				'replies': ['Feedback'],
                				'type': 2}],
            					})
					}
                }
                else {
                    console(log.error());

                }
//now insert here

            });
			//replies insert here
			
			
  }
  if(req.body.result.action=='feedback')
  {
	  res.status(200).json({
           					source: 'webhook',
          					speech: '',
           					displayText: '',
							'messages': 
							[
                  				{'title': 'Please provide your feedback',
                				'replies': ['Excellent',
                            'Good',
                            'Average',
                            'Bad'],
                				'type': 2}
								
								],
            					})
		    			
            					
  }
  
})

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})
