var express = require('express');
var router = express.Router();
var axios = require('axios')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// router.delete('/delete_all', async function(req, res, next) {
//   try{
//     const recipes = await axios.get('http://localhost:8080/recipes')
//     res.send(recipes)
//   }
//   catch (e) {
//     res.sendStatus(500)
//   }
// });
module.exports = router;
