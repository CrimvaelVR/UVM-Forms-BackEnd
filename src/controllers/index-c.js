const forms = require('../models/formularios');
const user = require('../models/usuarios')
const jwt = require('jsonwebtoken')



class indexController {
  consultarFormularioUser = async (req, res) => {
    try {
      // Obtener el token de la cookie
      const token = req.cookies.token;
      // Decodificar el token sin verificar su firma
      const decoded = jwt.decode(token);
      // Obtener el nombre de usuario del token
      const username = decoded.usuario;

      // Buscar al usuario por su nombre de usuario en la base de datos
      user.findOne({usuario: username})
        .then(usuario => {
          // Si se encuentra al usuario, obtener su id
          if (usuario) {
            const id_Autor = usuario._id;
            // Buscar los formularios que tengan el id del usuario como autor
            forms.find({id_Autor: id_Autor})
              .then(formularios => {
                // Renderizar la vista con los datos del usuario y los formularios
                res.status(200).render('index-usuarios', {user: username, formularios: formularios});
              })
              .catch(error => {
                // Si ocurre un error al buscar los formularios, enviar un mensaje de error
                console.error(error);
                res.status(500).render('404', {mensaje: 'Error al buscar formularios'})
              });
          } else {
            // Si no se encuentra al usuario, enviar un mensaje de error
            res.status(404).render('404', {mensaje: 'Error al obtener usuario'})
          }
        })
        .catch(error => {
          // Si ocurre un error al buscar al usuario, enviar un mensaje de error
          console.error(error);
          res.status(500).render('404', {mensaje: 'Error al buscar usuario'})
        });
    } catch (error) {
      // Si ocurre un error al crear el formulario, enviar un mensaje de error
      res.redirect('/usuarios/login')

    }
  };
}

const indexC = new indexController();

module.exports = indexC;