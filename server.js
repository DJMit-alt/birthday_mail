var express = require('express')
var http = require('http')
var fs=require('fs')
var morgan = require('morgan')
var app = express()
var mailer=require('./mailer')
var config=require('./config')
var mail_templete=require('./mail/sample/sample_birthday_mail')
var bodyParser = require('body-parser')
var schedule = require('node-schedule')
var options = {}
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(morgan('dev'));
app.use(express.static('../client'));
http.createServer(app).listen(config.appPort, function () {
    console.log('Application Server Started on port '+config.appPort+'!');
});
function checkList() {
    var objList = [];
    var metaDataRaw =JSON.parse(fs.readFileSync('data/data.json', 'utf8'));
    var day = new Date().getDate();
    var month = (new Date().getMonth())+1;
    for(var i in metaDataRaw){
        var dataDay = parseInt(metaDataRaw[i].date.split("-")[0]);
        var dataMonth = parseInt(metaDataRaw[i].date.split("-")[1]);
        if((day === dataDay) && (month === dataMonth)){
         var obj = {
             "to"       :   config.mail_to,
             "from"     :   mail_templete.from,
             "body"     :   mail_templete.body+" "+metaDataRaw[i].name+mail_templete.body1,
             "subject"  :   mail_templete.subject
         };
         objList.push(obj);
        }
    }
    return objList;
}
var j = schedule.scheduleJob('15 10 * * *', function(){
    var obj = checkList();
    for(var i in obj){
        mailer.sendMail(obj[i],function(data){
            if(!data){
                console.log("Error on"+JSON.stringify(obj));
            }
        });
    }

});

