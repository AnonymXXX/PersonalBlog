var tagDao = require("../dao/TagsDao");
var blogDao = require("../dao/BlogDao");
var tagBlogMappingDao = require("../dao/TagBlogMappingDao");
var timeUtil = require("../util/TimeUtil");
var respUtil = require("../util/RespUtil");
var url = require("url");

var path = new Map();

function queryRandomTags(request, response) {
    tagDao.queryAllTags(function (result) {
        result.sort(function () {
            return Math.random() > 0.5 ? 1 : -1;
        });
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
    });
}

path.set("/queryRandomTags", queryRandomTags);

function queryByTag(request, response) {
    var params = url.parse(request.url, true).query;
    tagDao.queryTag(params.tag, function (result) {
        if (result == null || result.length == 0) {
            response.writeHead(200);
            response.write(respUtil.writeResult("success", "查询成功", result));
            response.end();
        }else {
            tagBlogMappingDao.queryByTag(result[0].id, parseInt(params.page), parseInt(params.pageSize), function (result) {
                var blogList = [];
                for (var i = 0; i < result.length; i ++) {
                    blogDao.queryBlogById(result[i].blog_id, function (result) {
                        blogList.push(result[0]);
                    });
                }
                getResult(blogList, result.length, response);
            });
        }
    })
}

path.set("/queryByTag", queryByTag);

function getResult (blogList, len, response) {
    if (blogList.length < len) {
        setTimeout(function () {
            getResult(blogList, len, response);
        }, 10)
    }else {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", blogList));
        response.end();
    }
}

function queryByTagCount(request, response) {
    var params = url.parse(request.url, true).query;
    tagDao.queryTag(params.tag, function (result) {
        tagBlogMappingDao.queryByTagCount(result[0].id, function (result) {
            response.writeHead(200);
            response.write(respUtil.writeResult("success", "查询成功", result));
            response.end();
        })
    });
}

path.set("/queryByTagCount", queryByTagCount);


module.exports.path = path;