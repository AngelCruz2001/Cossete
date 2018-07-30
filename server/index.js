//Variables de dependencias
var builder = require('botbuilder');
var restify =require ('restify');
var btoa=require('btoa');
var base64img = require ('base64-img');

//Variables globales
var conexion=require('./db/conexion');
var Producto,Accion,sql,direccionI="C:\\imgBot";
var inMemoryStorage = new builder.MemoryBotStorage();
var Extension1=2,Raraimg="",Tarjetas1=[],Tarjetas=[];
var ProductoElegido;
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
var Asesorar;
var Hora = new Date().getHours();
var Saludo="";
var PrimeraVez=true;
var SigueSaludando=false;
var Extension=3;
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

// Dialogo Raíz 
// bot.dialog('/',[
//     (session)=>{
//         if(PrimeraVez===false){
//             session.send("Hola de nuevo ¿En que puedo ayudarte?");
//         }
//         PrimeraVez=false;
//         console.log('====================================');
//         console.log("Si entra retana me va a comprar un arizona");
//         console.log('====================================');
//         session.beginDialog('/Cossete')
//     }
// ]);


bot.dialog('/', dialog)

dialog.matches('Saludo',[
    (session)=>{
        if(!SigueSaludando){
            session.send('Hola')
            session.send('¿Hay algo en lo que pueda ayudarte?')
            SigueSaludando=true;
        }else {
            session.send("Ya ponte a hacer en vez de preguntar")
        }
    }
]) 


//Dialogos dependiendo del intento detectado por LUIS
dialog.matches('Comprar',[
    (session,args,next)=>{
        var Producto=builder.EntityRecognizer.findAllEntities(args.entities, 'Producto')
        var ExtensionEntidad=Producto.length;
        console.log(ExtensionEntidad)
        if(ExtensionEntidad>0){
            ProductoElegido=Producto[0].entity;
        }else{
            console.log("Entro")
            session.beginDialog('/ComprarSEntidad');
            
        }

    //   next();
    },
     
]);


//Funciones
Guia=(session)=>{
    session.send("Dirigase a un producto de su interes y seleccione añadir al carrito.");
    session.send('Seleccione la talla y la cantidad de prendas que le gustaria adquirir, presione "Go to cart".');
    session.send('Aqui puede seleccionar de que forma quiere pagar')
    session.endConversation("Si tiene alguna otra duda solo digame.")
}


CrearTarjetProductos=(session,Extension,Nombre,Base64Img,ExtensionActual)=>{
     Nombre = new builder.HeroCard(session)
    .title('Esta es una tarjeta de tipo Hero Card')
    .subtitle('Este es su correspondente subtítulo')
    .text('Sigan a Marcelo Felman en Twitter: @mfelman')
    .images([
        builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
    ])
    .buttons([
        builder.CardAction.openUrl(session, 'https://docs.botframework.com/en-us/', 'Aprende')
    ]);

        // Creamos un array de tarjetas
    Tarjetas1.push(Nombre)
    if(ExtensionActual===Extension1){
        var msj = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(Tarjetas1);
        session.send(msj);
    }
}


bot.dialog('/ComprarSEntidad',[
    (session)=>{
        console.log('====================================');
        session.send("¡Genial!")
        builder.Prompts.choice(session,'¿Quiere que lo asesore en la busqueda de un producto?',"Si|No",{ listStyle: builder.ListStyle.button });
    },
    (session,results)=>{
        Asesorar=results.response.entity;
        console.log(Asesorar)
        if(Asesorar==="Si"){
            session.send("Se supone que aqui le enseño los productos y le muestro imagines pero pues que flojera ¿Verdad?")
        }
        builder.PromptText(session,"¿Algo en especifico?")
    },
    (session,results)=>{
            var Respuesta=results.response;
            if(Respuesta.equalsIgnoreCase("Si")){
                session.send("Muy bien, ¿Qué te interesa?")
                session.beginDialog('/')    
            }else if(Respuesta.equalsIgnoreCase("No")){
                //Crear TODOOOOOOOOO el catalogo pero despuecito
            }else{
                session.beginDialog('/')    
    
            }
            for(var i=0; i<=Extension1; i++){
                CrearTarjetProductos(session,Extension1,"Producto"+i,Raraimg,i);
            }
        
    }
])
        
