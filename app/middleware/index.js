const jwt = require("jsonwebtoken");

module.exports = {
    auth: function(req,res,next){
        const bearer = req.headers['authorization'];
        if(typeof bearer !== 'undefined'){
            const bearers = bearer.split(' ');
            const tokens = bearers[1];
            jwt.verify(tokens,'secretkey',(err,authData)=>{
                if (err){
                    res.sendStatus(403)
                }else{
                  req.user = authData
                  next()
                }
              })
        }else{
            res.sendStatus(403)
        }
    }
}