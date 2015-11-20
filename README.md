fis3-preprocessor-css2js
===============
将 css 解析成 js 文件，用 js 的方式去加载。

只支持 fis3

```
npm install -g fis3-preprocessor-css2js
```

使用方式配置如下：

```
fis.match('/modules/css/*.{scss,css,less}', {
  preprocessor: fis.plugin('css2js'),
  rExt: '.js',
  isMod: true
})
```

配置完后，可以在 js 中用 js loader 引用 css 了，如： `require(`css/xxx.css`)` 
