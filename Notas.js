//Variables de dependencias
var mysql = require('mysql');
var builder = require('botbuilder');
var restify =require ('restify');
var base64img = require ('base64-img');
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
var connector = new builder.ChatConnector({
    appId: '',
    appPassword:''
})
//Crear bot
var bot = new builder.UniversalBot(connector);
server.post('/api/messages',connector.listen());
//Configuracion de LUIS
var model = "	https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b52309e8-88bd-4a01-9ddf-3be52dc0a036?subscription-key=a26e9792086947db99112f2aa9d5c3a3&verbose=true&timezoneOffset=0&q=";
var Salon;
var recognizer = new builder.LuisRecognizer(model);
var dialog= new builder.IntentDialog({recognizers:[recognizer]});
var YaNoEntres=true;
// Dialogo Raíz
bot.dialog('/',[
    (session)=>{
        // session.send("Holi");
    }
]);
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded && message.membersAdded.length > 0) {
        if(YaNoEntres){
            // Say hello
            var isGroup = message.address.conversation.isGroup;
            var txt = isGroup ? "Saludo" : "Hola soy James";
            var reply = new builder.Message()
                    .address(message.address)
                    .text(txt);
            bot.send(reply);
            YaNoEntres=false;
        }
        
    }
});
//Dialogo con LUIS
bot.dialog('/Cossete',dialog);
//Dialogos dependiendo del intento detectado por LUIS
dialog.matches('Comprar',[
    (session,args)=>{
        var Productos=builder.EntityRecognizer.findAllEntities(args.entities,'Producto');
        var Cancelar=builder.EntityRecognizer.findAllEntities(args.entities,'Cancelar');
        var Revisar=builder.EntityRecognizer.findAllEntities(args.entities,'Revisar');
        if(Cancelar.length>0){
            Accion="cancelar";
        }else if(Revisar.length>0){
            Accion="revisar"
        }else{
            Accion="comprar"
        }
        if(Accion==="revisar"||Accion==="comprar"){
            if(Productos.length>0){
                Producto=Productos[0].entity;
            }
           
        }
        
        switch (Accion) {
            case "comprar":
                session.beginDialog('/comprar');
                break;
        
            case "revisar":
                session.beginDialog('/revisar');
                break;
            case "cancelar":
                session.beginDialog('/cancelar');
                break;    
        }
    }
]);
bot.dialog('/revisar',[
    (session,result)=>{
        let connection=conexion.conectar();
        if(connection){
            console.log("Estas conectado a la base de datos");
        }
        sql=`SELECT * FROM Productos WHERE Nombre='${Producto}'`;
        var queryRevisar=connection.query(sql,(error,result)=>{
            if(error){
                console.log("Hubo un error con la consulta a la base de datos");
                throw error;
            }
            Raraimg=result[0].Imagen;
            
            base64img.img(`data:image/jpg;base64,${Raraimg}`,"C:\\imgBot",`${Producto}`,function(err,filepath){
                if(err){
                    console.log("Hubo un error con la imagen");
                    throw err;
                } 
            });
            //Crear la hero card con toda la informacion del producto
            var direccion=`${direccionI}\\${Producto}.jpg`
            var msg = new builder.Message(session);
            msg.attachmentLayout(builder.AttachmentLayout.carousel)
            msg.attachments([
                new builder.HeroCard(session)
                .title(result[0].Nombre)
                .subtitle("100% Soft and Luxurious Cotton")
                .text(`Price is $${result[0].Precio} and carried in sizes (S, M, L, and XL)`)
                .images([builder.CardImage.create(session,direccion)])
                .buttons([
                    builder.CardAction.imBack(session, "buy classic white t-shirt", "Buy")
                ])
            ]);
            session.send(msg);
            connection.end();
        });
     }    
]);
