var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('webapp', { title: 'Express' });
});

router.get('/dashboard', function(req,res) {
	res.render('dashboard');
});

router.get('/detail', function(req, res) {
	res.render('webapp-detail');
});

router.post('/hospitalInfo', function(req, res) {
	console.log(req);
	res.render('webapp-detail', {hospital: hospital});
});

module.exports = router;
