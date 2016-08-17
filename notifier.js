// See GPL LICENCE file
//
var http = require('http');
var nodemailer = require('nodemailer');
var qstring = require('querystring');
var syslog = require('modern-syslog');
var config = require('./config');

syslog.init("notifier", syslog.LOG_NDELAY, syslog.LOG_LOCAL0);
var transport = nodemailer.createTransport(config.smtp);

var last_watch = new Date(); // last occurence of watchdog message
// ---------------------------------------------------------------------
// send_mail
// ---------------------------------------------------------------------
function send_mail(subject, text, cb) {
    var options = { from : config.from,
                  to : config.to,
                  subject: subject,
                  text: text
                };
    transport.sendMail(options, function(err, info) {
        if (err) {
          syslog.log(syslog.LOG_ERROR, "notifier error " + err);
          cb("KO");
        }
        else {
          syslog.log(syslog.LOG_INFO, "notifier send mail " + info.response);
          cb('OK');
        }
    });
}
// ---------------------------------------------------------------------
// HTTP server
// ---------------------------------------------------------------------
var server = http.createServer(function(req, res) {
  var body = [];
  req.on('error', function(err) {
    syslog.log(syslog.LOG_ERROR, "request error " + err);
  }).on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();
    var subject = "No subject";
    var text = "No text";

    var data = qstring.parse(body);

    if (data.subject === 'watchdog') {
        last_watch = new Date();
        res.writeHead(200);
        res.end('OK');
    }
    else {
        if (data.hasOwnProperty('subject')) {
            subject = data.subject;
        }
        if (data.hasOwnProperty('text')) {
            text = data.text;
        }
        send_mail(subject, text, function(msg) {
          res.writeHead(200);
          res.end(msg);
        });
    }
  });
});
// ----------------------------------------------------------------------------
server.listen(config.port);
syslog.log(syslog.LOG_INFO, "notifier started on port " + config.port);
// ---------------------------------------------------------------------
// Watchdog
// ---------------------------------------------------------------------
setInterval(function() {
                var now = new Date();
                var diff = now - last_watch;
                if (diff > 3600 * 1000) {
                    send_mail("no watchdog receive", "Since " + diff + " seconds", function(msg) {
                        // nothing to do
                    });
                }
            },
            300 * 1000);

