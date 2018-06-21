var app = new Vue({
    el: '#app',
    data: {
        msg: '',
        msgDisplay: false,
        detail: null
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

        // 获取产品列表
        $.xhrGet('product/detail/' + this.id + '.shtml', {
        }, function(data){
            if(data.success){
                _this.detail = data.data
            }
        });
    }
})



