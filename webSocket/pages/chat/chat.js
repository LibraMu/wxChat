// pages/chat/chat.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myselyId:null,
    myselyTalk:'',
    contentHeight:200,
    content:[{
      isMysely:true,
      message:'本人'
    },{
      isMysely:false,
      message:'友军'
    }],
    socketTask:null,
    connectFill:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    app.util.baseRequest({
      url:'chat',
      data:{
        user_id:app.globalData.user_id,
        chat_id:8
      }
    },function(res){
      if (res.statusCode == 200) {
        _this.addChatList(res.data);
      }
      console.log(res,'返回数据');
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.chatInit();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onPageScroll:function(e){
    console.log(e,'滚动通过条')
  },
  // 连接socket
  chatInit: function() {
    let _this = this,
      socketTask = _this.data.socketTask;
    if (socketTask) { wx.closeSocket() };
    //建立连接        
    socketTask = wx.connectSocket({ //监听WebSocket连接打开事件。
      url: 'ws://192.168.1.2', //app.appData.socket        
    });
    // console.log(socketTask,'连接');
    this.addListen(socketTask);
  },
  // 监听连接
  addListen:function(socketTask,callback){
    const _this = this;
    socketTask.onOpen( res => {
      console.log(res,'连接成功')
    });
    socketTask.onClose( res => {
      console.log(res,'连接关闭')
    });
    socketTask.onMessage(res => {
      console.log(res,'返回数据',res.data)
      console.log(JSON.parse(res.data));
      let socketMsg = JSON.parse(res.data),
        content = _this.data.content,
        contentItme = {
          isMysely:socketMsg.user_id == app.globalData.user_id ? true : false,
          message:socketMsg.message
        };
      content.push(contentItme);
      _this.setData({
        content: content
      },function(){
        _this.setScroll();
      });
    });      
    socketTask.onError( res =>{
      console.log('错误',res);
      _this.setData({
        connectFill:true
      });
      _this.chatInit();
    });
  },
  // 谈话输入
  changeTalk:function(e){
    this.setData({
      myselyTalk: e.detail.value
    })
  },
  // 保持在底部
  setScroll:function(){
    const _this = this;
    wx.createSelectorQuery().select('.content_box').boundingClientRect(function(rect){  
      _this.setData({
        contentHeight:rect.height + 60,
        maxHeight:rect.height*100
      },function(){
        console.log(rect,_this.data.maxHeight,'滚动高度')
      });
    }).exec();
  },
  // 提交信息
  submitMsg:function(){
    let data = {
      user_id:app.globalData.user_id,
      chat_id:8,
      message:this.data.myselyTalk
    }
    let chat_data = JSON.stringify(data);
    wx.sendSocketMessage({
      data:chat_data
    });
    app.util.baseRequest({
      url:"chat",
      method:'post',
      data:data
    },function(res){
      console.log(res,'新增');
    })
  },
  // 合并聊天记录
  addChatList:function(array){
    let _this = this,
        list  = _this.data.content;
    for(let k of array){
      let item = {};
      item.isMysely = k.user_id == app.globalData.user_id ? true : false;
      item.message = k.message;
      list.push(item);
    }
    _this.setData({
      content: list
    },function(){
      _this.setScroll();
    });
  }
})