var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var request = require('request');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs = require('fs-extra');
var multer  = require('multer')
var cors = require('cors')
const dbConfig = require('./dbConfig');
const adminConfig = require('./dbAdmin');
var indexRouter = require('./routes/index');

var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
require('dotenv').config()
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors())

/*uploads */
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
     let id_tim = req.body.id_tim;
     let paket_soal = req.body.paket_soal;
      fs.mkdirsSync('./public/uploads/'+id_tim+'/'+paket_soal);
        cb(null, './public/uploads/'+id_tim+"/"+paket_soal);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});
let upload = multer({
    storage: storage
});
/*uploads */
var dir = path.join(__dirname, 'public');
var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript',
    pdf:'application/pdf'
};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = { hello: () => 'Hello world!' };

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

const connection = require('./helpers/connection')
const query = require('./helpers/query')

app.get('/test', async (req, res) => {
  const connectiond = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'mysql',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    port: process.env.MYSQL_PORT || '6500'
  });
  connectiond.connect((err) => {
    if (err) {
      console.error('error connecting mysql: ', err);
    } else {
      console.log('mysql connection successful');
  
    }
  });
})
app.get('/cek', async (req, res) => {
 res.send("hello")
})

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get("*",function(req,res){
  var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
   if (file.indexOf(dir + path.sep) !== 0) {
       return res.status(403).end('Forbidden');
   }
   var type = mime[path.extname(file).slice(1)] || 'text/plain';
   var s = fs.createReadStream(file);
   s.on('open', function () {
       res.set('Content-Type', type);
       s.pipe(res);
   });
   s.on('error', function () {
       res.set('Content-Type', 'text/plain');
       res.status(404).end('Not found');
   });
});

module.exports = app;
