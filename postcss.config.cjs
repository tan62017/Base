module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 19.2, // 设计稿宽度除以10，通常是750或者640
      propList: ['*'], // 需要转换的属性，这里选择转换所有属性
      unitPrecision: 5, // REM单位精度
      selectorBlackList: ['border'], // 要忽略的选择器
      replace: true, // 替换包含REM的规则，而不是添加回退
      mediaQuery: false, // 是否在媒体查询中转换px为rem
      minPixelValue: 1, // 设置要转换的最小像素值
    },
  },
};
