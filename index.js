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
	if(req.body.result.action=='phone')
  {
	   var result=req.body.result;
			var context=result.contexts[0];
			var PhoneNumber=context.parameters.phonenumber;
			var pattern = /^\d{10}$/;
	  console.log("%s",PhoneNumber);
	  if(pattern.test(PhoneNumber))
	  {
		  var message='please share your email';
		    res.status(200).json({
           source: 'webhook',
           //speech: message,
           //displayText: message,
		    'messages': 
              [{
                   'type':0,
                   'speech':message
               }]
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
  
  	if(req.body.result.action=='email-val')
  {
	   var result=req.body.result;
			var context=result.contexts[0];
			var Email=context.parameters.email;
			var regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
			 //var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
	  console.log("%s",Email);
	  var EmailCheck= Email.substring(0, Email.indexOf(' com'));
	  EmailCheck=EmailCheck+'.com';
	  var check=regex.test(EmailCheck);
	  console.log(" check status %s",check);
	  if(check)
	  {
		  var message='please share your pincode';
		    res.status(200).json({
           source: 'webhook',
           //speech: message,
           //displayText: message,
		    'messages': 
              [{
                   'type':0,
                   'speech':message
               }]
            })
	  }
	  else
	  {
		   res.status(200).json({
           					source: 'webhook',
          					speech: 'Invalid email Please enter again',
           					displayText: 'Invalid email Please enter again',
		    				"followupEvent":{
						"name":"re_email",
							"data":
							{
								"email":""
							}
						}
	    
            					})
	  }
  
  }
	
	 	if(req.body.result.action=='pin-val')
  {
	   var result=req.body.result;
			var context=result.contexts[0];
			var Pin=context.parameters.pincode;
			var regex = /^([1-9])([0-9]){5}$/;
			 //var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
	  console.log("%s",Pin);
	  if(regex.test(Pin))
	  {
		  var message='please share your chasis Number';
		    res.status(200).json({
           source: 'webhook',
           //speech: message,
           //displayText: message,
		    'messages': 
              [{
                   'type':0,
                   'speech':message
               }]
            })
	  }
	  else
	  {
		   res.status(200).json({
           					source: 'webhook',
          					speech: 'Invalid email Please enter again',
           					displayText: 'Invalid email Please enter again',
		    				"followupEvent":{
						"name":"re_pin",
							"data":
							{
								"pincode":""
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
	     
            					})
  }

  
})

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})
