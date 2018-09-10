const PI_3_2 = Math.PI * 1.5;
const PI_1_2 = Math.PI * 0.5;

const mergeProps = function(newVal, oldVal) {
  return { ...oldVal,
    ...newVal
  }
}

const defaultObjectProps = {
  indicatorTextStyle: {
    type: Object,
    value: {
      show: false,
      size: 12,
      color: '#666',
      text: ''
    }
  },
  indicatorValueStyle: {
    type: Object,
    value: {
      show: false,
      size: 18,
      color: '#4575e8'
    }
  },
  indicatorCircleStyle: {
    type: Object,
    value: {
      show: false,
      bgColor: '#00b800',
      r: 9,
      borderRadius: 3,
      borderColor: '#fff'
    }
  },
  scaleTextStyle: {
    type: Object,
    value: {
      show: false,
      size: 16,
      color: '#f0f0f0'
    }
  }
}

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
      value: 'gauge' + Math.random()
    },
    r: {
      type: Number,
      value: 95
    },

    startAngle: {
      type: Number,
      // value: 90 / 90 * Math.PI,
      value: 80 / 90 * Math.PI,
    },
    endAngle: {
      type: Number,
      // value: 180 / 90 * Math.PI,
      value: 10 / 90 * Math.PI,
    },
    indicatorBgColor: {
      type: [Array,String],
      value: [{
          progress: 0,
          value: '#ff0000'
        },
        {
          progress: 0.6,
          value: '#ffeb11'
        },
        {
          progress: 1,
          value: '#00b800'
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
    animateMsec: {
      type: Number,
      value: 0,
    },
    indicatorText: {
      type: String,
      value: ''
    },
    scale: {
      type: Array,
      value: [
        0, 200, 400, 600, 800, 1000
      ]
    },
    ...defaultObjectProps
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentValue: 0
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
    /**
     * 绘制圆圈
     * @params {CanvasContext} canvas context
     * @params {Object} 组件配置文件
     */
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
        }
        ctx.setFillStyle(fillGrd)
      } else {
        ctx.setFillStyle(config.backgroundColor)
      }
      ctx.closePath()
      ctx.fill()
    },
    _animate: function(func) {
      const {
        animateMsec
      } = this.data
      if (animateMsec === 0) {
        return func(1)
      }
      const startTime = Date.now();
      const endTime = startTime + animateMsec;
      // const traceTime = endTime - startTime;
      let timeOutId;
      const animateFunc = function() {
        const curTime = Date.now();
        const percent = (curTime - startTime) / animateMsec;
        if (percent >= 1) {
          func(1);
          // timeOutId && clearTimeout(timeOutId);
          return
        }
        func(percent)
        timeOutId = setTimeout(function() {
          animateFunc();
        }, 16)
      }
      animateFunc();
    },
    _drawBackground: function(ctx, config) {
      const newCfg = {
        ...config,
        backgroundColor: config.bgColor
      }
      delete newCfg.bgColor
      this._drawCircle(ctx, newCfg)
    },
    /**
     * 绘制指示器圆圈
     */
    _drawIndicator: function(ctx, value = 0, config) {
      let {
        startAngle,
        endAngle,
        min,
        max
      } = config
      if (endAngle <= startAngle) {
        endAngle += 2 * Math.PI
      }
      const currentAngle = (value / (max - min)) * (endAngle - startAngle) + startAngle
      const newCfg = {
        ...config,
        backgroundColor: config.indicatorBgColor,
        endAngle: currentAngle,
      }
      // debugger
      this._drawCircle(ctx, newCfg)
    },
    _drawIndicatorValue: function(ctx, text, config) {
      const {
        x,
        y,
        indicatorValueStyle
      } = config
      const {
        size = 25,
          color = '#1AAD16'
      } = indicatorValueStyle
      // debugger
      ctx.save()
      ctx.setFillStyle(color)
      // 以下精度可以加接口控制
      ctx.setFontSize(size)
      ctx.setTextAlign('center')
      ctx.fillText(Number.prototype.toFixed.call(text, 0), x, y)
    },
    _drawIndicatorText: function(ctx, config) {
      const {
        x,
        y,
        indicatorTextStyle
      } = config
      const {
        size,
        color,
        text
      } = mergeProps(indicatorTextStyle,defaultObjectProps.indicatorTextStyle.value) 
      ctx.save()
      ctx.setFillStyle(color)
      // 以下精度可以加接口控制
      ctx.setFontSize(size)
      ctx.setTextAlign('center')
      const mergedIndicatorValueStyle = mergeProps(config.indicatorValueStyle, defaultObjectProps.indicatorValueStyle.value) 
      ctx.fillText(text, x, y - 5 - mergedIndicatorValueStyle.size)
    },
    _drawIndicatorScale: function(ctx, config) {
      const {
        bgWidth,
        scale,
        r,
        x,
        y,
        min,
        max,
        scaleTextStyle
      } = config;
      let {
        startAngle,
        endAngle,
      } = config
      if (endAngle <= startAngle) {
        endAngle += Math.PI * 2
      }
      const len = scale.length;
      const {
        size,
        color
      } = mergeProps(scaleTextStyle, defaultObjectProps.scaleTextStyle.value);
      ctx.setFillStyle(color)
      // 以下精度可以加接口控制
      ctx.setFontSize(size)
      ctx.setTextAlign('center')
      for (let i = 0; i < len; i++) {
        const value = scale[i]
        let angle = (value / (max - min)) * (endAngle - startAngle) + startAngle
        // debugger
        if (angle >= Math.PI * 2) {
          angle = angle - Math.PI * 2
        }
        const point = this.getPoint(x, y, r - bgWidth - size - 5, angle);

        ctx.save()
        ctx.translate(point.x, point.y)
        const rotateDegrees = angle >= PI_3_2 ? (angle - PI_3_2) : (angle + PI_1_2);
        // console.log(rotateDegrees)
        ctx.rotate(rotateDegrees)
        ctx.fillText(value, 0, 0)
        ctx.restore()
      }
    },
    /**
     * 绘制终点圆圈指示器
     */
    _drawIndicatorCircle: function(ctx, value = 0, config) {
      ctx.beginPath()
      const {
        indicatorCircleStyle,
        x,
        y,
        r,
        max,
        min,
        bgWidth
      } = config;
      let {
        startAngle,
        endAngle,
      } = config
      if (endAngle <= startAngle) {
        endAngle += 2 * Math.PI
      }
      const currentAngle = (value / (max - min)) * (endAngle - startAngle) + startAngle
      const outPoint = this.getPoint(x, y, r, currentAngle);
      const innerPoint = this.getPoint(x, y, r - bgWidth, currentAngle);
      const point = {
        x: (outPoint.x + innerPoint.x) / 2,
        y: (outPoint.y + innerPoint.y) / 2,
      }
      ctx.moveTo(point.x, point.y)
      let mergedIndicatorCircleStyle
      const {
        bgColor,
        borderRadius,
        borderColor
      } = mergedIndicatorCircleStyle = mergeProps(indicatorCircleStyle, defaultObjectProps.indicatorCircleStyle.value)
      // 边框
      if (!isNaN(borderRadius) && borderRadius !== 0) {
        const outR = mergedIndicatorCircleStyle.r + borderRadius
        ctx.arc(point.x, point.y, outR, 0, 2 * Math.PI);
        if (Array.isArray(borderColor)) {
          const fillGrd = ctx.createCircularGradient(point.x, point.y, outR);
          const {
            length
          } = borderColor
          for (let i = 0; i < length; i++) {
            const bg = borderColor[i]
            fillGrd.addColorStop(bg.progress, bg.value || '#32d900')
          }
          ctx.setFillStyle(fillGrd)
        } else {
          ctx.setFillStyle(borderColor)
        }
        ctx.closePath()
        ctx.fill()
      }
      // 内圈指示器
      ctx.beginPath()
      ctx.arc(point.x, point.y, mergedIndicatorCircleStyle.r, 0, 2 * Math.PI);
      ctx.setFillStyle(bgColor)
      ctx.closePath()
      ctx.fill()

    },
    drawGauge: function(canvasId, x, y) {
      const ctx = wx.createCanvasContext(canvasId, this);
      this.ctx = ctx;
      const config = {
        x,
        y,
        ...this.properties
      }
      this._animate(this._drawGaugeWithAnimate.bind(this, config))
    },
    _drawGaugeWithAnimate: function(config, percent) {
      const {
        ctx
      } = this
      const {
        value,
        min
      } = this.data;
      const {
        indicatorTextStyle,
        indicatorValueStyle,
        indicatorCircleStyle
      } = this.properties
      const animateValue = min + (value - min) * percent;
      this._drawBackground(ctx, config)
      this._drawIndicator(ctx, animateValue, config)
      this._drawIndicatorScale(ctx, config)
      if (indicatorTextStyle.show) {
        this._drawIndicatorText(ctx, config)
      }
      if (indicatorCircleStyle.show) {
        this._drawIndicatorCircle(ctx, animateValue, config)
      }
      if (indicatorValueStyle.show) {
        this._drawIndicatorValue(ctx, animateValue, config)
      }
      ctx.draw()
    }
  },

  ready: function(opt) {
    const canvasId = 'gauge_' + this.data.gaugeid;
    const that = this;
    
    let x = 187;
    let y = 187;
    wx.getSystemInfo({
      success: function(res) {
        const {
          screenWidth,
          screenHeight
        } = res;
        const rpxTopx = screenWidth / 750;
        const {
          width,
          height
        } = that.data
        x = width * rpxTopx / 2;
        y = height * rpxTopx / 2;
        that.drawGauge(canvasId, x, y)
      },
    })
  }
})