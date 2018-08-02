var natural = require('natural');
var Diccionario=(Palabra)=>{
    
    var PalabraComparar=Palabra.toLocaleLowerCase();
    var Probablemente;
    var Contador=0;
    var SacarPromedio=true;
    var ProductosDiccionario= ["jumpsuit 1 ","dress model 1","dress model 2","jumpsuit 2","sweaters"];
    for(var z=0;z<ProductosDiccionario.length;z++){
        if(PalabraComparar===ProductosDiccionario[i]){
            var Bandera=true;
        }else{
            var Bandera=false
        }
    }
    var JumpSuitDiccionario= ["jumpsuit","jump suite","jumpsuite","jump suit","pantalones","pantalón","pantalon"];
    var DressModelDiccionario= ["dress model","dress model","dres model","vestido","bestido"];
    var SweatersDiccionario= ["sweaters","sueter","chamarra"];
    var Diccionarios=[JumpSuitDiccionario,DressModelDiccionario,SweatersDiccionario];
    for(var w=0; w<Diccionarios.length;w++){
        if (Bandera===false){
            var DiccionarioActual=Diccionarios[w];

            for (var i=0;i<DiccionarioActual.length; i++){
                var Probabilidad=natural.JaroWinklerDistance(DiccionarioActual[i],PalabraComparar)
                if (Probabilidad>=.90){
                    i=DiccionarioActual.length;
                    Probablemente=Probabilidad;
                    SacarPromedio=false;
                }else{
                    Contador=Contador+Probabilidad;
                }
                
            }
        
            if(SacarPromedio===true){
                Probablemente=Contador/i;
                if(Probablemente===0.915){
                    Probablemente=DiccionarioActual[0];
                }
            }else{
                if(Probablemente>=0.915){
                    Probablemente=DiccionarioActual[0];
                }
            }
            }else{
                Probablemente=PalabraComparar;
              
            }
    }
    var Tipo=typeof Probablemente;
    if(Tipo=="number"){
        Probablemente=PalabraComparar;
    }
  

    return  Probablemente;
}
module.exports.Diccionario=Diccionario;