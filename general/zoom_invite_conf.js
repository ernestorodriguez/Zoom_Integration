const token = require('./zoom_auth_config');

var options = {
    "method": "GET",
    "hostname": "api.zoom.us",
    "port": null,
    "path": "/v2/meetings/",
    "headers": {
      "authorization": "Bearer " + token
    }
  };

module.exports = options;