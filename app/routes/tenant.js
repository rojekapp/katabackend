var express = require('express');
var router = express.Router();
const connection = require('../helpers/connection');
const query = require('../helpers/query');
const dbConfig = require('../dbConfig');
const {auth} = require('../middleware')
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// get config vars
dotenv.config();

// access config var
const host = process.env.MYSQL_HOST || 'localhost';

// Get the User for DB from Environment or use default
const user = process.env.MYSQL_USER || 'root';

// Get the Password for DB from Environment or use default
const password = process.env.MYSQL_PASS || '';

// Get the Database from Environment or use default
let database = process.env.MYSQL_DB || 'pazel';

// list tenant

  router.post('/login',auth,async (req,res)=>{
    database = req.body.dbname
    var username = req.body.username;
    var passwords = req.body.password;
    const conn = await connection({ host, user, password, database }).catch(e => {});
    const beb = await query(conn,"SELECT * FROM user WHERE username='"+username+"' AND password='"+passwords+"' AND type='tenant'").then(response=>{
      if(response.length == 0){
        
        
        res.send("Login failed")
      }else{
        async function ded(username){
          const op = await query(conn,"SELECT * FROM tenant WHERE user_tenant='"+username+"'")
          const op2= await query(conn,"SELECT * FROM menu WHERE tenant_id='"+op[0].tenant_id+"'")
          var hasil = op[0]
          hasil['menu'] = op2 
          res.json(hasil)
        
        
        }
        ded(username)
        
      }
    }).catch()
  })

  router.post('/update',auth,async (req,res)=>{
    database = req.body.dbname
    var menu = req.body.menu;
    var tenant_id = req.body.tenant_id;
    const conn = await connection({ host, user, password, database }).catch(e => {});
 
    menu.forEach(async individu => {
      const update = await query(conn,"UPDATE menu SET status='"+individu.status+"' WHERE tenant_id='"+tenant_id+"' AND menu_id='"+individu.menu_id+"'")
      
    })
    
    res.send("Update succeed")
  })

 

 
module.exports = router;
