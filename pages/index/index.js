//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    scaleTextStyle:{
      show:true,
      size:12,
      color:'#666'
    },
    indicatorTextStyle:{
      show:true,
      size:16,
      text:'安全评分'
    },
    indicatorValueStyle: {
      show: true,
      size: 55,
      color:'#4575e8'
    },
    indicatorCircleStyle:{
      show:true,
      boderColor:[
        {
          progress:0,
          value:"#4575e8"
       },
        {
          progress: 1,
          value: "#fff"
        }
      ]
    }
  },
  //事件处理函数
  onLoad:function(){
  
  }
})
