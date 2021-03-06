var express = require('express');
var debug = require('debug')('myexpressapp:server');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');

// App
var app = express();
var server = require('http').createServer(app);

//CORS
app.use(require("cors")()) // allow Cross-domain requests 

// MongoDB
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://default-user:JgMmIChJd7IoyOJY@cluster0.bdgxr.mongodb.net/on-memory-neurotechnologies?retryWrites=true&w=majority";

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    app.set('mongo_client', client);
    console.log('Connected to Database')
  })

// Listen to Port
var port = normalizePort(process.env.PORT || '80');

// App Setup
app.use(favicon(path.join(__dirname, 'docs', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Listen to Port for HTTP Requests
app.use(function(req, res, next) {
  const validOrigins = [
    `http://localhost`,
    'https://onmemoryneurotech.azurewebsites.net',
    'http://onmemoryneurotech.azurewebsites.net',
    'http://slab.usc.edu',
    'https://slab.usc.edu',
    'http://97.90.237.21',
    'http://97.90.237.21:63342'
  ];
  const origin = req.headers.origin;

  console.log(origin)

  if (validOrigins.includes(origin)) {
    // console.log('valid origin: ' + origin)
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // console.log('invalid origin: ' + origin)
  }

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.static(path.join(__dirname, 'docs')));

// Set Routes
const initRoutes = require("./routes/web");
initRoutes(app);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log('error')
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log('error')
});


app.set('port', port);

server.listen(parseInt(port), () => {
  console.log('listening on *:' + port);
});

server.on('error', onError);
server.on('listening', onListening);

console.log('Server is running on http://localhost')


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
