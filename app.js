const builder = require ('botbuilder');
const restify = require ('restify');
const dotenv = require ('dotenv');
const mysql = require ('mysql');
var PrimeraVez=false;
var SegundaPrimeraVez=false;
var op;
var Producto 
var Talla    


// Levantar Restify
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT||3000,function(){
    console.log('listering to', server.name, server.url);
})
var connector = new builder.ChatConnector({appId: '',appPassword:''})
var bot = new builder.UniversalBot(connector);
server.post('/api/messages',connector.listen());


var model = "https://westcentralus.api.cognitive.microsoft.com/luis/v2.0/apps/b52309e8-88bd-4a01-9ddf-3be52dc0a036?subscription-key=69e700eeafe24461919f559e1e5759c7&verbose=true&timezoneOffset=0&q=";
var recognizer = new builder.LuisRecognizer(model);
var dialog= new builder.IntentDialog({recognizers:[recognizer]});


bot.dialog('/', [
    (session,results,next)=>{
        if (PrimeraVez===false){
            session.send('Hola ¿En que puedo ayudarte?');
            PrimeraVez=true;
            SegundaPrimeraVez=true;
            session.send('Pronto configuraremos esto...')  //Mostrar Opciones
            session.send('En ¿Que puedo ayudarte?')
        }else{
            session.send('Hola, ¡Que bueno verte de nuevo!');
            builder.Prompts.choice(session,"¿Le gustaria ver en lo que puedo ayudarle?" ,"Si|No",{ listStyle: builder.ListStyle.button });
            SegundaPrimeraVez=false;

        }
        next();


    },
    (session,results)=>{
        if (SegundaPrimeraVez===true){
            console.log('Que listo eres, No entro')
            session.beginDialog('/Iniciar');

            op=false;
        }else{
            op=results.response.entity;
            if (op==="Si") {
                session.send('Pronto configuraremos esto...')  //Mostrar Opciones
                session.send('En ¿Que puedo ayudarte?')
                session.beginDialog('/Iniciar');
            } else {
                session.send('Muy bien ¿En que puedo ayudarte?')
                session.beginDialog('/Iniciar');
            }
          
        }
    }

]);    

bot.dialog('/Iniciar', dialog);

dialog.matches ('Comprar',[
    (session,args,next)=>{
        Producto = builder.EntityRecognizer.findAllEntities(args.entities,'Producto');
        Talla = builder.EntityRecognizer.findAllEntities(args.entities,'Talla');
        let Extension=Producto.length;
        if (Extension>0) {
            session.send(`Muy bien entonces quieres un ${Producto[0].entity} en talla ${Talla[0].entity}`);
        } else {
            session.send('¿Que deseas comprar?');
        }
    }
])