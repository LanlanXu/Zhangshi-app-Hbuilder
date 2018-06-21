scrollBottomInit();

var app = new Vue({
    el: '#app',
    data: {
        data: [],
        pingDynamicId: null, // 评价时针对的动态id
        pingReplierId: null, // 评价时针对的回复者的id
        pingReplierName: null,
        pingDis: false, // 是否可以提交 
        pingCont: '', // 回复的内容
        inputClear: '',
        msg: '',
        msgDisplay: false,
        datalength: 1,
        page: 1
    },
    computed: {
    },
    methods: {
        clicked: function (id) {
            clicked(id)
        },
        zan: function (id) {
            var _this = this
            // 获取企业类型
            $.xhrPost('dynamic/like/' + id + '.shtml', {
                dynamicId: id
            }, function (data) {
                if (data.success) {
                    var datas = _this.data;
                    for (var i = 0; i < datas.length; i++) {
                        if (datas[i].dynamic.id == id) {
                            datas[i].like = !datas[i].like;
                            datas[i].likes = data.data.likes;
                            datas[i].optDisplay = false;
                            break;
                        }
                    }

                }
            });
        },
        openOpts: function (id) {
            var datas = this.data,
                _this = this;
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].dynamic.id == id) {
                    datas[i].optDisplay = true;
                    this.$nextTick(function () {
                        var obj = _this.$refs['opts' + i][0];
                        datas[i].maskTopOpts = obj.getBoundingClientRect().top + document.documentElement.scrollTop;
                        var h = document.body.clientHeight > _this.$refs['body'].offsetHeight ? document.body.clientHeight : _this.$refs['body'].offsetHeight;
                        datas[i].maskBtoOpts = h - obj.offsetHeight - (obj.getBoundingClientRect().top + document.body.scrollTop);
                    });
                    break;
                }
            }
        },
        closeOpts: function (id) {
            var datas = this.data;
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].dynamic.id == id) {
                    datas[i].optDisplay = false;
                    break;
                }
            }
        },
        openPing: function (id, replierId, name) {
            this.inputClear = '';
            this.pingDynamicId = id;
            this.pingReplierId = replierId;
            this.pingReplierName = name;

            var datas = this.data,
                _this = this;
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].dynamic.id == id) {
                    datas[i].optDisplay = false;
                    datas[i].pingDisplay = true;
                    this.$nextTick(function () {
                        var obj = _this.$refs['ping' + i][0];
                        datas[i].maskTop = obj.offsetTop;
                        var h = document.body.clientHeight > _this.$refs['body'].offsetHeight ? document.body.clientHeight : _this.$refs['body'].offsetHeight;
                        datas[i].maskBto = h - obj.offsetHeight - obj.offsetTop;
                    });
                    break;
                }
            }
        },
        closePing: function (id) {
            var datas = this.data;
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].dynamic.id == id) {
                    datas[i].pingDisplay = false;
                    break;
                }
            }
            this.pingDis = false;
        },
        inputPing: function (str) {
            str = str.trim()
            if (str.length) {
                this.pingDis = true;
                this.pingCont = str;
            } else {
                this.pingDis = false;
            }
        },
        ping: function () {
            var _this = this
            if (!this.pingDis) return;
            $.xhrGet('dynamic/reply/' + this.pingDynamicId + '.shtml', {
                dynamicId: this.pingDynamicId,
                content: this.pingCont,
                receiverId: this.pingReplierId,
                parentId: this.pingReplierId
            }, function (data) {
                if (data.success) {
                    var datas = _this.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].pingDisplay = false;
                        if (datas[i].dynamic.id == _this.pingDynamicId) {
                            datas[i].replys.push({
                                content: _this.pingCont,
                                receiverName: _this.pingReplierName,
                                replierName: data.data.replierNickName
                            });
                            break;
                        }
                    }
                }
                _this.errorMsg(data.message);
            });
        },
        openPhoto: function (itemIndex, index) {
            // plus.nativeUI.previewImage(this.detail[str], {
            //     current: index
            // });
            var arr = [];
            for (var i = 0; i < this.data[itemIndex].attas.length; i++) {
                arr.push(this.data[itemIndex].attas[i].attaUrl);
            }
            var obj = {
                imgs: arr, // 图片列表
                index: index // 默认显示哪一张
            }
            localStorage.setItem('photos', JSON.stringify(obj));
            var embed = plus.webview.create('/photos.html', 'photos', {
                top: '0px',
                bottom: '0px',
                position: 'dock',
                dock: 'top',
                bounce: 'none',
                background: 'rgba(0,0,0,1)'
            });
            embed.show();
            embed.addEventListener('loaded', function () {
                plus.nativeUI.closeWaiting();

            }, false);
            embed.addEventListener('loading', function () {
                plus.nativeUI.showWaiting('', { style: 'black', modal: false, background: 'rgba(0,0,0,0)' });
            }, false);
        },
        getDatas: function () {
            var _this = this

            // 底部下拉加载出现
            if (this.page > 1) this.loadingShow();
            // 获取企业类型
            $.xhrGet('dynamic/list.shtml', {
                type: '',
                pageNum: this.page,
                count: 30
            }, function (data) {
                if (data.success) {
                    //下拉加载样式
                    handleLoad(_this, data);
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].optDisplay = false
                        data.data[i].pingDisplay = false
                        data.data[i].maskTop = 0
                        data.data[i].maskBto = 0
                        data.data[i].maskTopOpts = 0
                        data.data[i].maskBtoOpts = 0
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
        this.getDatas()
    }
})
