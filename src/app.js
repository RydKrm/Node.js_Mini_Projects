const path = require('path')
const express = require('express')
const hbs = require('hbs')
const { time } = require('console')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

const app = express()
const publicDirectoryPath = path.join(__dirname, '../public')
const viewpath = path.join(__dirname,'../temple/views')
const partialsPath = path.join(__dirname,'../temple/partials')

app.set('view engine','hbs')
app.set('views',viewpath)
hbs.registerPartials(partialsPath)
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Andrew Mead',
        foot: 'index footer'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Andrew Mead',
        foot: 'about footer'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title:'Help Page',
        foot: 'Help footer'
    })
})

app.get('/weather', (req, res) => { 
   if(!req.query.address){
       return res.send({
           error:'Your search is not found',
       })
   }
   
 geocode(req.query.address,(error,{latitude,logitude,location})=>{
if(error){
    return res.send({error})
} 
 forecast(latitude,logitude,(error,forcastData) => {
     if(error){
         return res.send({error})
     } 
   
     res.send({
         forecast: forcastData,
         location,
         address : res.query.address
     })

 })


 })

})

 app.get('*',(req,res) =>{
     res.send('<h1 color="red"> 404 Not found </h1>');
 })

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})