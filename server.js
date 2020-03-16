const express = require('express');
const api = require('./api/zoom_routes');
const app = express();


app.use(express.json());
app.use('/api',api);

app.get('/', function (req, res)  {
 res.redirect('http://localhost:3000/api');
});

app.use(express.json());

app.listen(3000, function () {
  console.log('server on!');
});

