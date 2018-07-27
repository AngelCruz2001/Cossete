//Variables de dependencias
var builder = require('botbuilder');
var restify =require ('restify');
var btoa=require('btoa');

//Variables globales
var conexion=require('./db/conexion');
var Producto,Accion,sql,direccionI="C:\\imgBot";
var inMemoryStorage = new builder.MemoryBotStorage();
// Levantar Restify
var server = restify.createServer();
//configurando puerto
server.listen(process.env.port || process.env.PORT||3000,function(){
    console.log('listering to', server.name, server.url);
})
//Configuraciones del bot
var connector = new builder.ChatConnector({appId: '',appPassword:''})
//Crear bot
var bot = new builder.UniversalBot(connector);
server.post('/api/messages',connector.listen());
//Configuracion de LUIS
var model = "	https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b52309e8-88bd-4a01-9ddf-3be52dc0a036?subscription-key=a26e9792086947db99112f2aa9d5c3a3&verbose=true&timezoneOffset=0&q=";
var Salon;
var recognizer = new builder.LuisRecognizer(model);
var dialog= new builder.IntentDialog({recognizers:[recognizer]});

//Variables
var YaNoEntres=true;
var Hora = new Date().getHours();
var Saludo="";

// Dialogo Raíz
bot.dialog('/',dialog);
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded && message.membersAdded.length > 0) {
        if(YaNoEntres){
            // Say hello
            if(Hora>=12 && Hora<20){
                Saludo="Buenas tardes";
            }else if(Hora>=20 && Hora<24){
                Saludo="Buenas noches";
            }else if(Hora>0 && Hora<12){
                Saludo="Buenos dias"
            }else{
                Saludo="Hola";
            }
            
            var txt =`${Saludo} ¿En que puedo ayudarte?`;
            var reply = new builder.Message()
                    .address(message.address)
                    .text(txt);
            bot.send(reply);
            YaNoEntres=false;
        }
        
    }
});
//Dialogos dependiendo del intento detectado por LUIS
dialog.matches('Comprar',[
    (session,args)=>{
      session.send("Quieres comprar")
      
       
    }
]);