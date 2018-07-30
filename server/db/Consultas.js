var {modelProducto}=require('./models/Productos');
var respuesta;
BuscarProducto=(Producto)=>{
    return Promise ((resolve,reject)=>[
        modelProducto.find({Tipo:Producto},(error,Productos)=>{
            if(error){
                respuesta="El producto que busca no esta en existencia"
            }else{
                respuesta=Productos;
            }
            resolve(respuesta);
        })
    ]);
}

exports.BP=async(Producto)=>{
    let respuesta=await BuscarProducto(Producto);
    return respuesta;
}

