var pays = {};
function plusReady () {
    // 获取支付通道
    plus.payment.getChannels(function (channels) {
        for (var i in channels) {
            var channel = channels[i];
            if (channel.id != 'wxpay' && channel.id != 'alipay') {	// 仅支持这两种支付方式
                continue;
            }
            pays[channel.id] = channel;
            checkServices(channel);
        }
    }, function (e) {
        //alert('获取支付通道失败：'+e.message);
    });
}
document.addEventListener('plusready', plusReady, false);

// 检测是否安装支付服务
function checkServices (pc) {
    if (!pc.serviceReady) {
        var txt = null;
        switch (pc.id) {
            case 'alipay':
                txt = '检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作，是否立即安装？';
                break;
            default:
                txt = '系统未安装“' + pc.description + '”服务，无法完成支付，是否立即安装？';
                break;
        }
        plus.nativeUI.confirm(txt, function (e) {
            if (e.index == 0) {
                pc.installService();
            }
        }, pc.description);
    }
}

var app = new Vue({
    el: '#app',
    data: {
        msg: '',
        msgDisplay: false,
        w: null,
        form: {
            content: '',
            money: '',
            type: 0
        },
        payType: [
            // {
            //     src: '../img/alipay.png',
            //     title: '支付宝',
            //     key: 'alipay'
            // },
            {
                src: '../img/weixin.png',
                title: '微信支付',
                key: 'wxpay'
            }
        ],
        anonymous: false, // 不同意
        photoList: [],
        num: 0,
        rule: {
            money: [
                { required: true, message: '金额不得为空' }
            ],
            content: [
                { required: true, message: '内容不得为空' }
            ]
        }
    },
    computed: {
        proId: function () {
            return $.getUrlData().id
        }
    },
    methods: {
        updateValue: function (value) {
            var formattedValue = value.replace(/[^0-9\.]/g, '')
            // formattedValue = formattedValue.replace(/0[^\.]/, '0')
            formattedValue = formattedValue.replace(/\.+/, '\.')
            formattedValue = formattedValue.replace(/(\.\d+)\./, '$1')
            formattedValue = formattedValue
                // 删除两侧的空格符
                .trim()
                // 保留 2 位小数
                .slice(
                0,
                formattedValue.indexOf('.') === -1
                    ? formattedValue.length
                    : formattedValue.indexOf('.') + 3
                )
            // 如果值尚不合规，则手动覆盖为合规的值
            if (formattedValue !== value) {
                this.form.money = formattedValue
            }

        },
        pay: function (id) {
            if (this.w) return; //检查是否请求订单中
            // 从服务器请求支付订单  
            var PAYSERVER = '';
            channel = pays[id];
            try {
                this.w = plus.nativeUI.showWaiting();
            } catch (e) { }
            var _this = this;
            // 获取分会
            console.log(JSON.stringify({
                payType: id == 'alipay' ? 1 : 0, //支付类型：0、微信支付；1、支付宝支付 (必填)
                orderDesc: localStorage.getItem('helpTitle'), //订单描述信息
                orderTitle: '千人众筹', //订单标题 (必填)
                orderAmount: _this.form.money, //订单金额 (必填)
                message: _this.form.content, //留言信息
                helpId: _this.proId //订单金额 (必填)
            }));
            $.xhrPostPay('pay/generatePayOrderInfo.shtml', {
                payType: id == 'alipay' ? 1 : 0, //支付类型：0、微信支付；1、支付宝支付 (必填)
                orderDesc: localStorage.getItem('helpTitle'), //订单描述信息
                orderTitle: '千人众筹', //订单标题 (必填)
                orderAmount: _this.form.money, //订单金额 (必填)
                message: _this.form.content, //留言信息
                helpId: _this.proId //订单金额 (必填)
            }, function (data) {
                // console.log(data)
                // console.log(JSON.stringify(pays[id]));
                // console.log(JSON.parse(data.responseText).data);
                try {
                    _this.w.close();
                    _this.w = null;
                } catch (e) { }
                if (data.status == 200) {
                    if (!data.responseJSON.success) {
                        _this.errorMsg(data.responseJSON.message);
                        return;
                    }
                    // outLine('----- 请求订单成功 -----');
                    var order = JSON.parse(data.responseText).data;
                    plus.payment.request(pays[id], order, function (result) {
                        // 刷新项目详情页面
                        if (window.plus) {
                            var helpprodetail = plus.webview.getWebviewById('childwebview/helpprodetail.html?id=' + _this.proId);
                            helpprodetail.loadURL('../childwebview/helpprodetail.html?id=' + _this.proId);
                        }
                        plus.nativeUI.alert('支付成功：感谢你的捐助。', function () {
                            // 刷新项目详情页面
                            if (window.plus) {
                                // 跳转
                                setTimeout(function () {
                                    if (window.plus) {
                                        var page = plus.webview.getWebviewById(window.location.href.match(/\/[^\/]+$/)[0]);
                                        page.close('auto');
                                    }
                                }, 1000);
                            }
                        });
                    }, function (e) {
                        // console.log(JSON.stringify(e));
                        plus.nativeUI.alert('支付失败', null);
                    });
                } else {
                    plus.nativeUI.alert('获取订单信息失败，请稍后再试', null);
                }
            });
        },
        submit: function () {
            var _this = this;
            if (!$.checklogin()) return;
            if (!this.validate()) return;
            this.pay(this.payType[this.form.type].key);
        }
    },
    mounted: function () {
    },
    created: function () {
    }
})




