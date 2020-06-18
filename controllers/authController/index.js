const path = require('path');


module.exports.login = (req, res) => {
  console.log(req.body);
  res.status(200);
  res.send('ok')
}

module.exports.registration = (req, res) => {
  console.log(req.body)
  res.status(200);
  res.send('ok');
}