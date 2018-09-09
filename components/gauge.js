const PI3_2 = Math.PI * 1.5;
const PI1_2 = Math.PI * 0.5;


// components/gauge.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width: {
      type: Number,
      value: 750
    },
    height: {
      type: Number,
      value: 450
    },
    gaugeid: {
      type: String,
      value: '',
      observer: function(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
        // debugger

      }
    },
    x:{
      type:Number,
      value:200
    },
    y: {
      type: Number,
      value: 150
    },
    r: {
      type: Number,
      value: 95
    }, 
    
    startAngle: {
      type: Number,
      value: 80 / 90 * Math.PI,
    },
    endAngle: {
      type: Number,
      value: 10 / 90 * Math.PI, 
    },
    bgColor: {
      type: String,
      value: '#f0f0f0',
    },
    indicatorBgColr: {
      type: Array,
      value: [{
        progress: 0,
        value: '#32d900'
      },
      {
        progress: 0.5,
        value: '#00d9bb'
      },
      {
        progress: 1,
        value: '#3b8bc5'
      }
      ],
    },

    bgColor: {
      type: String,
      value: '#f0f0f0',
    },
    bgWidth: {
      type: Number,
      value: 15,
    },
    min: {
      type: Number,
      value: 0,
    },
    max: {
      type: Number,
      value: 1000,
    },
    value: {
      type: Number,
      value: 700,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // width: this.
    x: 0,
    y: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getPoint: function(x, y, r, angle) {
      const x1 = x + r * Math.cos(angle);
      const y1 = y + r * Math.sin(angle);
      // debugger
      return {
        x: x1,
        y: y1
      }
      // }
    },
    _drawCircle: function(ctx, cfg) {
      ctx.beginPath()
      const config = cfg
      const innerCircleRadius = config.r - config.bgWidth;
      // ctx.moveTo(config.x,config.y)
      // 外圈
      ctx.arc(config.x, config.y, config.r, config.startAngle, config.endAngle)
      // 外圈结束坐标
      const outEndPoint = this.getPoint(config.x, config.y, config.r, config.endAngle)
      console.log('外圈结束坐标：', outEndPoint)

      // 内圈结束坐标
      const innerEndPoint = this.getPoint(config.x, config.y, innerCircleRadius, config.endAngle)
      console.log('内圈结束坐标：', innerEndPoint)
      // 结束位置小圆圈坐标
      const endCirclePoint = {
        x: (outEndPoint.x + innerEndPoint.x) / 2,
        y: (outEndPoint.y + innerEndPoint.y) / 2,
      }
      console.log('结束位置小圆圈坐标：', endCirclePoint)

      // 结束位置圆弧
      ctx.arc(endCirclePoint.x, endCirclePoint.y, config.bgWidth / 2, config.endAngle, config.endAngle + Math.PI)
      // 内圈圆弧
      ctx.arc(config.x, config.y, innerCircleRadius, config.endAngle, config.startAngle, true)

      // 外圈开始位置坐标
      const outStartPoint = this.getPoint(config.x, config.y, config.r, config.startAngle)
      console.log('外圈开始位置坐标', outStartPoint)

      // 内圈开始位置坐标
      const innerStartPoint = this.getPoint(config.x, config.y, innerCircleRadius, config.startAngle)
      console.log('内圈开始位置坐标', innerStartPoint)

      // 开始位置小圆圈坐标
      const startCirclePoint = {
        x: (outStartPoint.x + innerStartPoint.x) / 2,
        y: (outStartPoint.y + innerStartPoint.y) / 2,
      }
      console.log('开始位置小圆圈坐标：', startCirclePoint)
      // 开始位置小圆圈坐标
      // 开始位置圆弧
      ctx.moveTo(outStartPoint.x, outStartPoint.y)
      ctx.arc(startCirclePoint.x, startCirclePoint.y, config.bgWidth / 2, config.startAngle, config.startAngle - Math.PI, true)
      // 设置填充渐变色
      // 当背景颜色是数组时，设置为渐变色
      const {
        backgroundColor
      } = config

      if (Array.isArray(backgroundColor)) {
        const fillGrd = ctx.createLinearGradient(innerStartPoint.x, innerStartPoint.y, innerEndPoint.x, innerEndPoint.y);
        const {
          length
        } = config.backgroundColor
        for (let i = 0; i < length; i++) {
          const bg = backgroundColor[i]
          fillGrd.addColorStop(bg.progress, bg.value || '#32d900')
          // fillGrd.addColorStop(1, '#2c94e0')
        }
        // fillGrd.addColorStop(0.25, '#00d9bb')
        // fillGrd.addColorStop(0.75, '#3b8bc5')
        ctx.setFillStyle(fillGrd)
      } else {
        ctx.setFillStyle(config.backgroundColor)
      }
      ctx.closePath()
      ctx.fill()

    },
    _animate: function() {},
    _drawBackground: function(ctx) {
      const newCfg = {
        ...this.properties,
        backgroundColor: this.properties.bgColor
      }
      delete newCfg.bgColor
      this._drawCircle(ctx, newCfg)
    },
    _drawIndicator: function(ctx, value=0) {
      let {
        startAngle,
        endAngle,
        min,
        max
      } = this.properties
      if(endAngle <= startAngle){
        endAngle+=2*Math.PI
      }
      const currentAngle = (value / (max - min)) * (endAngle - startAngle) + startAngle
      const newCfg = {
        ...this.properties,
        backgroundColor: this.properties.indicatorBgColr,
        endAngle: currentAngle,
      }
      
      this._drawCircle(ctx, newCfg)
    }
  },

  ready: function(opt) {
    console.log(this)
    const ctx = wx.createCanvasContext('gauge_' + this.data.gaugeid, this);
    this.ctx = ctx;
    const config = this.properties
    
    this._drawBackground(ctx, config)
    this._drawIndicator(ctx, 700)
    ctx.draw()

  }
})