var moment = require("moment");

function formatDateUtil(result, formatString) {
    formatString = formatString || "YYYY-MM-DD HH:mm:ss";
    for (var i = 0 ; i < value.length; i ++) {
        result[i].ctime = moment(result[i].ctime * 1000).format(formatString);
        result[i].utime = moment(result[i].utime * 1000).format(formatString);
    }
    return result;
}

module.exports.formatDate = formatDateUtil;