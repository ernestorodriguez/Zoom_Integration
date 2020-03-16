const login_options = require('../general/zoom_auth_config');
const meeting_options = require('../general/zoom_meeting_config');
const meeting_conf =  require('../general/meeting_config');
const meeting_invite_conf =  require('../general/zoom_invite_conf');
const meeting_delete_conf =  require('../general/meeting_delete_config');
const request = require("request");
const http = require("https");
const general = require('../general/zoom_variables_generales');

module.exports = {
  LogIn: (code) => {
    login_options.qs.code = code;
    return new Promise(function (resolve, reject) {
      request(login_options, function(error, res, body) {
        if (!error && res.statusCode == 200) {
          resolve(JSON.parse(body.toString()).access_token);
        } else {
          reject(error);
        }
      });
    });
  },
  createMeeting: () => {
   // meeting_options.path ='https://api.zoom.us/v2/users/me/meetings?access_token='+token;  
    return new Promise(function (resolve, reject) {
      var req = http.request(meeting_options, function (res) {
        var chunks = [];
      
        res.on("data", function (chunk) {
          chunks.push(chunk);
        });
      
        res.on("end", function () {
          var body = Buffer.concat(chunks);
          if(body){
            general.meetingId = JSON.parse(body.toString()).id;

            if(JSON.parse(body.toString()).id)
              general.meetingIdGet =JSON.parse(body.toString()).id;
            if((JSON.parse(body.toString())).code == 429)
              resolve(JSON.parse(body.toString()).code);
            else
              console.log('Meeting Created', 'id '+ ( JSON.parse(body.toString()).id));
              resolve(JSON.parse(body.toString()).start_url);
          }else{
            reject('error');
          }
        });
    
      });
    
      req.write(JSON.stringify({meeting_conf}));

      req.end();
    });
  },  
  getMeeting: () => {
    //console.log('meetin_invite_conf ',meeting_invite_conf);
    meeting_invite_conf.path = '/v2/meetings/'+ general.meetingIdGet;

    return new Promise(function (resolve, reject) {
      var req = http.request(meeting_invite_conf, function (res) {
        var chunks = [];
      
        res.on("data", function (chunk) {
          chunks.push(chunk);
        });
      
        res.on("end", function () {
          var body = Buffer.concat(chunks);
          if(body){
            console.log('Meeting Reenter', 'id '+ ( JSON.parse(body.toString()).id));
            resolve( JSON.parse(body.toString()).start_url);
          }else{
            reject('error');
          }
        });
      });
      req.end();
    });
  },
  inviteMeeting: () => {
    meeting_invite_conf.path += general.meetingId+'/invitation';
   // meeting_invite_conf.headers.authorization ="Bearer " + general.token;
    return new Promise(function (resolve, reject) {
    var req = http.request(meeting_invite_conf, function (res) {
      var chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function () {
        var body = Buffer.concat(chunks);
        resolve(JSON.parse(body.toString()).invitation);
      });
    });
    
    req.end();
  });
  },
  deleteMeeting: () => {
    meeting_delete_conf.path = '/v2/meetings/'+ general.meetingIdGet;
  //  meeting_delete_conf.headers.authorization = 'Bearer '+ general.token;
    return new Promise(function (resolve, reject) {
      var req = http.request(meeting_delete_conf, function (res) {
        var chunks = [];
      
        res.on("data", function (chunk) {
          chunks.push(chunk);
        });
      
        res.on("end", function () {
          var body = Buffer.concat(chunks);
          resolve(body);
          
        });
      });
      req.end();
    });
  }
};




