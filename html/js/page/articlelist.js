scrollBottomInit();
var app = new Vue({
    el: '#app',
    data: {
        data: [],
        datalength: 1,
        page: 1
    },
    computed: {
    },
    methods: {
        errorMsg: function(msg){
            this.msg = msg
            this.$refs['msg'].loadErrorMsg()
        },
        clicked: function(id){
            clicked(id)
        },
        getDatas: function(){
            var _this = this

            // 底部下拉加载出现
            if(this.page > 1) this.loadingShow();
            
             $.xhrGet('article/list/top/1.shtml', {
                orgId: 1,
                count: 20,
                page: this.page,
            }, function(data){
                if(data.success){
                    //下拉加载样式
                    handleLoad(_this, data);

                    for (var index in data.data) {
                        data.data[index].publishTime = data.data[index].publishTime.slice(0, 10)
                    }
                    for(var i = 0; i < data.data.length; i++) {
                        _this.data.push(data.data[i]);
                    }
                    
                    _this.page ++;
                    // 更新总数据长度
                    _this.datalength = _this.data.length;
                }
            })
        }
    },
    mounted: function(){
    },
    created: function(){
        this.getDatas()
    }
})



