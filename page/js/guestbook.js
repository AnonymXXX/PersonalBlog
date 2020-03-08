var blogComments = new Vue({
    el: "#blog_comments",
    data: {
        total: 0,
        comments: []
    },
    computed: {
        reply: function () {
            return function (commentId, userName) {
                document.getElementById("comment_reply").value = commentId;
                document.getElementById("comment_reply_name").value = userName;
                location.href = "#send_comment";
            }
        }
    },
    created: function () {
        var bid = -2;

        axios({
            method: "get",
            url: "/queryCommentsByBlogId?bid=" + bid
        }).then(function (resp) {
            blogComments.comments = resp.data.data;
            for (var i = 0 ; i < blogComments.comments.length ; i ++) {
                if (blogComments.comments[i].parent > -1) {
                    blogComments.comments[i].options = "回复@" + blogComments.comments[i].parent_name;
                }
            }
        }).catch(function (resp) {
            console.log("请求错误");
        });

        axios({
            method: "get",
            url: "/queryCommentsCountByBlogId?bid=" + bid
        }).then(function (resp) {
            blogComments.total = resp.data.data[0].count;
        }).catch(function (resp) {
            console.log("请求错误");
        });
    }
});

var sendComment = new Vue({
    el: "#send_comment",
    data: {
        code: "",
        rightCode: ""
    },
    computed: {
        changeCode: function () {
            return function () {
                axios({
                    method: "get",
                    url: "/queryRandomCode"
                }).then(function (resp) {
                    sendComment.code = resp.data.data.data;
                    sendComment.rightCode = resp.data.data.text;
                });
            }
        },
        sendComment: function () {
            return function () {
                var code = document.getElementsByClassName("comment_code")[0];
                if (sendComment.rightCode != code.value) {
                    alert("验证码错误");
                    code.value = "";
                    this.changeCode();
                    return;
                }

                var bid = -2;
                var reply = document.getElementById("comment_reply").value;
                var replyName = document.getElementById("comment_reply_name").value;
                var name = document.getElementsByClassName("comment_name")[0].value;
                var email = document.getElementsByClassName("comment_email")[0].value;
                var content = document.getElementsByClassName("comment_content")[0].value;

                axios({
                    method: "get",
                    url: "/sendComment?bid=" + bid + "&parent=" + reply + "&name=" + name + "&email=" + email + "&content=" + content + "&parentName=" + replyName
                }).then(function (resp) {
                    alert(resp.data.msg);
                    location.reload();
                }).catch(function (resp) {
                    console.log("请求失败");
                });
            }
        }
    },
    created: function () {
        this.changeCode();
    }
});