// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex:'0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 更换导航
  changeTab:function(e){
    let tabIndex = e.currentTarget.dataset.index;
    this.setData({
      tabIndex:tabIndex
    })
  },
  // 注册
  submitRegister:function(e){
    console.log(e,'提交信息');
    let _this = this, 
      input = e.detail.value,
      phoneValue = input.phone,
      passwordValue = input.password,
      comfirmValue = input.comfirmPassword,
      phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;

    if (phoneValue && passwordValue && comfirmValue) {
      if (phoneReg.test(phoneValue)) {
        if (passwordValue === comfirmValue) {
          new Promise(function(resolve,reject){
            app.util.baseRequest({
              url:"user/register",
              method:"post",
              data:{
                phone:phoneValue,
                password:passwordValue
              }
            },function(res){
              if (res.statusCode == 200 && res.data.code !=0) {
                resolve();
              }else{
                reject(res.data.msg);
              }
            });
          }).then( ()=>{
            wx.showToast({
              title:'注册成功'
            })
            _this.setData({
              tabIndex:'1'
            })
          }).catch( msg => {
            wx.showToast({
              title:msg,
              icon:'none'
            })
          })
            
        }else{
          wx.showToast({
            title:"两次密码不一致",
            icon:'none'
          })
        }
      }else{
        wx.showToast({
          title:"手机号不正确",
          icon:'none'
        })
      }
    }else{
      wx.showToast({
        title:"请正确输入",
        icon:'none'
      })
    }
  },
  // 登录
  submitLogin:function(e){
    let _this = this, 
      input = e.detail.value,
      phoneValue = input.phone,
      passwordValue = input.password,
      phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;

    if (phoneValue && passwordValue) {
      if (phoneReg.test(phoneValue)) {
        new Promise(function(resolve,reject){
            app.util.baseRequest({
              url:"user/login",
              data:{
                phone:phoneValue,
                password:passwordValue
              }
            },function(res){
              if (res.statusCode == 200 && res.data.code !=0) {
                resolve(res);
              }else{
                reject(res.data.msg);
              }
            });
          }).then( (res)=>{
            app.globalData.user_id = res.data.user_id;
            wx.redirectTo({
              url:"/pages/chat/chat"
            })
          }).catch( msg => {
            wx.showToast({
              title:msg,
              icon:'none'
            })
          })
      }else{
        wx.showToast({
          title:"手机号不正确",
          icon:'none'
        })
      }
    }else{
      wx.showToast({
        title:"请正确输入",
        icon:'none'
      })
    }
  }
})