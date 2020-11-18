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
    var berat = req.body.berat;
    var alamat_asal = req.body.alamat_asal;
    var alamat_tujuan = req.body.alamat_tujuan;
    alamat_asal = encodeURIComponent(alamat_asal.trim())
    alamat_tujuan = encodeURIComponent(alamat_tujuan.trim()) 
    
    
     
     
      
       var config = {
         method: 'post',
         url: 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+alamat_asal+'&inputtype=textquery&fields=name,geometry,place_id,formatted_address&key=AIzaSyChT8WqMfoFxYklBXQOU6q9MtJDbL6QV2U',
         headers: { 
           'key': ''
         }
       };
       
       var id_alamat_asal = await axios(config)
       .then(function (response) {
        
        return response.data.candidates[0].place_id;
       
       })
       .catch(function (error) {
        return error;
       });

       var config2 = {
        method: 'post',
        url: 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+alamat_tujuan+'&inputtype=textquery&fields=name,geometry,place_id,formatted_address&key=AIzaSyChT8WqMfoFxYklBXQOU6q9MtJDbL6QV2U',
        headers: { 
          'key': ''
        }
      };
      
      var id_alamat_tujuan = await axios(config2)
      .then(function (response) {
       
       return response.data.candidates[0].place_id;
      
      })
      .catch(function (error) {
       return error;
      });
      
      var config3 = {
        method: 'post',
        url: 'https://maps.googleapis.com/maps/api/place/details/json?place_id='+id_alamat_asal+'&fields=address_component&key=AIzaSyChT8WqMfoFxYklBXQOU6q9MtJDbL6QV2U',
        headers: { 
          'key': ''
        }
      };
      
      var detail_asal = await axios(config3)
      .then(function (response) {
       
       return response.data;
      
      })
      .catch(function (error) {
       return error;
      });

      var config4 = {
        method: 'post',
        url: 'https://maps.googleapis.com/maps/api/place/details/json?place_id='+id_alamat_tujuan+'&fields=address_component&key=AIzaSyChT8WqMfoFxYklBXQOU6q9MtJDbL6QV2U',
        headers: { 
          'key': ''
        }
      };
      
      var detail_tujuan = await axios(config4)
      .then(function (response) {
       
       return response.data;
      
      })
      .catch(function (error) {
       return error;
      });
      var data = qs.stringify({
        
       });
       var config5 = {
         method: 'get',
         url: 'https://pro.rajaongkir.com/api/city',
         headers: { 
           'key': '16f58d780c7430a55ddd94c3a5378ddb', 
           'Authorization': 'Bearer c623293a-4109-4969-8dbb-c2e87dec12da', 
           'Content-Type': 'application/x-www-form-urlencoded'
         },
         data : data
       };
       
      
      var kota = await axios(config5)
      .then(function (response) {
       
       return response.data;
      
      })
      .catch(function (error) {
       return error;
      });
      var province_asal = detail_asal.result.address_components
      var asal_provinsi;
      var asal_kota;
      var asal_kecamatan;
      var province_tujuan = detail_tujuan.result.address_components
      var tujuan_provinsi;
      var tujuan_kota;
      var tujuan_kecamatan;
      for (var i=0;i<province_asal.length;i++){
        if (province_asal[i].types[0] == "administrative_area_level_1"){
          asal_provinsi = province_asal[i].long_name
        }if (province_asal[i].types[0] == "administrative_area_level_2"){
          asal_kota = province_asal[i].long_name
        }if (province_asal[i].types[0] == "administrative_area_level_3"){
          asal_kecamatan = province_asal[i].long_name
        }
      }
      for (var i=0;i<province_tujuan.length;i++){
        if (province_tujuan[i].types[0] == "administrative_area_level_1"){
          tujuan_provinsi = province_tujuan[i].long_name
        }if (province_tujuan[i].types[0] == "administrative_area_level_2"){
          tujuan_kota = province_tujuan[i].long_name
        }if (province_tujuan[i].types[0] == "administrative_area_level_3"){
          tujuan_kecamatan = province_tujuan[i].long_name
        }
      }

      list_kota = kota['rajaongkir']['results'];
      var id_asal_provinsi;
      var id_tujuan_provinsi;
      var id_asal_kota;
      var id_tujuan_kota;
      var id_asal_kecamatan;
      var id_tujuan_kecamatan;
      var origin_type;
      var destination_type;
      
      for (var i=0;i<list_kota.length;i++){
        kotas = list_kota[i].type +" "+list_kota[i].city_name
        if (kotas == asal_kota){
          id_asal_kota =list_kota[i].city_id 
        }if (kotas == tujuan_kota){
          id_tujuan_kota =list_kota[i].city_id 
        }
      }
    
        var data2 = qs.stringify({
          'origin':id_asal_kota,
          'originType':'city',
          'destination':id_tujuan_kota,
          'destinationType':'city',
          'weight':berat,
          'courier':'jne:pos:tiki:jnt:sicepat'
        });
        var config6 = {
          method: 'post',
          url: 'https://pro.rajaongkir.com/api/cost',
          headers: { 
            'key': '16f58d780c7430a55ddd94c3a5378ddb', 
            'Authorization': 'Bearer c623293a-4109-4969-8dbb-c2e87dec12da', 
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data : data2
        };
        
       
       var hasil = await axios(config6)
       .then(function (response) {
        
        return response.data;
       
       })
       .catch(function (error) {
        return error;
       });
      res.json(hasil)
  })

  router.post('/sentiment', async (req,res)=>{
      text = req.body.text;
      const language = require('@google-cloud/language');

// Creates a client
const client = new language.LanguageServiceClient();

/**
 * TODO(developer): Uncomment the following line to run this code.
 */
// const text = 'Your text to analyze, e.g. Hello, world!';

// Prepares a document, representing the provided text
const document = {
  content: text,
  type: 'PLAIN_TEXT',
};

// Detects the sentiment of the document
const [result] = await client.analyzeSentiment({document});

const sentiment = result.documentSentiment;
if(sentiment.score > 0.5){
  res.send("very positive")
}else if(sentiment.score < 0.5 && sentiment.score > 0){
  res.send("positive")
}else if(sentiment.score == 0){
  res.send("neutral")
}else if(sentiment.score > -0.5 && sentiment.score < 0){
  res.send("negative")
}else{
  res.send("very negative")
}

const sentences = result.sentences;
sentences.forEach(sentence => {
  console.log(`Sentence: ${sentence.text.content}`);
  console.log(`  Score: ${sentence.sentiment.score}`);
  console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
});


  });
module.exports = router;
