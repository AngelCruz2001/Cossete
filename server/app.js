var mongoose=require('mongoose');
var BD="mongodb://JpgAngel:Jpg1407a@ds018568.mlab.com:18568/cossete";
mongoose.connect(BD,{useNewUrlParser:true},(error)=>{
    if(error){
        console.log("Has ocurried an error in conection to database");
    }else{
        console.log("Connected to database");
    }
});
