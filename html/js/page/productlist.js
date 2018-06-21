scrollBottomInit();
var app = new Vue({
    el: '#app',
    data: {
        msg: '',
        msgDisplay: false,
        data: [],
        datalength: 1,
        page: 1
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
        },
        getDatas: function () {
            var _this = this

            // 底部下拉加载出现
            if (this.page > 1) this.loadingShow();
            // 获取产品列表
            $.xhrGet('product/' + this.id + '/list.shtml', {
                pageNum: this.page,
                count: 9
            }, function (data) {
                if (data.success) {
                    //下拉加载样式
                    handleLoad(_this, data);

                    for (var i = 0; i < data.data.length; i++) {
                        _this.data.push(data.data[i]);
                    }
                    _this.page++;
                    // 更新总数据长度
                    _this.datalength = _this.data.length;
                }
            });
        }
    },
    mounted: function () {
    },
    created: function () {
        this.getDatas();
    }
})



