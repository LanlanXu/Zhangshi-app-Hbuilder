var app = new Vue({
    el: '#app',
    data: {
        msg: '',
        msgDisplay: false,
        detail: null
    },
    computed: {
        id: function () {
            return $.getUrlData().id
        }
    },
    methods: {
        errorMsg: function (msg) {
            this.msg = msg
            this.$refs['msg'].loadErrorMsg()
        },
        clicked: function (id) {
            clicked(id)
        }
    },
    mounted: function () {
    },
    created: function () {
        var _this = this;

        // 获取文章详情
        $.xhrGet('article/detail/' + this.id + '.shtml', {
            articleId: this.id
        }, function (data) {
            if (data.success) {
                _this.detail = data.data
            }
        });
    }
})



