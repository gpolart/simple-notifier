Simple notifier
===============

Small http server used to send mail from a POST HTTP request. It permits to simply notify user from domotic box.

## Install

You need Node.js 4.X.

```
git clone repository
cd simple-notifier
npm install
```
NB for github, repository = https://github.com/gpolart/simple-notifier.git

Copy config.js.sample to  config.js and modify fit your needs.

## Test

Run the notifier :

```
nodejs notifier.js
```

and send a request :
```
curl --data "subject=alarm&text=Alarm%20message" http://localhost:8025
```

Logs are sent with syslog so you can see in /var/log/syslog or /var/log/messages
```
Aug 16 11:29:46 domohub notifier: notifier started on port 8025
Aug 16 11:29:58 domohub notifier: notifier send mail ...
```

## Service

To add service :
```
sudo cp simple_notifier.service /lib/systemd/system/
sudo systemctl enable simple_notifier
sudo systemctl start simple_notifier
```
