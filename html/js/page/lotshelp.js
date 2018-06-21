scrollBottomInit();
var app = new Vue({
    el: '#app',
    data: {
        msg: '',
        msgDisplay: false,
        dataList: [],
        dataDone: [],
        data: [],
        datalength: 1,
        page: 1,
        calls: 0
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
            this.calls = 0
            var _this = this

            // 底部下拉加载出现
            if (this.page > 1) this.loadingShow();
            // 求助列表
            $.xhrGet('help/list.shtml', {
                pageNum: this.page,
                count: 6,
                type: ''
            }, function (data) {
                if (data.success) {
                    // data.data = [{
                    //     targetAmount: 1,
                    //     amount: 1
                    // }];
                    //下拉加载样式
                    handleLoad(_this, data);

                    for (var i = 0; i < data.data.length; i++) {
                        _this.dataList.push(data.data[i]);
                        _this.data.push(data.data[i]);
                    }

                    _this.calls++;
                    _this.callbacks(data.data.length);

                }
            });
            // 底部下拉加载出现
            // if(this.page > 1) this.loadingShow();
            // 求助列表
            $.xhrGet('help/listDone.shtml', {
                pageNum: this.page,
                count: 6,
                type: ''
            }, function (data) {
                if (data.success) {
                    //下拉加载样式
                    handleLoad(_this, data);

                    for (var i = 0; i < data.data.length; i++) {
                        _this.dataDone.push(data.data[i]);
                        _this.data.push(data.data[i]);
                    }

                    _this.calls++;
                    _this.callbacks(data.data.length);
                }
            });
        },
        callbacks: function (page) {
            if (this.page == 1) this.datalength = 0;
            // 更新总数据长度
            this.datalength += page;
            if (this.calls == 1) {
                this.page++;
            }
        }
    },
    mounted: function () {
    },
    created: function () {
        this.getDatas();
    }
})



