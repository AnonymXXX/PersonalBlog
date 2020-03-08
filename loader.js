var fs = require("fs");
var globalConfig = require("./config");

var controllerSet = [];
var MapPath = new Map();

var files = fs.readdirSync(globalConfig["web_path"]);

for (var i = 0; i < files.length; i ++) {
    var temp = require("./" + globalConfig["web_path"] + "/" + files[i]);
    //判断导入的js文件是否有接口和方法
    if (temp.path) {
        for (var [key, value] of temp.path) {
            //如果MapPath里面没有这个接口就set
            if (MapPath.get(key) == null) {
                MapPath.set(key, value);
            } else {
                throw new Error("url path异常" + key);
            }
        }
        controllerSet.push(temp);
    }
}


module.exports = MapPath;
