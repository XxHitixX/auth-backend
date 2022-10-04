
const { response } = require('express') //Esto para tener el tipado de express
const { validationResult } = require('express-validator')
const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')


const crearUsuario = async(req, res = response) => {

    const { email, name, password } = req.body;

    try {
        // Verificar el email
        const usuario = await Usuario.findOne({ email });

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        // Crear usuario con el modelo
        const dbUser = new Usuario( req.body );

        // Hashear la contraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );

        // Generar el JWT
        const token = await generarJWT( dbUser.id, name );

        // Crear usuario de DB
        await dbUser.save();

        // Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            email,
            token
        });




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}


/*
const crearUsuario = async(req, resp = response ) => {
    
    const { name, email, password } = req.body

    try {
        //Primero verificar el email
        let usuario = await Usuario.findOne({email: email});
        if( usuario ){
            return resp.status(400).json({
                ok: false,
                msg: 'Ya existe el correo electrónico'
            })
        }
        
        //crear el usuario con el modelo de BD
        const bdUser = Usuario( req.body )
        
        //Segundo encriptar/hashear la contraseña
        const salt = bcrypt.genSaltSync(10);
        bdUser.password = bcrypt.hashSync(password, salt);

        //Generar el JWT
        const token = await generarJWT(bdUser.uid, name)

        //Guardar el usuario en la base de datos
        await bdUser.save()

        //Generar respuesta exitosa
        return resp.status(201).json({
            ok: true,
            uid: bdUser.id,
            name,
            token,
            msg: 'Usuario creado correctamente'
        })

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error interno, solicite ayuda al administrador!!'
        })

    }


    //asi lo tenia
    //Codigo optimizado para no escribirlo tntas veces ahora se usa como un middleware personalzado
    const errors = validationResult( req )

    if( !errors.isEmpty() ){
        return resp.status(400).json({
            ok: false,
            msg: errors.mapped()
        })
    }
    //console.log( req.body )
    const { name, email, password } = req.body
    //  console.log(name, email, password)
    
    resp.json({
        ok: true,
        msg: 'Usuario creado!!'
    })

}

*/
const loginUsuario =  async(req, resp = response) => {

/*    const errors = validationResult( req );

    if( !errors.isEmpty() ){
        return resp.status(400).json({
            ok: false,
            msg: errors.mapped()
        })
    }
  */  
    //obtengo lo que viene en el req desde el navegador
    const { email, password } = req.body
    //console.log(email, password)
    
    try {

        //comienzo a verificar si el email del usuario existe y pregunto si hay uni
        //en la base de datos con el metodo findOne
        const userDb = await Usuario.findOne({email})

        if(!userDb){
            return resp.status(400).json({
                ok: false,
                msg: 'Usuario y/o contraseña invalida'
            })
        }

        const validPassword = bcrypt.compareSync(password, userDb.password)

        if(!validPassword){
            return resp.status(400).json({
                ok: false,
                msg: 'Usuario y/o la contraseña es invalida'
            }) 
        }

        //Si paso el logeo debo generae el JWT por 1 hora
        const token = await generarJWT(userDb.id, userDb.name)

        //ya este páso no se hace solo es por fines educativos y probar la API
        return resp.json({
            ok: true,
            uid: userDb.id,
            name: userDb.name,
            email,
            token
        })
        
    } catch (error) {
        console.log(error);
        
        return resp.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un problema, hable con el administrador.'
        })
    }


   /*return resp.json({
        ok: true,
        msg: 'Login de Usuario'
    })*/
}


const revalidarToken = async(req, resp = response)=>{
    
    //Tomo el parametro personalizado x-token que viene en el header 
   /* const token = req.header('x-token')

    if(!token){
        return resp.status(401).json({
            ok: false,
            msg: 'No se ha leido el token'
        })
    }*/
    const { uid } = req;

    const dbUser = await Usuario.findById(uid);

    const token = await generarJWT(uid, dbUser.name);
    console.log(dbUser.email);
    resp.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        msg: 'renew Token',
        token
    })
}





module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}
