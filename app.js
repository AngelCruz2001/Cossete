import * as builder from 'botbuilder';
import * as restify from 'restify';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as mysql from 'mysql';

var app=express();


server.listen(process.env.port || process.env.PORT||3000,function(){
    console.log('listering to', server.name, server.url);
})
var connector = new builder.ChatConnector({
    appId: '',
    appPassword:''
})

var bot = new builder.UniversalBot(connector);
server.post('/api/messages',connector.listen());



bot.dialog('/', [
    (session,next)=>{
        session.send('Hola ¿En que puedo ayudarte?');
    }

]);    