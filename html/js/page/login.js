function plusReady () {
  // 获取登录认证通道
  plus.oauth.getServices(function (services) {
    for (var i in services) {
      var service = services[i];
      app.auths[service.id] = service;
    }
  }, function (e) {
    //alert("获取登录认证失败："+e.message);
  });
}
document.addEventListener('plusready', plusReady, false);




var app = new Vue({
  el: '#app',
  data: function () {
    return {
      auths: [],
      form: {
        user: '',
        pwd: '',
        code: ''
      },
      codeSrc: '',
      msg: '',
      msgDisplay: false,
      rule: {
        user: [
          { required: true, message: '用户名不得为空' }
        ],
        pwd: [
          { required: true, message: '密码不得为空' }
        ],
        code: [
          { required: true, message: '验证码不得为空' }
        ]
      }
    }
  },
  computed: {
  },
  methods: {
    clicked: function (id) {
      clicked(id)
    },
    generateImgCode: function () {
      this.codeSrc = BASEURL + 'captcha/image.shtml?session=' + localStorage.getItem('session') + '&_=' + (new Date()).getTime()
    },
    login: function () {
      var _this = this;
      if (!this.validate()) return;
      // 登陆
      $.xhrPost('user/login.shtml', {
        username: this.form.user,
        password: this.form.pwd,
        rememberMe: 'true',
        imageCode: this.form.code
      }, function (data) {
        _this.errorMsg(data.message);
        if (data.success) {
          // 跳转
          if (data.success) {
            //储存用户名和密码
            localStorage.setItem('user', _this.form.user);
            localStorage.setItem('pwd', _this.form.pwd);

            _this.errorMsg('登录成功');
            // 跳转
            clicked('/index.html');
          } else {
            _this.errorMsg(data.message);
          }
        } else {
          _this.generateImgCode();
        }
      })
    },
    // 登录认证
    authLogin: function (id) {
      // return;
      //alert("----- 登录认证 -----");
      var auth = app.auths[id];
      if (auth) {
        var w = null;
        if (plus.os.name == "Android") {
          w = plus.nativeUI.showWaiting();
        }
        document.addEventListener("pause", function () {
          setTimeout(function () {
            w && w.close(); w = null;
          }, 2000);
        }, false);
        auth.login(function () {
          w && w.close(); w = null;
          //alert("登录认证成功：");
          //alert(JSON.stringify(auth.authResult));
          app.userinfo(auth);
        }, function (e) {
          w && w.close(); w = null;
          //alert("登录认证失败：");
          //alert("["+e.code+"]："+e.message);
        });
      } else {
        //alert("无效的登录认证通道！");
        //plus.nativeUI.alert("无效的登录认证通道！",null,"登录");
      }
    },
    // 获取用户信息
    userinfo: function (a) {
      a.getUserInfo(function () {
        //alert("获取用户信息成功：");
        alert(JSON.stringify(a.userInfo));
        var nickname = a.userInfo.nickname || a.userInfo.name || a.userInfo.miliaoNick;
        //plus.nativeUI.alert("欢迎“"+nickname+"”登录！");
      }, function (e) {
        //alert("获取用户信息失败：");
        //alert("["+e.code+"]："+e.message);
        //plus.nativeUI.alert("获取用户信息失败！",null,"登录");
      });
    },
    // 注销登录
    logoutAll: function () {
      //alert("----- 注销登录认证 -----");
      for (var i in auths) {
        app.logout(app.auths[i]);
      }
    },
    logout: function (auth) {
      auth.logout(function () {
        //alert("注销\""+auth.description+"\"成功");
      }, function (e) {
        //alert("注销\""+auth.description+"\"失败："+e.message);
      });
    }
  },
  mounted: function () {
    if (!$.getUrlData().toLogin) {
      this.errorMsg('您还未登录，请先登录');
    }
  },
  created: function () {
    //默认填充老的
    this.form.user = localStorage.getItem('user');
    this.form.pwd = localStorage.getItem('pwd');
    this.generateImgCode();
  }
})


