var randomTags = new Vue({
    el: "#random_tags",
    data: {
        tags: []
    },
    computed: {
        randomColor: function () {
            return function () {
                var red = Math.random() * 255 + 50;
                var green = Math.random() * 255 + 50;
                var blue = Math.random() * 255 + 50;
                return "rgb(" + red +  ", " + green + ", " + blue + ")";
            }
        },
        randomSize: function () {
            return function () {
                var size = Math.random() * 12 + 12 + "px";
                return size;
            }
        }
    },
    created: function () {
        axios({
            method: "get",
            url: "/queryRandomTags"
        }).then(function (resp) {
            var result = [];
            for (var i = 0; i < resp.data.data.length; i ++) {
                var temp = {};
                temp.text = resp.data.data[i].tag;
                temp.link = "/?tag=" + resp.data.data[i].tag;
                result.push(temp);
            }
            randomTags.tags = result;
        });
    }
});

var newHot = new Vue({
    el: "#new_hot",
    data: {
        titleList: []
    },
    created: function () {
        axios({
            method: "get",
            url: "/queryHotBlog"
        }).then(function (resp) {
            var result = [];
            for (var i = 0; i < resp.data.data.length; i ++) {
                var temp = {};
                temp.title = resp.data.data[i].title;
                temp.link = "/blog_detail.html?bid=" + resp.data.data[i].id;
                result.push(temp);
            }
            newHot.titleList = result;
        });
    }
});

var newComments = new Vue({
    el: "#new_comments",
    data: {
        commentList: []
    },
    created: function () {
        axios({
            method: "get",
            url: "/queryNewComments"
        }).then(function (resp) {
            var result = [];
            for (var i = 0; i < resp.data.data.length; i ++) {
                var temp = {};
                temp.name = resp.data.data[i].user_name;
                temp.date = resp.data.data[i].ctime;
                temp.content = resp.data.data[i].content;

                if (resp.data.data[i].blog_id == -1) {
                    temp.link = "/about.html?cid=" + resp.data.data[i].id;
                }else if (resp.data.data[i].blog_id == -2) {
                    temp.link = "/guestbook.html?gid=" + resp.data.data[i].id;
                }else {
                    temp.link = "/blog_detail.html?bid=" + resp.data.data[i].blog_id;
                }
                result.push(temp);
            }
            newComments.commentList = result;
        });
    }
});