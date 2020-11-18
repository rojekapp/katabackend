var express = require('express');
var router = express.Router();
const connection = require('../helpers/connection');
const query = require('../helpers/query');
const dbAdmin = require('../dbAdmin');
const dbHost = require('../db');
const {auth} = require('../middleware')
const jwt = require('jsonwebtoken')
var mysql = require('mysql');
const dotenv = require("dotenv")
var fs = require('fs-extra');
var axios = require('axios');
var qs = require('qs')
dotenv.config();
/* GET home page. */

  router.post('/invoice', async (req,res)=>{
    var text = req.body.text;
    var data = JSON.stringify({"text":text});

var config = {
  method: 'post',
  url: 'https://geist.kata.ai/nlus/mochammadrozaq:ezpad/predict',
  headers: { 
    'Authorization': 'Bearer c623293a-4109-4969-8dbb-c2e87dec12da', 
    'Content-Type': 'application/json'
  },
  data : data
};

await axios(config)
.then(function (response) {
  value = response.data.result;
  console.log(value)
  kata = value.kata;
  eztap = value.eztap;
  sentiment = value.sentiment;
  pep = {}
  var currency = "tidak"
  var stats = ""
  for(var i=0;i<kata.length;i++){
    if(kata[i].label == "PERSON"){
      pep.nama = kata[i].value
    }else if(kata[i].label == "LOCATION"){
      pep.lokasi = kata[i].value
    }else if(kata[i].label == "PHONE"){
      pep.phone = kata[i].value
    }else if(kata[i].label == "CURRENCY"){
      pep.harga = kata[i].value
      currency = "ada"
      stats = "currency"
    }else if(kata[i].label == "NUMBER" && currency=="tidak"){
      pep.harga = kata[i].value
      stats = "number"
    }

  }
  pep.harga = convert(pep.harga,stats)
  res.send(pep)
})
.catch(function (error) {
 res.send(error);
});
  })
  function rupiah(rupiah)
{
	return parseInt(rupiah.replace(/[^0-9]/g, ''), 10);
} function number(rupiah)
{
	return parseInt(rupiah.replace('.', ''), 10);
}

  function convert(beb,stats){
    if(stats == "currency"){
      return rupiah(beb)
    }else{
      return number(beb)
    }
  }
  router.post('/ongkir', async (req,res)=>{
        
    var data = qs.stringify({
      'origin': '419',
     'originType': 'city',
     'destination': '574',
     'destinationType': 'subdistrict',
     'weight': '1700',
     'courier': 'jne' 
     });
     var config = {
       method: 'post',
       url: 'https://pro.rajaongkir.com/api/cost',
       headers: { 
         'key': '16f58d780c7430a55ddd94c3a5378ddb', 
         'Authorization': 'Bearer c623293a-4109-4969-8dbb-c2e87dec12da', 
         'Content-Type': 'application/x-www-form-urlencoded'
       },
       data : data
     };
     
     axios(config)
     .then(function (response) {
       res.json(response.data);
     })
     .catch(function (error) {
       console.log(error);
     });
     
  });
  
router.post('/sentiment', async (req,res)=>{
  var text = req.body.text;
  var data = JSON.stringify({"text":text});

var config = {
method: 'post',
url: 'https://geist.kata.ai/nlus/mochammadrozaq:ezpad/predict',
headers: { 
  'Authorization': 'Bearer c623293a-4109-4969-8dbb-c2e87dec12da', 
  'Content-Type': 'application/json'
},
data : data
};

await axios(config)
.then(function (response) {
value = response.data.result;
res.json(value.sentiment)
})
.catch(function (error) {
res.send(error);
});
})
module.exports = router;
