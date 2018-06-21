var app = new Vue({
    el: '#app',
    data: {
        content: ''
    },
    methods: {
        clicked: function (id) {
            clicked(id)
        }
    },
    created: function () {
        var _this = this
        //轮播图
        $.xhrGet('article/getAboutArticle.shtml?columnId=25', {}, function (data) {
            if (data.success) {
                _this.content = data.data.content;
            }
        })

    },
    mounted: function () {
    }
})


