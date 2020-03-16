const token = require('./zoom_auth_config');

var options = {
    method: 'POST',
    hostname: 'api.zoom.us',
    port:null,
    path:'https://api.zoom.us/v2/users/me/meetings?access_token='+token,
    headers: {
        'Content-Type': 'application/json',
    }
};

module.exports = options;