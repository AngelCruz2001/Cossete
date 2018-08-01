var {modelProductos}=require('./models/Productos');
var respuesta;
var BuscarProducto=(Producto)=>{
    return new Promise ((resolve,reject)=>{
        modelProductos.find({"$or":[{Producto:Producto},{Tipo:Producto},{}]},{_id:0},(error,Productos)=>{
            if(error){        
                respuesta=error
            }else{
                
                respuesta=Productos;
            }
            if(respuesta===undefined || respuesta==="")respuesta="El producto que busca no esta en existencia"
            resolve(respuesta);
        })
    });
}

exports.BP=async(Producto)=>{
    let respuesta=await BuscarProducto(Producto);
    return respuesta;
}

