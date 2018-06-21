var app = new Vue({
    el: '#app',
    data: {
        msg: '',
        msgDisplay: false,
        helpList: [],
        topThree: [1, 0, 2]
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
        },
        back: function(){
            history.back();
        }
    },
    mounted: function(){
    },
    created: function(){
        var _this = this;

        // 爱心贡献列表
        $.xhrGet('help/love.shtml', {
            helpId: this.id,
            count: 8,
            pageNum: 1
        }, function(data){
            if(data.success){
                console.log(data)
                _this.helpList = data.data
            }
        });
    }
})



