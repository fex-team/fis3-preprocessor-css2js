var tinytim = require('tinytim');

module.exports = function(content, file, conf) {
  // 先走一次 css 处理，
  // 如果要在 css 的流程中添加内容，请使用
  // fis.match('*.css:css')
  cssContent = fis.compile.partial(content, file, {
    ext: '.css',
    isCssLike: true
  });

  cssContent = cssContent.replace(/[\n|\r]/g, " ");
  cssContent = cssContent.replace(/'/g, '\"');
  cssContent = cssContent.replace(/\\/g, "\\\\");
  cssContent = "'" + cssContent + "'";

  var injectCssFn = tinytim.render(conf.templates.css_injector, {});
  content = tinytim.render(conf.templates[conf.template || 'requirejs_runner'], {
    cssContent: cssContent, 
    injectCssFn: injectCssFn
  });

  return content;
};

const CSS_INJECTOR = "(function (css) {\n" +
"    var headEl = document.getElementsByTagName('head')[0];\n" +
"    var styleEl = document.createElement('style');\n" +
"    headEl.appendChild(styleEl);\n" +
"    \n" +
"    if (styleEl.styleSheet) {\n" +
"        if (!styleEl.styleSheet.disabled) {\n" +
"            styleEl.styleSheet.cssText = css;\n" +
"        }\n" +
"    } else {\n" +
"        try {\n" +
"            styleEl.innerHTML = css\n" +
"        } catch(e) {\n" +
"            styleEl.innerText = css;\n" +
"        }\n" +
"    }\n" +
"})";

const REQUREJS_INJECT = "define([], function() {\n" +
"    var cssContent = {{ cssContent }};\n" +
"    var injectCssFn = {{ injectCssFn }};\n" +
"\n" +
"    return {\n" +
"        inject: function() {\n" +
"            injectCssFn(cssContent);\n" +
"        }\n" +
"    };\n" +
"});";

const REQUREJS_RUNNER = "define([], function() {\n" +
"    var cssContent = {{ cssContent }};\n" +
"    var injectCssFn = {{ injectCssFn }};\n" +
"\n" +
"    injectCssFn(cssContent);\n" +
"\n" +
"    return {};\n" +
"});";

const VANILLA_RUNNER = "(function() {\n" +
"    var cssContent = {{ cssContent }};\n" +
"    var injectCssFn = {{ injectCssFn }};\n" +
"\n" +
"    injectCssFn(cssContent);\n" +
"})();";

module.exports.defaultOptions = {
  templates: {
    css_injector: CSS_INJECTOR,
    requirejs_inject: REQUREJS_INJECT,
    requirejs_runner: REQUREJS_RUNNER,
    vanilla_runner: VANILLA_RUNNER
  },
  template: 'vanilla_runner'
}
