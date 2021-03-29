var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var axios = require('axios')

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', function (req,res) {
  res.send('<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '\n' +
      '<head>\n' +
      '\t<meta charset="utf-8">\n' +
      '\t<title>How to use</title>\n' +
      '</head>\n' +
      '\n' +
      '<body>\n' + '/delete_all - deletes all recipes from database\n' + '<br>' +
      '/sort_by_date/:asc - sorts recipes by date, parameter asc (true, false) \n' + '<br>'+
      '/stats - shows statistics of all recipes \n' +
  '</body>\n' +
      '\n' +
      '</html>')
})
app.delete('/delete_all', async function(req, res, next) {
  try{
    const {data} =  await axios.get('http://localhost:8080/recipes')
    const deletePromises = data.map(recipe => {
      return axios.delete('http://localhost:8080/recipe/' + recipe._id)
    })
    await Promise.all(deletePromises)
    res.sendStatus(200)
  }
  catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
});

app.get('/sort_by_date/:asc', async function(req, res) {
  if(!req.params) return res.sendStatus(400);
  try{
    const {asc} = req.params
    const {data} =  await axios.get('http://localhost:8080/recipes')
    if (asc == "true") {
      data.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);
    }
    else if (asc == "false") {
      data.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
    }
    else {
      res.status(500).json({error: "wrong parameter"})
    }
    res.send(data)
  }
  catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
});

app.get('/stats', async function (req,res) {
  try {
    const {data} =  await axios.get('http://localhost:8080/recipes')
    let stats = data.map(recipe => {
      let statsObject =  new Object()
      statsObject.recipeName = recipe.name
      let vals = Object.values(recipe.scores)
      statsObject.rate = (vals.reduce((a,b) => (a+b)/vals.length)).toFixed(2)
      statsObject.numOfComments = recipe.numberOfComments
      return statsObject
    })
    res.status(200).json(stats)
  }
  catch (e) {
    res.status(500).json(e)
  }
})


app.listen(7070, () => console.log('server is ready...'))
module.exports = app;
