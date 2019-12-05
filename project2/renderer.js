const fs        = require('fs');
const manager   = require('./manager');
const Manager   =  new manager.Manager();

Manager.init();

var createUser              = () => { Manager.createUser(); };
var login                   = () => { Manager.login(); };
var logout                  = () => { Manager.logout(); };
var refresh                 = () => { Manager.refresh(); };
