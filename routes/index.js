var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');

var gtm = {};
gtm.ip="192.168.142.15";
gtm.username="admin";
gtm.password="admin";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ASM Portal' });
});
router.get('/index.html', function(req, res, next) {
  res.render('index', { title: 'ASM Portal' });
});

//routing for api requests

router.get("/redirecttosilverline", function(req, res, next){
  var jsonpayload ={"disabled":true};
    var options = {
      url: "https://"+gtm.username+":"+gtm.password+"@"+gtm.ip+"/mgmt/tm/gtm/server/~Common~GTM_ItSelf/virtual-servers/~Common~VS_PAN_Internet_106",
      method: 'PATCH',
      json: jsonpayload,
      strictSSL : false, //no certificate validation
      rejectUnauthorized : false //no certificate validation
    };
    request(options, function (error, response, body) {
      if (!error  && response.statusCode == 200) {
        return res.json("{OK}");
      } else { return res.json("{KO}");
      }
    });

});

router.get("/redirecttopremise", function(req, res, next){
  var jsonpayload ={"enabled":true};
    var options = {
      url: "https://"+gtm.username+":"+gtm.password+"@"+gtm.ip+"/mgmt/tm/gtm/server/~Common~GTM_ItSelf/virtual-servers/~Common~VS_PAN_Internet_106",
      method: 'PATCH',
      json: jsonpayload,
      strictSSL : false, //no certificate validation
      rejectUnauthorized : false //no certificate validation
    };
    request(options, function (error, response, body) {
      if (!error  && response.statusCode == 200) {
        return res.json("{OK}");

      } else { return res.json("{KO}");

      }
    });

});



router.get("/getserverstatus", function(req, res, next){

    var options = {
      url: "https://"+gtm.username+":"+gtm.password+"@"+gtm.ip+"/mgmt/tm/gtm/server/~Common~GTM_ItSelf/virtual-servers/~Common~VS_PAN_Internet_106",
      method: 'GET',
      strictSSL : false, //no certificate validation
      rejectUnauthorized : false //no certificate validation
    };
    request(options, function (error, response, body) {
      if (!error  && response.statusCode == 200 ) {

        if (JSON.parse(response.body).disabled) {
          //response content disabled:true
          console.log("getserverstatus {KO}");
          return res.json("{KO}");
        } else {
          console.log("getserverstatus {OK}");
          return res.json("{OK}");
        }

      } else {
       console.log("getserverstatus {KO}");
        return res.json("{KO}");

      }
    });
});

router.get("/ping", function(req, res, next){

    var options = {
      url: "https://"+gtm.username+":"+gtm.password+"@"+gtm.ip+"/mgmt/tm/gtm",
      method: 'GET',
      strictSSL : false, //no certificate validation
      rejectUnauthorized : false //no certificate validation
    };
    request(options, function (error, response, body) {
      if (!error  && response.statusCode == 200) {
        console.log("ping {OK}");
        return res.json("{OK}");
      } else {
       console.log("ping {KO}");
        return res.json("{KO}");

      }
    });
});






module.exports = router;
