let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let session = require('express-session')

// Template Engine
app.set('view engine', 'ejs')

// Middlewares
app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(require('./middlewares/flash'))

// Routes
app.get('/', (req, res) => {
    let Message = require('./models/message')
    Message.all( messages => {
        res.render('pages/index', {messages: messages})
    })
})

app.post('/', (req, res) => {
    if (req.body.message === undefined || req.body.message === '') {
       req.flash('error', "Vous n'avez pas rentré de message :(")
       res.redirect('/')
    } else {
        let Message = require('./models/message')
        Message.create(req.body.message, () => {
            req.flash('success', "Merci !")
        })
        res.redirect('/')
    }
})

app.get('/message/:id', (req, res) => {
    let Message = require('./models/message')
    Message.find(req.params.id, () => {
        res.render('messages/show', {message: message})
    })
})

app.listen(8080)