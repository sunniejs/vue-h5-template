const path = require('path');

/** 这个方法是针对处理vant组件下的设计稿为375问题 */
const judgeComponent = (file) => {
  const ignore = ['vant', '@nutui', '@varlet'];
  return ignore.some((item) => path.join(file).includes(path.join('node_modules', item)));
};

module.exports = {
  plugins: {
    autoprefixer: { overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8'] },
    'postcss-mobile-forever': {
      rootClass: 'root-class',
      viewportWidth: (file) => (judgeComponent(file) ? 375 : 750), // UI设计稿的宽度
      unitPrecision: 6, // 转换后的精度，即小数点位数
      propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      include: null,
      exclude: null, // 设置忽略文件，用正则做目录名匹配
      border: true, // 横屏和桌面端的边框
      disableDesktop: false, // 关闭桌面端适配
      disableLandscape: false, // 关闭横屏适配
      disableMobile: false, // 关闭竖屏适配
      mobileConfig: {
        viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
        fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
        replace: true, // 是否转换后直接更换属性值
      },
    },
  },
};
