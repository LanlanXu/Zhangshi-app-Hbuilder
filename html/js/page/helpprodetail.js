var app = new Vue({
    el: '#app',
    data: {
        shares: null,
        detail: null, //status 1：未筹款 2：筹款中 3：结束
        relationshipWord: '',
        heightAuto1: false,
        heightAuto2: false,
        page: 1,
        helpList: [],
        pingReplierName: null,
        pingDis: false,
        pingCont: '',
        pingDynamicId: null,
        pingReplierId: null, // 评价时针对的回复者的id
        pingReplierName: null,
        msg: '',
        msgDisplay: false
    },
    computed: {
        id: function () {
            return $.getUrlData().id
        }
    },
    methods: {
        clicked: function (id) {
            //   if(this.detail.status !== 2) return;
            clicked(id)
        },
        goAuto: function () {
            if (this.detail.status !== 2) return;
            if (!$.checklogin()) return;
            clicked('/realnameauth.html?id=' + this.id)
        },
        guanzhu: function () {
            var _this = this
            $.xhrPost('help/attention/' + this.id + '.shtml', {}, function (data) {
                if (data.success) {
                    _this.detail.attention = data.data;
                    data.data ? _this.detail.attentionCount++ : _this.detail.attentionCount--;
                }
            })
        },
        closePing: function (id) {
            var datas = this.helpList;
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].id == id) {
                    datas[i].pingDisplay = false;
                    break;
                }
            }
            this.pingDis = false;
        },
        openPing: function (id, replierId, name) {
            if (this.detail.status !== 2) return;
            this.pingDynamicId = id;
            this.pingReplierId = replierId;
            this.pingReplierName = name;

            var datas = this.helpList,
                _this = this;
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].id == id) {
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
            $.xhrGet('help/reply/' + this.pingDynamicId + '.shtml', {
                donateInfoId: this.pingDynamicId,
                content: this.pingCont,
                receiverId: this.pingReplierId,
                parentId: null
            }, function (data) {
                if (data.success) {
                    var datas = _this.helpList;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].pingDisplay = false;
                        if (datas[i].id == _this.pingDynamicId) {
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
        openPhoto: function (index, str) {

            // plus.nativeUI.previewImage(this.detail[str], {
            //     current: index
            // });
            var obj = {
                imgs: this.detail[str], // 图片列表
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
        /**
           * 更新分享服务
           */
        updateSerivces: function () {
            var _this = this;
            plus.share.getServices(function (s) {
                _this.shares = {};
                for (var i in s) {
                    var t = s[i];
                    _this.shares[t.id] = t;
                }
            }, function (e) {
                //alert('获取分享服务列表失败：'+e.message);
            });
        },
        // 分析链接
        shareHref: function () {
            // return;
            var shareBts = [],
                _this = this;
            // 更新分享列表
            var ss = this.shares['weixin'];
            ss && ss.nativeClient && (shareBts.push({ title: '微信朋友圈', s: ss, x: 'WXSceneTimeline' }),
                shareBts.push({ title: '微信好友', s: ss, x: 'WXSceneSession' }));
            ss = this.shares['qq'];
            ss && ss.nativeClient && shareBts.push({ title: 'QQ', s: ss });
            // 弹出分享列表
            shareBts.length > 0 ? plus.nativeUI.actionSheet({ title: '分享链接', cancel: '取消', buttons: shareBts }, function (e) {
                (e.index > 0) && _this.shareAction(shareBts[e.index - 1]);
            }) : plus.nativeUI.alert('当前环境无法支持分享链接操作!');
        },
        shareAction: function (sb) {
            //alert('分享操作：');
            var _this = this;
            if (!sb || !sb.s) {
                //alert('无效的分享服务！');
                return;
            }
            var msg = {
                extra: { scene: sb.x },
                href: 'http://www.hubeizhangshi.com/helpprodetail/helpprodetail.html?id=' + this.id,//
                title: this.detail.title,
                content: this.detail.content,
                // thumbs: this.detail.projectImageUrls
                // pictures: this.detail.projectImageUrls,
                // pictures: 
            };
            // 发送分享
            if (sb.s.authenticated) {
                //alert('---已授权---');
                this.shareMessage(msg, sb.s);
            } else {
                //alert('---未授权---');
                sb.s.authorize(function () {
                    _this.shareMessage(msg, sb.s);
                }, function (e) {
                    //alert('认证授权失败：'+e.code+' - '+e.message);
                });
            }
        },
        /**
         * 发送分享消息
         * @param {JSON} msg
         * @param {plus.share.ShareService} s
         */
        shareMessage: function (msg, s) {
            //alert(JSON.stringify(msg));
            s.send(msg, function () {
                //alert('分享到"'+s.description+'"成功！');
            }, function (e) {
                //alert('分享到"'+s.description+'"失败: '+JSON.stringify(e));
            });
        }
    },
    created: function () {
        var _this = this

        // 求助详情
        $.xhrPost('help/detail/' + this.id + '.shtml', {}, function (data) {
            if (data.success) {
                _this.detail = data.data
                localStorage.setItem('helpTitle', _this.detail.title);
                switch (data.data.relationship) { // relationship;// 收款人关系：1、本人；2、直系亲属；3、夫妻；4、公益组织
                    case 1:
                        _this.relationshipWord = '本人'; break;
                    case 2:
                        _this.relationshipWord = '直系亲属'; break;
                    case 3:
                        _this.relationshipWord = '夫妻'; break;

                }
            }
        })
        $.xhrGet('help/donate/list/' + this.id + '.shtml', {
            helpId: this.id,
            count: 10000,
            pageNum: this.page
        }, function (data) {
            if (data.success) {
                for (var i = 0; i < data.data.length; i++) {
                    data.data[i].pingDisplay = false
                    data.data[i].maskTop = 0
                    data.data[i].maskBto = 0
                    _this.helpList.push(data.data[i]);
                }
            }
        })
    },
    mounted: function () {
    }
});
// H5 plus事件处理
function plusReady () {
    app.updateSerivces();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}


