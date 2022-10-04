

const jwt = require('jsonwebtoken')


const generarJWT = (uid, name) => {
    
    const payload = { uid, name }

    //Retorno una promesa porque jwt no viene con ellas y me toca convertirlas de la sigueiente
    //manera en el resolve= si todo sale bien, el reject = si hubo algun error
    return new Promise((resolve, reject) => {
        
            jwt.sign(payload, process.env.SECRET_JWT_SEED, {
                expiresIn: '1h'
            },(err, token)=>{
                if(err){
                    //TODO MAL
                    console.log(err);
                    reject(err)
                }else{
                    //TODO BIEN
                    resolve(token)
                }
            })
    })
}


module.exports = {
    generarJWT
}