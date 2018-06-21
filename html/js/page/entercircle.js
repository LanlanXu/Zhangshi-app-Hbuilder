scrollBottomInit();

var app = new Vue({
  el: '#app',
  data: {
    data: [],
    selectBool: false, // 选择类型层显示的控制
    typeList: [],
    types: '选择类型', // 默认文字
    typesId: '', // 检索的类型传值
    searchCon: '', // 搜索内容
    datalength: 1,
    page: 1
  },
  computed: {
  },
  methods: {
    clicked: function (id) {
      clicked(id)
    },
    openSelect: function () {
      this.selectBool = true;
      this.initSelect();
    },
    closeSelect: function () {
      this.selectBool = false;
    },
    initSelect: function () {
      for (var i = 0; i < this.typeList.length; i++) {
        this.typeList[i].choosed = false;
      }
    },
    getTypes: function () {
      var str = [],
        ids = [];
      for (var i = 0; i < this.typeList.length; i++) {
        if (this.typeList[i].choosed) {
          str.push(this.typeList[i].name);
          ids.push(this.typeList[i].id);
        }
      }

      this.types = str.length ? str.join('和') : '选择类型';
      this.typesId = ids.join(',');

      this.selectBool = false;
      this.search();
    },
    /* 查询列表 */
    search: function () {
      this.page = 1;
      this.data = [];
      this.getDatas();
    },
    getDatas: function () {
      var _this = this;
      // 底部下拉加载出现
      if (this.page > 1) this.loadingShow();
      // 企业列表
      $.xhrGet('company/list.shtml', {
        pageNum: this.page,
        count: 10,
        type: this.typesId, //企业类型，可选
        search: this.searchCon
      }, function (data) {
        if (data.success) {

          //下拉加载样式
          handleLoad(_this, data);
          for (var i = 0; i < data.data.length; i++) {
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
    $('#layer').attr('style', '')
  },
  created: function () {
    $('#layer').attr('style', '')
    var _this = this
    // 获取企业列表
    this.search();

    // 获取企业类型
    $.xhrGet('companyType/list.shtml', {}, function (data) {
      for (var index in data.data) {
        data.data[index].choosed = false
      }
      _this.typeList = data.data
    });
  }
})






