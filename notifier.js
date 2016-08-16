// See LICENCE file
//
var http = require('http');
var nodemailer = require('nodemailer');
var qstring = require('querystring');
var syslog = require('modern-syslog');
var config = require('./config');

syslog.init("notifier", syslog.LOG_NDELAY, syslog.LOG_LOCAL0);
var transport = nodemailer.createTransport(config.smtp);

var server = http.createServer(function(req, res) {

  var body = [];
  req.on('error', function(err) {
    console.error(err);
  }).on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();

    var options = { from : config.from,
                  to : config.to,
                  subject: "notifier",
                  text: "No text"
                };

    var data = qstring.parse(body);
    console.log(" data = ", data);
    if (data.hasOwnProperty('subject')) {
        options.subject = data.subject;
    }
    if (data.hasOwnProperty('text')) {
        options.text = data.text;
    }

    transport.sendMail(options, function(err, info) {
      if (err) {
          syslog.log(syslog.LOG_ERROR, "notifier error " + err);
          res.writeHead(200);
          res.end('KO');
      }
      else {
      }
      syslog.log(syslog.LOG_INFO, "notifier send mail " + info);
      res.writeHead(200);
      res.end('OK');
    });

  });

});

server.listen(config.port);
syslog.log(syslog.LOG_INFO, "notifier started on port " + config.port);
