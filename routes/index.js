var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
var nodemailer = require('nodemailer');
var novedadesModel = require('../models/novedadesModel');
const { getMaxListeners } = require('../app');
var cloudinary = require('cloudinary').v2;

/* GET home page. */
router.get('/', async function(req, res, next) {

  var novedades = await novedadesModel.getNovedades();

  novedades = novedades.splice(0, 5);

  novedades = novedades.map(novedad => {
    if (novedad.img_id) {
      const imagen = cloudinary.url(novedad.img_id, {
        width: 460,
        crop: 'fill'
      });
      return {
        ...novedad,
        imagen
      }
    } else {
      return {
        ...novedad,
        imagen: '/images/lemon.jpg'
      }
    }
  });

  res.render('index', {
    novedades
  });
});


router.post('/', async(req, res, next)=> {
  var Name = req.body.Name;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var Consulta = req.body.Consulta;

  var obj = {
    to: 'homegarden765@gmail.com',
    subject: 'Contacto, "home garden"',
    html: Name + ' ' + lastName + ' ' + 'consulta: <br>' + Consulta + '<br> su mail es: ' + email
  }

  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  var info = await transport.sendMail(obj);
  
  
  // res.render('index', {
  //   message: 'Mail enviado correctamente',
  // });

  // ESTO ES LO NUEVO AGREGADO.
  res.json({
    message: 'Mensaje enviado correctamente',
  });
  
});

module.exports = router;