// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    brief_introduction:'',
    looked:[{}],
    looking:[{}],
    tags:[],
    photos:'',
    self_introduction:'',
    userid:0,
    url:[],
    tags_color:['red','blue','green']
  },

  unique:function(arr){            
    for(var i=0; i<arr.length; i++){
        for(var j=i+1; j<arr.length; j++){
            if(arr[i].id==arr[j].id){         //第一个等同于第二个，splice方法删除第二个
                arr.splice(j,1);
                j--;
            }
        }
    }
    return arr;
    },

  SetMydata:function() {
    var userid = wx.getStorageSync('id');//获取用户id
    var that = this;
    const db = wx.cloud.database();
    db.collection('users').where({id:userid}).get().then(res=>{
      {var lookedid = res.data[0].looked;
      var lookingid = res.data[0].looking;
      var info = {id:0,name:'',brief:''};
      var dinfo = [];
      var ginfo = [];
      for(var i=0;i<lookedid.length;i++){
        var id = lookedid[i];
        db.collection('users').where({id:id}).get().then(r=>{
          info['id'] = r.data[0].id;
          info['name'] = r.data[0].name;
          info['brief'] = r.data[0].BriefIntroduction;
          dinfo.push(info);
          info = {id:0,name:'',brief:''};
        })
      }
      dinfo = this.unique(dinfo)
      for(var i=0;i<lookingid.length;i++){
        var id = lookingid[i];
        db.collection('users').where({id:id}).get().then(s=>{
          info['id'] = s.data[0].id;
          info['name'] = s.data[0].name;
          info['brief'] = s.data[0].BriefIntroduction;
          ginfo.push(info);
          info = {id:0,name:'',brief:''};
        })
      }}
      ginfo = this.unique(ginfo)
      wx.cloud.callFunction({
        name: 'picurl',
        data:{userid:userid,looked:res.data[0].looked,looking:res.data[0].looking},
        success: res => {
          that.setData({
            url: res.result.url,
            looking:ginfo,
            looked:dinfo,
            userid:res.result.userid,
            name:res.result.name,
            brief_introduction:res.result.brief_introduction,
            tags:res.result.tags,
            photos:res.result.photos,
            self_introduction:res.result.self_introduction
          });
        }
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.SetMydata();
  },

  choose_uploadPhoto:function(){
    var id = wx.getStorageSync('id');
    wx.chooseImage({
      success: choose_success => {
       var path = choose_success.tempFilePaths[0];
       var suffix = path.split('.')[path.split('.').length - 1];
       wx.cloud.uploadFile({
         cloudPath: `avatar/${id}.${suffix}`,
         filePath: path,
         success: res => {
           this.setData({
             "user.photourl": res.fileID//res.fileID就是该图片的云存储路径
           });
           console.log(res.fileID);
           wx.cloud.callFunction({
             name: 'Update_pic_pho',//云函数名称为photoupload
             data :
              {
                id:id,
                data:res.fileID,
                PicOrPho:false
              },
             success : res=>{
               console.log("uploadphoto success")
             }
           })
         }
       })
      },
    })
  },

  choose_uploadPicture:function(){
    var id = wx.getStorageSync('id');
    wx.chooseImage({
      success: choose_success => {
       var path = choose_success.tempFilePaths[0];
       var suffix = path.split('.')[path.split('.').length - 1];
       wx.cloud.uploadFile({
         cloudPath: `avatar/${id}.${suffix}`,
         filePath: path,
         success: res => {
           this.setData({
             "user.photourl": res.fileID//res.fileID就是该图片的云存储路径
           });
           console.log(res.fileID);
           wx.cloud.callFunction({
             name: 'Update_pic_pho',//云函数名称为photoupload
             data :
              {
                id:id,
                data:res.fileID,
                PicOrPho:true
              },
             success : res=>{
               console.log("uploadphoto success")
             }
           })
         }
       })
      },
    })
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
    this.SetMydata();
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

  }
})