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
	  console.log("%s",PhoneNumber);
	  if(PhoneNumber.length>10)
	  {
		  var message='please share your email';
		    res.status(200).json({
           source: 'webhook',
           speech: message,
           displayText: message,
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
