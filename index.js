var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var compiler = require('compilex');

var app = express();
app.use(bodyParser());

var option = { stats: true };
compiler.init(option);
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.post('/compilecode', function (req, res) {
  var code = req.body.code;
  var input = req.body.input;
  var inputRadio = req.body.inputRadio;
  var lang = req.body.lang;
  if (lang === 'C' || lang === 'C++') {
    if (inputRadio === 'true') {
      var envData = { OS: 'windows', cmd: 'g++', options: { timeout: 10000 } };
      compiler.compileCPPWithInput(envData, code, input, function (data) {
        if (data.error) {
          res.send(data.error);
        } else {
          res.send(data.output);
        }
      });
    } else {
      var envData = { OS: 'windows', cmd: 'g++', options: { timeout: 10000 } };
      compiler.compileCPP(envData, code, function (data) {
        res.send(data);
        //data.error = error message
        //data.output = output value
      });
    }
  }
  if (lang === 'Python') {
    if (inputRadio === 'true') {
      var envData = { OS: 'windows' };
      compiler.compilePythonWithInput(envData, code, input, function (data) {
        res.send(data);
      });
    } else {
      var envData = { OS: 'windows' };
      compiler.compilePython(envData, code, function (data) {
        res.send(data);
      });
    }
  }
});

app.get('/fullStat', function (req, res) {
  compiler.fullStat(function (data) {
    res.send(data);
  });
});

app.listen(3000);

compiler.flush(function () {
  console.log('All temporary files flushed !');
});
