Simple notifier
===============

Small http server used to send mail from a POST HTTP request. It permits to simply notify user from domotic box.

## Install

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

## Service

To add service :
```
sudo cp simple_notifier.service /lib/systemd/system/
sudo systemctl enable simple_notifier
sudo systemctl start simple_notifier
```
