var app = new Vue({
  el: '#app',
  data: {
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
      id: function(){
          return $.getUrlData().id
      }
  },
  methods: {
      clicked: function(id){
        //   if(this.detail.status !== 2) return;
          window.location.href = id;
      },
      goAuto: function(){
          if(this.detail.status !== 2) return;
          if(!$.checklogin()) return;
          clicked('/realnameauth.html?id=' + this.id)
      },
      guanzhu: function(){
          var _this = this
          $.xhrPost('help/attention/' + this.id + '.shtml', {}, function(data){
            if(data.success){
                console.log(data)
                _this.detail.attention = data.data;
                data.data ? _this.detail.attentionCount++ : _this.detail.attentionCount--;
            }
        })
      },
      closePing: function(id){
          var datas = this.helpList;
          for(var i = 0; i < datas.length; i++) {
              if(datas[i].id == id){
                  datas[i].pingDisplay = false;
                  break;
              }
          }
          this.pingDis = false;
      },
      openPing: function(id, replierId, name){
          if(this.detail.status !== 2) return;
          this.pingDynamicId = id;
          this.pingReplierId = replierId;
          this.pingReplierName = name;

          var datas = this.helpList,
              _this = this;
          for(var i = 0; i < datas.length; i++) {
            if(datas[i].id == id){
                datas[i].optDisplay = false;
                datas[i].pingDisplay = true;
                this.$nextTick(function(){
                    var obj = _this.$refs['ping' + i][0];
                    datas[i].maskTop = obj.offsetTop;
                    datas[i].maskBto = _this.$refs['body'].offsetHeight - obj.offsetHeight- obj.offsetTop;
                });
                break;
            }
          }
      },
      inputPing: function(str){
          str = str.trim()
          if(str.length) {
              this.pingDis = true;
              this.pingCont = str;
          } else {
              this.pingDis = false;
          }
      },
      ping: function(){
        var _this = this
        if(!this.pingDis) return;
        $.xhrGet('help/reply/' + this.pingDynamicId + '.shtml', {
            donateInfoId: this.pingDynamicId,
            content: this.pingCont,
            receiverId: this.pingReplierId,
            parentId:  null
        }, function(data){
            console.log(data)
            if(data.success){
                var datas = _this.helpList;
                for(var i = 0; i < datas.length; i++) {
                    datas[i].pingDisplay = false;
                    if(datas[i].id == _this.pingDynamicId){
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
      openPhoto: function(index, str){
        var obj = {
            imgs: this.detail[str], // 图片列表
            index: index // 默认显示哪一张
        }
        localStorage.setItem('photos', JSON.stringify(obj));
        window.open('/photos.html', '_blank');
      }
  },
  created: function(){ 
      var _this = this

      // 求助详情
      $.xhrPost('help/detail/' + this.id + '.shtml', {}, function(data){
        if(data.success){
            console.log(data)
            _this.detail = data.data
            switch(data.data.relationship){ // relationship;// 收款人关系：1、本人；2、直系亲属；3、夫妻；4、公益组织
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
         count: 10,
         pageNum: this.page
      }, function(data){
        if(data.success){
            console.log(data)
            for(var i = 0; i < data.data.length; i++) {
                data.data[i].pingDisplay = false
                data.data[i].maskTop = 0
                data.data[i].maskBto = 0
                _this.helpList.push(data.data[i]);
            }
        }
      })
  },
  mounted: function(){
  }
})


