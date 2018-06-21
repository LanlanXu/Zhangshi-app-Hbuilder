var app = new Vue({
    el: '#app',
    data: {
        msg: '',
        msgDisplay: false,
        confirmList: [],
        relationshipList: ['亲人', '朋友', '邻居', '同事', '老师', '同学', '病友', '志愿者', '项目参与者'],
        total: 0
    },
    computed: {
        id: function () {
            return $.getUrlData().id
        },
        disabled: function () {
            return $.getUrlData().disabled == 'true'
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
            if (this.disabled) return;
            if (!$.checklogin()) return;
            clicked('/realnameauth.html?id=' + this.id)
        }
    },
    mounted: function () {
    },
    created: function () {
        var _this = this;

        // 证实列表
        $.xhrGet('help/listVerify.shtml', {
            pageNum: 1,
            count: 10,
            helpId: this.id
        }, function (data) {
            if (data.success) {
                _this.confirmList = data.data
                _this.total = data.count
            }
        });
    }
})



