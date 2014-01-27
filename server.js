var express   = require('express');
app = module.exports = express();
//passport  = require('passport')
//mongoose  = require('mongoose')
var config    = require('./config')
//urls      = require('./urls')
//routes    = require('./routes')

//handle_error = require('./utils').handle_error
/*
#Connect to DB
db = mongoose.connect(config.creds.mongoose_auth_local)

#Middleware to check that a user is authenticated
ensureAuthenticated = (req, res, next) ->
      if (req.isAuthenticated())
          return next()
      console.log "Not authenticated!"
      res.redirect('/')

#Middleware to check that a user has admin role 
ensureAdmin = (req, res, next) ->
      if (req.user.role == "admin")
          return next()
      console.log "Not admin!"
      res.redirect('/')


#set up passport
LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy({usernameField: 'cedula'}, (cedula, password, done) ->
    console.log("new local strategy")
    User.findOne({ cedula: cedula }, (err, user) ->
      console.log("findone")
      if err?
         console.log "error in findone"
         return done(err)
      if not user
        console.log("Acceso no otorgado: Usuario incorrecto")
        return done(null, false, { message: 'Acceso no otorgado: Usuario invalido.' })
      console.log(user.password)
      console.log password
      if password isnt user.password
          console.log "NOT"
          return done(null, false, {message: "Acceso no otorgado: Contraseña invalida." })
      console.log "BUT YESS"
      done(null,user)
    )
))

########################
#configure the app
########################
*/
app.configure(function() { 
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.urlencoded());
  app.use(express.json());
  //app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('terces'));
  app.use(express.session());
  app.use(express.static(__dirname + '/public'));
  /*
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  */
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));
});

app.configure('development',function() { 
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function() {
      app.use(express.errorHandler());
});

/**
# Passport session setup.
# To support persistent login sessions, Passport needs to be able to
# serialize users into and deserialize users out of the session. Typically,
# this will be as simple as storing the user ID when serializing, and finding
# the user by ID when deserializing.
passport.serializeUser((user, done) ->
      #console.log "SerializeUser"
      done(null, user._id)
)

passport.deserializeUser((id, done) ->
      #done(null,id)
      #console.log "DeserializeUser"
      User.findById(id, (err, user) ->
         done(err, user)
      )
)
########################
#  Routes
########################
*/
//app.get('/', routes.index)
app.get('/', function(req, res){ res.render('index')});
/*
#passport_options =
#  successRedirect: '/tablero'
#  failureRedirect: '/'
#  failureFlash: true

app.post '/login', (req, res, next) ->
  passport.authenticate('local', (err, user, info) ->
    console.log "authenticate callback"
    if err?
      console.log "err in authenticate callback"
      return next(err)
    if not user
      console.log "User NOT in auth callback"
      req.flash("loginerror", info.message)
      return res.redirect('/login')
    req.logIn user, (err) ->
      if err?
        console.log "err! " + err
        res.redirect("/", { message: req.flash(err)})
        return
      console.log user.role
      if user.role is "admin" or user.role is "auditor"
        console.log "redirecting to tablero"
        res.redirect("/tablero")
      else
        console.log "redirecting to inicio"
        res.redirect("/inicio")
  )(req, res, next)



app.all('*',ensureAuthenticated)

app.get('/logout', routes.logout)
app.get('/tablero', routes.tablero)
*/
/*
app.get('/admin/partials/:name',(req, res) ->
   name = req.params.name
   res.render('admin/partials/' + name)
)

app.get('/partials/:name',(req, res) ->
   name = req.params.name    
   res.render('partials/' + name, {is_admin: "admin" == req.user.role})
)
*/
/*
########################
#Start the app
########################
*/
app.listen(config.app.port,function() { 
      console.log("Express server listening on port %d in %s mode", config.app.port, app.settings.env);
});
