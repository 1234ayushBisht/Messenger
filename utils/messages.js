const moment = require("moment");

function formatMsg(name, msg){
    return{
        name,
        msg,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMsg;