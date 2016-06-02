var npmProperties = require('../../../package.json');

module.exports =
  { title: 'spaceshooter'
  , description: npmProperties.description
  , port: 3017
  , liveReloadPort: 3018
  , mute: false
  , showStats: false
  , size:
    { x: 500
    , y: 400
    }
  , analyticsId: 'UA-50892214-2'
  };
