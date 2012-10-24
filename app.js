var express = require('express');
var http = require('http');
var poet = require('poet');
var moment = require('moment');
var stylus = require('stylus');
var nib = require('nib');

var app = express.createServer();

poet(app)
  .createPostRoute()
  .createPageRoute()
  .createTagRoute()
  .createCategoryRoute()
  .init();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib());
 }


app.configure(function(){
  app.set('port', process.env.PORT || 3344 );
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(stylus.middleware({
    src:__dirname + '/public',
    compile: compile
  }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// ===== ROUTES =====

var main = require('./routes/main');
var about = require('./routes/about');
var projects = require('./routes/projects');
var papers = require('./routes/papers');

app.get('/', main.index);

app.get('/about', about.index);
app.get('/about/steve', about.steve);
app.get('/about/jacques', about.jacques);
app.get('/about/interns', about.interns);

app.get('/projects', projects.index);
app.get('/projects/culverts', projects.culverts);
app.get('/projects/lwd', projects.lwd);
app.get('/projects/sdss', projects.sdss);
app.get('/projects/temperature', projects.temperature);

app.get('/blog', main.blog);
app.get('/archive', main.archive);

app.get('/resources', main.resources);
app.get('/resources/sdss', main.sdss);
app.get('/resources/sdss/sofar', main.sofar);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
