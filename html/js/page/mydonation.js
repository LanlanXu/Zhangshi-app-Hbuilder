scrollBottomInit();
var app = new Vue({
    el: '#app',
    data: {
        msg: '',
        msgDisplay: false,
        data: [],
        total: 0,
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
        goAuto: function () {
            if (!$.checklogin()) return;
            clicked('/realnameauth.html?id=' + this.id)
        },
        getDatas: function () {
            var _this = this

            // 底部下拉加载出现
            if (this.page > 1) this.loadingShow();
            // 求助列表
            $.xhrGet('help/getMyHelp.shtml', {
            }, function (data) {
                if (data.success) {
                    // data.data = [{
                    //     "id": 1, 
                    //     "donateTime":234242424342,
                    //     "amount":" 金额",
                    //     "donorId":" 捐赠者id",
                    //     "donorNickName":" 捐赠者昵称",
                    //     "helpId":" 求助编号",
                    //     "helperId":" 求着者编号",
                    //     "helperNickName":" 求助者昵称",
                    //     "helperTitle":" 求助主题",
                    //     "helpStatus":3//状态  1筹款，2进行中， 3是完
                    // }]
                    _this.data = data.data;
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





