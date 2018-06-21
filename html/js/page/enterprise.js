var app = new Vue({
    el: '#app',
    data: {
        msg: '',
        msgDisplay: false,
        detail: null,
        proList: []
    },
    computed: {
        id: function(){
            return $.getUrlData().id
        }
    },
    methods: {
        errorMsg: function(msg){
            this.msg = msg
            this.$refs['msg'].loadErrorMsg()
        },
        clicked: function(id){
            clicked(id)
        }
    },
    mounted: function(){
    },
    created: function(){
        var _this = this;
        // 获取企业详情
        $.xhrGet('company/detail/' + this.id + '.shtml', {}, function(data){
            if(data.success){
                _this.detail = data.data
            }
        });

        // 获取产品列表
        $.xhrGet('product/' + this.id + '/list.shtml', {
            pageNum: 1,
            count: 10
        }, function(data){
            if(data.success){
                _this.proList = data.data
            }
        });
    }
})



