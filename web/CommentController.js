var commentDao = require("../dao/CommentDao");
var timeUtil = require("../util/TimeUtil");
var respUtil = require("../util/RespUtil");
var url = require("url");
var captcha = require("svg-captcha");
var formatUtil = require("../util/formatDateUtil");

var path = new Map();

function sendComment (request, response) {
    var params = url.parse(request.url, true).query;
    commentDao.insertComment(parseInt(params.bid), parseInt(params.parent), params.parentName, params.name, params.content, params.email, timeUtil.getNow(), timeUtil.getNow(), function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "评论成功", null));
        response.end();
    });
}

path.set("/sendComment", sendComment);

function queryRandomCode (request, response) {
    var img = captcha.create({fontSize: 50, width: 100, height: 34});
    response.writeHead(200);
    response.write(respUtil.writeResult("success", "评论成功", img));
    response.end();
}

path.set("/queryRandomCode", queryRandomCode);

function queryCommentsByBlogId(request, response) {
    var params = url.parse(request.url, true).query;
    commentDao.queryCommentsByBlogId(parseInt(params.bid), function (result) {
        formatUtil.formatDate(result);
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
    })
}

path.set("/queryCommentsByBlogId", queryCommentsByBlogId);

function queryCommentsCountByBlogId(request, response) {
    var params = url.parse(request.url, true).query;
    commentDao.queryCommentsCountByBlogId(parseInt(params.bid), function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
    })
}

path.set("/queryCommentsCountByBlogId", queryCommentsCountByBlogId);

function queryNewComments(request, response) {
    commentDao.queryNewComments(5, function (result) {
        formatUtil.formatDate(result);
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
    })
}

path.set("/queryNewComments", queryNewComments);

module.exports.path = path;
