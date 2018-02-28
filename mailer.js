var config = require('./config');
var email 	= require("./mail/email.js");
var mailer = {};
mailer.sendMail = function(data,callback){
    var server 	= email.server.connect({
        user:    config.mail_user,
        password:config.mail_password,
        host:    config.mail_server_host,
        ssl:     config.mail_server_ssl
    });
    server.send({
        text:    data.body,
        from:    data.from,
        to:      data.to,
        subject: data.subject
    }, function(err, message) {
        if(err === null){
            callback(true);
        }
        else{
            callback(false);
        }
    });
}
var module = module || {};
module.exports = mailer;