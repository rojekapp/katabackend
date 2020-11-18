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
router.post('/tenantlist', auth, async (req, res,next) => {
    database = req.body.dbname
  const conn = await connection({ host, user, password, database }).catch(e => {});
  const results = await query(conn, 'SELECT * FROM tenant ORDER BY tenant_name ASC').catch(console.log);
  
  res.json({results});
  
})

//search tenant
router.post('/menusearch', auth, async (req, res) => {
  var filter = req.body.filter;
  var querys = req.body.query;
  database = req.body.dbname
  
  const conn = await connection({ host, user, password, database }).catch(e => {});
  if(filter == "all"){
    const results = await query(conn, "SELECT * FROM menu INNER JOIN tenant ON menu.tenant_id=tenant.tenant_id WHERE menu.menu_name LIKE '%"+querys+"%' ORDER BY menu.menu_name ASC").catch(console.log);
  res.json({ results });
  }else{
    const results = await query(conn, "SELECT * FROM menu INNER JOIN tenant ON menu.tenant_id=tenant.tenant_id WHERE menu.tenant_id="+filter+" AND menu.menu_name LIKE '%"+querys+"%' ORDER BY menu.menu_name ASC").catch(console.log);
  res.json({ results });
  }
})

router.post('/menu', auth, async (req, res) => {
    var filter = req.body.filter;
    database = req.body.dbname
    const conn = await connection({ host, user, password, database }).catch(e => {});
    if(filter == "all"){
      const results = await query(conn, "SELECT  * FROM tenant ORDER BY tenant_name ASC").catch();
     for(var i=0;i<results.length;i++){
      const results2 = await query(conn, "SELECT  * FROM menu WHERE tenant_id='"+results[i].tenant_id+"' ORDER BY menu_name").catch();
      results[i]['menu'] = results2
     }
      res.json({results})
    
      }else{
      const results = await query(conn, "SELECT * FROM menu INNER JOIN tenant ON menu.tenant_id=tenant.tenant_id WHERE menu.tenant_id='"+filter+"' ORDER BY menu.menu_name ASC").catch(console.log);
    res.json({ results });
    }
  })
  router.post('/menu_scroll', auth, async (req, res) => {
    const filter = req.body.filter;
    database = req.body.dbname
    const start = req.body.start;
    const end = req.body.end;
    const conn = await connection({ host, user, password, database }).catch(e => {});
    
    if(filter == "all"){
      const results = await query(conn, "SELECT  * FROM tenant ORDER BY tenant_name ASC").catch();
     for(var i=0;i<results.length;i++){
      const results2 = await query(conn, "SELECT  * FROM menu WHERE tenant_id='"+results[i].tenant_id+"' ORDER BY menu_name ASC LIMIT "+start+","+end+"").catch();
      results[i]['menu'] = results2
     }
      res.json({results})
    
      }else{
      const results = await query(conn, "SELECT * FROM menu INNER JOIN tenant ON menu.tenant_id=tenant.tenant_id WHERE menu.tenant_id='"+filter+"' ORDER BY menu.menu_name ASC LIMIT "+start+","+end+"").catch(console.log);
    res.json({ results });
    }
    
  })

  router.post('/login',auth,async (req,res)=>{
    database = req.body.dbname
    var username = req.body.username;
    var passwords = req.body.password;
    const conn = await connection({ host, user, password, database }).catch(e => {});
    const beb = await query(conn,"SELECT * FROM user WHERE username='"+username+"' AND password='"+passwords+"' AND type='cashier'").then(response=>{
      if(response.length == 0){
        
        
        res.send("Login failed")
      }else{
        res.json(response[0])
      }
    }).catch()
  })

  router.post('/addtenant',auth,async (req,res)=>{
    database = req.body.dbname
    var tenant_name = req.body.tenant_name;
    var tenant_status = req.body.tenant_status;
    var username = req.body.username;
    var passwords = req.body.password;
    if(tenant_status == '' || tenant_status == undefined){
        tenant_status = 'open'
    } 
    var presentase = req.body.presentase;
    const conn = await connection({ host, user, password, database }).catch(e => {});
    const beb = await query(conn,"SELECT * FROM tenant WHERE tenant_name='"+tenant_name+"'")
    const beb2 = await query(conn,"SELECT * FROM tenant WHERE user_tenant='"+username+"'")
    const beb3 =  await query(conn,"SELECT * FROM user WHERE username='"+username+"'")
    if(beb.length != 0){
      res.send("Tenant name not unique")
    }else if(beb2.length != 0){
      res.send("User tenant not unique")
    }else if(beb3.length != 0 ){
      res.send("User tenant not unique")
    }else{
      async function insert_tenant(){
        result = await query(conn,"INSERT INTO tenant (tenant_name,tenant_status,presentase_bagi_hasil,user_tenant) VALUES ('"+tenant_name+"','"+tenant_status+"','"+presentase+"','"+username+"')")
        const user = {
          username : username,
          password : passwords
        }
        var token;
      jwt.sign({user},'secretkey',async (err,token)=>{
        const op =  await query(conn,"INSERT INTO user (username,password,token,type) VALUES ('"+username+"','"+passwords+"','"+token+"','tenant')").then(response2=>{
          res.json({token})
        
      
        })
        
        
      })
      }
      insert_tenant()
    }
    
       
        
        
        


      
    })
 

  router.post('/updatetenant',auth,async (req,res)=>{
    database = req.body.dbname
    var tenant_id = req.body.tenant_id;
    var tenant_status = req.body.tenant_status;
    var user_tenant = req.body.username
    var passwords = req.body.password
    const conn = await connection({ host, user, password, database }).catch(e => {});
    if(tenant_status != '' && tenant_status != undefined){
        const beb = await query(conn,"UPDATE tenant SET tenant_status='"+tenant_status+"' WHERE tenant_id='"+tenant_id+"'")
      }

    if (user_tenant != '' && user_tenant != undefined){
      const bet = await query(conn,"SELECT * FROM tenant WHERE user_tenant='"+user_tenant+"'")
      const bet2 = await query(conn,"SELECT * FROM user WHERE username='"+user_tenant+"'")
      const bet3 = await query(conn,"SELECT * FROM tenant WHERE tenant_id='"+tenant_id+"'")
      if (bet.length != 0 || bet2.length != 0){
        res.send("Username not unique")
      } else{
         await query(conn,"UPDATE tenant SET user_tenant='"+user_tenant+"' WHERE tenant_id='"+tenant_id+"'")
         await query(conn,"UPDATE user SET username='"+user_tenant+"' WHERE username='"+bet3[0].user_tenant+"'")
      } 
     

     
      
    }
    if (passwords != '' && passwords != undefined){
      const bet = await query(conn,"SELECT user_tenant FROM tenant WHERE tenant_id='"+tenant_id+"' ").then(response=>{
        async function update(username){
         
         await query(conn,"UPDATE user SET password='"+passwords+"' WHERE username='"+username+"'")
        }
        update(response[0].user_tenant);
      });
    }
    var presentase = req.body.presentase;
    if(presentase != '' && presentase != undefined){
        const beb = await query(conn,"UPDATE tenant SET presentase_bagi_hasil='"+presentase+"' WHERE tenant_id='"+tenant_id+"'")
      }
      res.send("update "+tenant_id+" succeed")
  })
  router.post('/deltenant',auth, async (req,res)=>{
    database = req.body.dbname
    var tenant_id = req.body.tenant_id;
    const conn = await connection({ host, user, password, database }).catch(e => {});
    
      const bet3 = await query(conn,"SELECT * FROM tenant WHERE tenant_id='"+tenant_id+"'")
      var username = bet3[0].user_tenant
      const beb = await query(conn,"DELETE FROM tenant WHERE tenant_id='"+tenant_id+"'")
      const beb2 = await query(conn,"DELETE FROM user WHERE username='"+username+"'")
    res.send("delete "+tenant_id+" succeed")
  })
  router.post('/addmenu',auth,async (req,res)=>{
    database = req.body.dbname
    var tenant_id = req.body.tenant_id;
    var menu_name = req.body.menu_name;
    var price = req.body.price;
    var discount = req.body.discount;
    var order_type = req.body.order_type;
    var menu_type = req.body.menu_type;
    var status = req.body.status;
    if(status == '' || status == undefined){
        status = 'still'
    } 
    if(discount == '' || discount == undefined){
        discount = ''
    } 
   
    const conn = await connection({ host, user, password, database }).catch(e => {});
    
        const op = await query(conn,"INSERT INTO menu (tenant_id,menu_name,price,discount,order_type,menu_type,status) VALUES ('"+tenant_id+"','"+menu_name+"','"+price+"','"+discount+"','"+order_type+"','"+menu_type+"','"+status+"')").then(response=>{
            res.send("Menu successfully created")
        }).catch();
     
    });
    router.post('/updatemenu',auth,async (req,res)=>{
        
        database = req.body.dbname
        var tenant_id = req.body.tenant_id;
        var menu_id = req.body.menu_id;
        var price = req.body.price;
        var discount = req.body.discount;
        var order_type = req.body.order_type;
        var menu_type = req.body.menu_type;
        var status = req.body.status;
        const conn = await connection({ host, user, password, database }).catch(e => {});
        if(price != '' && price != undefined){
            const beb = await query(conn,"UPDATE menu SET price='"+price+"' WHERE menu_id='"+menu_id+"' AND tenant_id='"+tenant_id+"'")
          }
          if(discount != '' && discount != undefined){
            const beb = await query(conn,"UPDATE menu SET discount='"+discount+"' WHERE menu_id='"+menu_id+"' AND tenant_id='"+tenant_id+"'")
          }
          if(order_type != '' && order_type != undefined){
            const beb = await query(conn,"UPDATE menu SET order_type='"+order_type+"' WHERE menu_id='"+menu_id+"' AND tenant_id='"+tenant_id+"'")
          }if(menu_type != '' && menu_type != undefined){
            const beb = await query(conn,"UPDATE menu SET menu_type='"+menu_type+"' WHERE menu_id='"+menu_id+"' AND tenant_id='"+tenant_id+"'")
          }if(status != '' && status != undefined){
            const beb = await query(conn,"UPDATE menu SET status='"+status+"' WHERE menu_id='"+menu_id+"' AND tenant_id='"+tenant_id+"'")
          }
          res.send("update "+menu_id+" succeed")
      })
      router.post('/delmenu',auth, async (req,res)=>{
        database = req.body.dbname
        var tenant_id = req.body.tenant_id;
        var menu_id = req.body.menu_id;
        const conn = await connection({ host, user, password, database }).catch(e => {});
          const beb = await query(conn,"DELETE FROM menu WHERE menu_id='"+menu_id+"' AND tenant_id='"+tenant_id+"'")
       
        res.send("delete "+menu_id+" succeed")
      })
module.exports = router;
