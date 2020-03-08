var blogDao = require("../dao/BlogDao");
var tagDao = require("../dao/TagsDao");
var tagBlogMappingDao = require("../dao/TagBlogMappingDao");
var timeUtil = require("../util/TimeUtil");
var respUtil = require("../util/RespUtil");
var formatUtil = require("../util/formatDateUtil");
var url = require("url");

var path = new Map();

function queryHotBlog(request, response) {
    blogDao.queryHotBlog(5, function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
    })
}

path.set("/queryHotBlog", queryHotBlog);

function queryAllBlog(request, response) {
    blogDao.queryAllBlog(function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
    });
}

path.set("/queryAllBlog", queryAllBlog);

function queryBlogById(request, response) {
    var params = url.parse(request.url, true).query;
    blogDao.queryBlogById(parseInt(params.bid), function (result) {
        formatUtil.formatDate(result, "YYYY-MM-DD");
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
        blogDao.addViews(parseInt(params.bid), function (result) {});
    });
}

path.set("/queryBlogById", queryBlogById);

function queryBlogCount(request, response) {
    blogDao.queryBlogCount(function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
    });
}

path.set("/queryBlogCount", queryBlogCount);

function queryBlogByPage(request, response) {
    var params = url.parse(request.url, true).query;
    blogDao.queryBlogByPage(parseInt(params.page), parseInt(params.pageSize), function (result) {
        formatUtil.formatDate(result, "YYYY-MM-DD");
        for (var i = 0 ; i < result.length ; i ++) {
            //去掉base64字符
            result[i].content = result[i].content.replace(/<img[\w\W]*">/, "");
            //去掉标签
            result[i].content = result[i].content.replace(/<[\w\W]{1,5}>/g, "");
            //截取字符串前300位
            result[i].content = result[i].content.substring(0, 300);
        }
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
    })
}

path.set("/queryBlogByPage", queryBlogByPage);

function editBlog (request, response) {
    request.on("data", function (data) {
        var params = url.parse(request.url, true).query;
        var tags = params.tags.replace(/" "/g, "").replace("，", ",");
        blogDao.insertBlog(params.title, data.toString(), tags, 0, timeUtil.getNow(), timeUtil.getNow(), function (result) {
            response.writeHead(200);
            response.write(respUtil.writeResult("success", "添加成功", null));
            response.end();
            var blogId = result.insertId;
            var tagList = tags.split(",");
            for (var i = 0; i < tagList.length; i ++) {
                if (tagList[i] == "") {
                    continue;
                }
                queryTag(tagList[i], blogId);
            }
        });
    });
}

function queryTag(tag, blogId) {
    tagDao.queryTag(tag, function (result) {
        if (result == null || result.length == 0) {
            //没有查询到tag，插入tag，然后做映射
            insertTag(tag, blogId);
        } else {
            //查询到tag，做映射到tagBlogMapping表
            tagBlogMappingDao.insertTagBlogMapping(result[0].id, blogId, timeUtil.getNow(), timeUtil.getNow(), function (result) {});
        }
    })
}

function insertTag(tag, blogId) {
    tagDao.insertTag(tag, timeUtil.getNow(), timeUtil.getNow(), function (result) {
        insertTagBlogMapping(result.insertId, blogId);
    })
}

//做映射
function insertTagBlogMapping(tagId, blogId) {
    tagBlogMappingDao.insertTagBlogMapping(tagId, blogId, timeUtil.getNow(), timeUtil.getNow(), function (result) {})
}

path.set("/editBlog", editBlog);

module.exports.path = path;
