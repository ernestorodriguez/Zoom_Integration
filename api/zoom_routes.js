const { Router } = require('express');
const router = Router();
const service = require('../services/zoom_service');
const general = require('../general/zoom_variables_generales');
var In_meeting = false;


router.get('/',async (req, res)  =>  {
    // CONSULTA SI YA EXISTE UNA REUNION CREADA
  if(!In_meeting){
      general.meetingLink =  'no link';
      // SI NO ESTA CREADA, CREA UNA Y ASIGNA EL LINK Y REDIRECCIONA
      general.meetingLink = await service.createMeeting().catch((error) => {
          console.log("Promise Rejected" + error);
      });
      
      general.meetingLink == 429 ? res.redirect(general.error()): '';

      In_meeting = true;
      res.redirect(301,general.meetingLink); 
  }else{
    // SI YA ESTA CREADA UNA REUNION VUELVE A REDIRECCIONAR A ESTA REUNION
    In_meeting = false;
    res.redirect(general.getmeeting());      
  }
});

router.get('/get_meeting', async(req, res) => {
    general.meetingLink = await service.getMeeting().catch((error) => {
      console.log("Promise Rejected" + error);
    });
    console.log('Reenter Meeting');
    res.redirect(general.meetingLink);
});

router.get('/invite_meeting', async (req, res) => {
    var ress = await service.inviteMeeting(general.meetingId).catch((error) => {
      console.log("Promise Rejected" + error);
    });
    res.send(`<h3> el Dr/a. ${ress.substr(0,231)}</h3>`); 
});

router.get('/error', async (req, res) => {
    text = `<h3>Usted llego al maximo de 100 consultas</h3>`;
    //res.send(`<h3>Usted llego al maximo de 100 consultas</h3>`); 
    res.setHeader('Content-Type', 'text/event-stream');
    res.format({
        'text/plain': function () {
          res.send(text)
        },
      
        'text/html': function () {
          res.send('<p>'+text+'</p>')
        },
      
        'application/json': function () {
          res.send({ message: text })
        },
      
        'default': function () {
          // log the request and respond with 406
          res.status(429).send(text)
        }
      })
});


module.exports=router;



