export default {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          firefox: '62',
          chrome: '69',
        },
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
  ],
}
