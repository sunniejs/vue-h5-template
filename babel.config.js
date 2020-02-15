module.exports = {
  presets: [['@vue/cli-plugin-babel/preset', {useBuiltIns: 'entry'}]],
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ]
  ]
}
