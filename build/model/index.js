var mongoose = require("mongoose");
module.exports = {
    List: require('./list')(mongoose),
    People: require('./people')(mongoose),
    Pmess: require('./pmess')(mongoose),
    Team: require('./team')(mongoose),
    Tmess: require('./tmess')(mongoose),
    Unread: require('./unread')(mongoose),
    User: require('./user')(mongoose),
};