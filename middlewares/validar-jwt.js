const { response } = require('express');
const jwt = require('jsonwebtoken');


const validarJWT = (req, resp=response, next)=>{

    const token = req.header('x-token');
    
    if(!token){
        return resp.status(401).json({
            ok: false,
            msg: 'No se ha leido el token'
        })
    }

    try {
        //Verifico que el token sea el mismo con el metodo verify
        const { uid, name } = jwt.verify( token, process.env.SECRET_JWT_SEED);
        req.uid = uid;
        req.name = name
        console.log(uid, name);
        
    } catch (error) {
        return resp.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }


    //TODO BIEN!!
    next()
}




module.exports = {
    validarJWT
}