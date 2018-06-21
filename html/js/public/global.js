(function () {
    var screenW = document.body.clientWidth,
        style = document.createElement('style'),
        size = (screenW / 640) * 24,  //则在iPhone4下，基准字体为12px
        styles = 'html{font-size:' + size + 'px !important;}';
    GLOBALSIZE = size;
    (document.getElementsByTagName("head")[0] || document.body).appendChild(style);
    if (style.styleSheet) {
        style.styleSheet.cssText = styles;
    }
    else {
        style.appendChild(document.createTextNode(styles));
    }
})()

var BASEIP = 'http://120.79.174.241/',
    BASEURL = BASEIP + 'mrz.api/';
$.extend($, {
    handleResponseHeader: function (jqXHR) {
        var session = jqXHR.getResponseHeader('session');
        var rememberme = jqXHR.getResponseHeader('remember-me');

        jqXHR.getResponseHeader('clear-session') ? localStorage.setItem('session', '') : '';
        jqXHR.getResponseHeader('clear-remember') ? localStorage.setItem('rememberme', '') : '';

        session ? localStorage.setItem('session', session) : '';
        rememberme ? localStorage.setItem('rememberme', rememberme) : '';
    },
    xhrPost: function (action, options, callback) {
        var requestHeader = {};
        localStorage.getItem('session') ? requestHeader.session = localStorage.getItem('session') : '';
        localStorage.getItem('rememberme') ? requestHeader['remember-me'] = localStorage.getItem('rememberme') : '';

        $.ajax({
            type: 'POST',
            headers: requestHeader,
            url: BASEURL + action,
            data: options,
            traditional: true,
            beforeSend: function () {
                // plus.nativeUI.showWaiting('',{style:'black',modal:false,background:'rgba(0,0,0,0)'});
            },
            complete: function (jqXHR) {
                // plus.nativeUI.closeWaiting();
                $.handleResponseHeader(jqXHR);
            },
            success: function (json) {
                if (json.code == 7) {
                    clicked('/login.html');
                } else {
                    callback(json);
                }
            },
            dataType: 'json'
        });
    },
    xhrGet: function (action, options, callback) {
        var requestHeader = {};
        localStorage.getItem('session') ? requestHeader.session = localStorage.getItem('session') : '';
        localStorage.getItem('rememberme') ? requestHeader['remember-me'] = localStorage.getItem('rememberme') : '';
        $.ajax({
            type: 'GET',
            headers: requestHeader,
            url: BASEURL + action,
            data: options,
            traditional: true,
            beforeSend: function () {
                // plus.nativeUI.showWaiting('',{style:'black',modal:false,background:'rgba(0,0,0,0)'});
            },
            complete: function (jqXHR) {
                // plus.nativeUI.closeWaiting();
                $.handleResponseHeader(jqXHR);
            },
            success: function (json) {
                if (json.code == 7) {
                    clicked('/login.html');
                } else {
                    callback(json);
                }
            },
            dataType: 'json'
        });
    },
    xhrPostPay: function (action, options, callback) {
        var requestHeader = {};
        localStorage.getItem('session') ? requestHeader.session = localStorage.getItem('session') : '';
        localStorage.getItem('rememberme') ? requestHeader['remember-me'] = localStorage.getItem('rememberme') : '';
        $.ajax({
            type: 'POST',
            headers: requestHeader,
            url: BASEURL + action,
            data: options,
            traditional: true,
            beforeSend: function () {
                // plus.nativeUI.showWaiting('',{style:'black',modal:false,background:'rgba(0,0,0,0)'});
            },
            complete: function (jqXHR) {
                // plus.nativeUI.closeWaiting();
                $.handleResponseHeader(jqXHR);
                callback(jqXHR);
            },
            success: function (json) {
            },
            dataType: 'json'
        });
    },
    getUrlData: function () {
        var url = decodeURI(window.location.href),
            urlstr = url.split('?')[1];
        if (urlstr) {
            var urlarr = urlstr.split('&'),
                data = {};
            $(urlarr).each(function () {
                var arr = (this + '').split('=');
                data[arr[0]] = arr[1];
            });
            return data;
        }
        else {
            return false;
        }
    },
    checklogin: function () {
        localStorage.getItem('rememberme') ? '' : clicked('/login.html');
        return !!localStorage.getItem('rememberme');
    }
});

/* 全局error组件 */
Vue.component('error-msg', {
    // 选项
    template: '<div class="msg" v-if="msgSec">{{msg}}</div>',
    props: ['msg'],
    data: function () {
        return {
            errorDefaultSec: 2, // 报错默认倒计时消失时间
            msgSec: 0, // 显示的控制
            errorMsg: '', // 错误信息
            msgTimer: '' // 错误信息计时器
        }
    },
    methods: {
        loadErrorMsg: function () {
            clearInterval(this.msgTimer)
            var _this = this
            this.msgSec = this.errorDefaultSec
            this.errorMsg = this.msg
            this.msgTimer = setInterval(function () {
                if (!_this.msgSec) {
                    clearInterval(_this.msgTimer)
                } else {
                    _this.msgSec--
                }
            }, 1000)
        }
    }
});
/* 全局校验方法 */
Vue.prototype.errorMsg = function (msg) {
    this.msg = msg
    this.$refs['msg'].loadErrorMsg()
};

// var imgUrl = '../';
// if (window.plus) {
//     plusReady();
// } else {
//     document.addEventListener("plusready", plusReady, false);
// }
// function plusReady () {
//     if (!/childwebview/.test(window.location.href)) {
//         imgUrl = '';
//     }
// }
Vue.component('load-more', {
    // 选项
    template: '<div><div class="no-data" v-if="!datalength"><img :src="imgUrl" alt="" class="no-data-img"><p class="no-data-msg">没有数据哦!</p></div><div class="loading" v-if="loading"><img :src="gifUrl" alt="" class="loading-img"><span class="loading-msg">正在加载...</span></div><div class="loading" v-if="loadingEnd"><span class="loading-msg">已加载到底了，没有数据了！</span></div></div>',
    props: ['datalength'],
    data: function () {
        return {
            loading: false,
            loadingEnd: false,
            timer: null,
            imgUrl: '../img/nodata.png',
            gifUrl: '../img/loading.gif'
        }
    },
    methods: {
        _loadingShow: function () {
            this.loading = true;
            clearInterval(this.timer);
            this.loadingEnd = false;
        },
        _loadToEnd: function () {
            if (this.timer) clearInterval(this.timer);
            var _this = this;
            this.loading = false;
            this.loadingEnd = true;
            this.timer = setTimeout(function () {
                _this.loadingEnd = false;
            }, 3000);
        },
        _loadStop: function () {
            if (this.timer) clearInterval(this.timer);
            this.loading = false;
            this.loadingEnd = false;
        }
    },
    mounted: function () {
        try {
            if (!/childwebview/.test(window.location.href)) {
                this.imgUrl = 'img/nodata.png';
                this.gifUrl = 'img/loading.gif';
            }
        } catch (ex) { }
    }
});
/* 全局校验方法 */
Vue.prototype.loadToEnd = function () {
    this.$refs['load']._loadToEnd()
};
Vue.prototype.loadingShow = function () {
    if (this.$refs['load']) this.$refs['load']._loadingShow()
};
Vue.prototype.loadingStop = function () {
    if (this.$refs['load']) this.$refs['load']._loadStop()
};
// 注册一个全局自定义指令 'v-focus'
Vue.directive('focus', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el) {
        // 聚焦元素
        el.focus()
    }
})

Vue.prototype.validate = function (arr) {
    var bool = true;
    for (item in this.rule) {
        var value = this.form[item],
            rules = this.rule[item];
        if (!bool) break;
        if (arr && arr.indexOf(item) == -1) continue;
        for (var i = 0; i < rules.length; i++) {
            if (rules[i].required) {
                if (!value) {
                    this.errorMsg(rules[i].message)
                    bool = false;
                    break;
                }
            } else if (rules[i].validator) {
                if (!rules[i].validator(value)) {
                    bool = false;
                    break;
                }
            } else if (rules[i].regExp) {
                if (!rules[i].regExp.test(value)) {
                    this.errorMsg(rules[i].message)
                    bool = false;
                    break;
                }
            }
        }
    }
    return bool;
}
/* 全局上传图片 */
Vue.prototype.uploadImg = function (event, i, success, fail, url) {
    var _this = this;
    var formData = new FormData();
    formData.append('file', event.target.files[i ? i : 0]);
    var requestHeader = {};
    localStorage.getItem('session') ? requestHeader.session = localStorage.getItem('session') : '';
    localStorage.getItem('rememberme') ? requestHeader['remember-me'] = localStorage.getItem('rememberme') : '';
    $.ajax({
        url: BASEURL + (url ? url : 'atta/upload.shtml'),
        type: 'POST',
        headers: requestHeader,
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function () {
            // plus.nativeUI.showWaiting('',{style:'black',modal:false,background:'rgba(0,0,0,0)'});
        },
        complete: function (jqXHR) {
            // plus.nativeUI.closeWaiting();
            $.handleResponseHeader(jqXHR);
        }
    }).done(function (res) {
        if (success) success(res);
    }).fail(function (res) {
        if (fail) fail(res);
    });
}

/* 全局处理金额以逗号隔开 */
Vue.prototype.splitByComma = function (str) {
    return str.toString().split('').reverse().join('').match(/(^\d+\.)|\d{3}|\d+$/g).join(',').replace(/\.,/, '.').split('').reverse().join('');
}
/* 全局处理日期 */
Vue.prototype.formatDate = function (num) {
    var date;
    if (/-/.test(num)) {
        num = num.replace(/-/g, '/').slice(0, -2)
        date = new Date(num);
    } else {
        date = new Date(num);
    }
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-').replace(/-(\d(?!\d))/g, '-0$1') || ''
}


window.confirm = function (name) {
    var iframe = document.createElement("IFRAME");
    iframe.style.display = "none";
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    var result = window.frames[0].window.confirm(name);
    iframe.parentNode.removeChild(iframe);
    return result;
}

function scrollBottomInit () {
    if (window.plus) {
        plusReady();
    } else {
        document.addEventListener("plusready", plusReady, false);
    }
    function onScrollToBottom () {
        app.getDatas()
    }
    function plusReady () {
        document.addEventListener("plusscrollbottom", onScrollToBottom, false);
    }
    // document.addEventListener('scroll', function () {
    //     if (document.body.scrollTop + window.innerHeight == document.body.clientHeight + $('.change-type').height() + $('.info-modify').height()) {
    //         app.getDatas()
    //     }
    // }, false);
}

function handleLoad (obj, data) {
    // 当总数据不为0 ，且下一页无数据的时候，加载到底
    var str = 'data';
    if (!data.hasOwnProperty('data')) {
        str = 'rows';
    }
    if (obj.data.length && !data[str].length) {
        obj.loadToEnd();
    }
}
