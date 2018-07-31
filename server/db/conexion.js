var mongoose=require('mongoose');
var BD="mongodb://JpgAngel:Jpg1407a@ds018568.mlab.com:18568/cossete"
exports.conectar=()=>{
    mongoose.connect(BD,{useNewUrlParser:true},(error)=>{
        if(error)console.log("Hay un error")
        else console.log("Connected to dabase")
    });
    mongoose.connection
        .once('open', () => console.log('Connection has been sucessfully'))
        .on('error', console.error.bind('Check the connection'))
}