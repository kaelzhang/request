# request

Send ajax or jsonp request to server

## Installation

``` bash
cortex install request --save
```

## Synopsis

``` js
var request = require('request');
var Ajax = request.Ajax;

new Ajax({
    url: http://example.com/data.json',
    method: 'post',
    dataType: 'json'
}).on("success",succ_cb)
.on("cacnel", cancel_cb)
.send(data);

new Ajax({
    url: http://example.com/data.txt',
    dataType: 'text',
    parse: function(data) {
       return data.obj;
    },
    data: {}
}).on("success", succ_cb)
.on("error", err_cb)
.send();


var JSONP = require.JSONP;

new JSONP({
    url: '/blah-blah-blah.jsonp',
    data: {
        uid: 123
    }
}).on("success", succ_cb)
.on("error", err_cb)
.send();
```


## API Documentation

### Ajax

#### Constructor: new Ajax(options)

Create Ajax object.

##### Regular Options

* url `string` request address
* method `string=` The way to send request, can be either 'GET' or 'POST', case-insensitive
* data `object=` The data send in request body

##### Advanced Options

* parser `function(data)=` The method will be called after 'JSON.parse' but before the 'success' event, it will try to transform the data.
* santitizer `function(responseText)=` Handle the original response object, it will return original response by default.
* isXHRSuccess `function(xhr)=` Return a boolean value indicates whether the request succeed or fail. Default it will treat any status code between 200 and 300 as success.
* isSuccess `function(response)` Accept response as arguments and return whether the request succeed or fail. By default it will always return true. Take ajax service in DP for example: most of time, we treat response as success only when `data.code` is 200, but the ajax request actually runs well, so the error callback won't be get called. So we add function like: ```function(res) { return !!res && res.code === 200; }```, the any response whose code is not equal to 200 will be treated as `error`.

##### Other Options

* dataType `string=` Default return dataType, default is ='json'=. It will affect the `Content-Type` in header.
* async `boolean=true` Whether is an async request，Default set to `true`
* timeout `number=` Timeout for the request, in millisecond, when setting to 0, it will never timeout. Default is 0.
* headers `Object=` Custom headers, the final header may be overwritten by other options.
* cache `boolean=false` Set to false by default, which prevents browser to cache the 'GET" Ajax request.

#### Method: ajax.cancel()

Cancel ajax request, will trigger 'cancel' event. Return ajax object itself for chaining.

#### Method: ajax.send([data])

Send the ajax request with or without data. Return ajax object itself for chaining.

#### Event: ajax#success

Triggered when ajax request succeed.

##### callback(response, xhr)

* resposne `object|string` response body.
* xhr `object` XMLHttpRequest Object.

#### Event: ajax#error

Triggered when ajax request failed or timeout.

##### callback(response, xhr)

The same as ajax#success.


#### Event: ajax#cancel

Triggered when ajax request get canceled. =callback= has no argument.



### JSONP

#### Constructor: new JSONP(options)

Create a JOSONP object.


##### options

* url `string`  Address requested
* data `(Object|string)=` Query that send with JSONP，can be querystring or object
* callbackKey `string=` Name of parameter that tells server the callback function name, default is 'callback'
* timeout `number=` Timeout for the request, in millisecond, when setting to 0, it will never timeout. Default is 0.
* cache `boolean=false` Set to false by default, which prevents browser to cache the jsonp request.


#### Method: jsonp.concal()

Cancel jsonp request, will trigger 'cancel' event. Return jsonp object itself for chaining.

#### Method: jsonp.send([data])

Send the jsonp request with or without data. Return jsonp object itself for chaining.

#### Event: jsonp#success

Triggered when jsonp request succeed.

##### callback(response, xhr)

* resposne `object|string` response body.
* xhr `object` XMLHttpRequest Object.

#### Event: jsonp#error

Triggered when jsonprequest failed or timeout.

##### callback(response, xhr)

The same as jsonp#success.


#### Event: jsonp#cancel

Triggered when jsonp request get canceled. =callback= has no argument.
