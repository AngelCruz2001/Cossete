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
            session.beginDialog('/Cossete');

            op=false;
        }else{
            op=results.response.entity;
            if (op==="Si") {
                session.send('Pronto configuraremos esto...')  //Mostrar Opciones
                session.send('En ¿Que puedo ayudarte?')
                session.beginDialog('/Cossete');
            } else {
                session.send('Muy bien ¿En que puedo ayudarte?')
                session.beginDialog('/Cossete');
            }
          
        }
    }

]);    

bot.dialog('/Cossete', dialog);

dialog.matches('Comprar',[
    (session,args,next)=>{

        var Productos=builder.EntityRecognizer.findAllEntities(args.entities,'Producto');
        var Cancelar=builder.EntityRecognizer.findAllEntities(args.entities,'Cancelar');
        var AccionLUIS=builder.EntityRecognizer.findAllEntities(args.entities,'Revisar');
        // if(Cancelar.length>0){
        //     Accion="cancelar";
        if (SiProducto) {
            Producto=Productos[0].entity;
            next();
        } else {
            
            
            if(AccionLUIS.length>0){
                Accion="Ver"
            }else{
                Accion="Comprar"
            }
            if(Accion==="Ver"||Accion==="Comprar"){
                if(Productos.length>0){
                    Producto=Productos[0].entity;
                    var SiProducto=true;
                    next();
                }else{
                    session.send('¿Qué producto te interesa?');
                    
                session.beginDialog('/Cossete');
                }
            }
    }
    },(sessiono,result)=>{
        console.log(Producto)
        switch (Accion) {
            case "Comprar":
                session.beginDialog('/Comprar');
                break;
        
            case "Ver":
                session.beginDialog('/Ver');
                break;
            case "cancelar":
                session.beginDialog('/cancelar');
                break;    
        }
    }
]);
bot.dialog('/Ver',[
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
