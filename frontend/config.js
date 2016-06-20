System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "es7.decorators",
      "es7.classProperties"
    ]
  },
  paths: {
    "*": "dist/*",
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "PrismLibrary/prism": "github:PrismLibrary/prism@master",
    "aurelia-animator-css": "npm:aurelia-animator-css@1.0.0-beta.2.0.1",
    "aurelia-bootstrapper": "npm:aurelia-bootstrapper@1.0.0-beta.2.0.1",
    "aurelia-fetch-client": "npm:aurelia-fetch-client@1.0.0-beta.2.0.1",
    "aurelia-framework": "npm:aurelia-framework@1.0.0-beta.2.0.1",
    "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0-beta.2.0.1",
    "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0-beta.2.0.2",
    "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0-beta.2.0.1",
    "aurelia-pal-browser": "npm:aurelia-pal-browser@1.0.0-beta.3.0.1",
    "aurelia-polyfills": "npm:aurelia-polyfills@1.0.0-beta.2.0.1",
    "aurelia-router": "npm:aurelia-router@1.0.0-beta.2.0.1",
    "aurelia-templating-binding": "npm:aurelia-templating-binding@1.0.0-beta.2.0.2",
    "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0-beta.3.0.4",
    "aurelia-templating-router": "npm:aurelia-templating-router@1.0.0-beta.2.0.3",
    "babel": "npm:babel-core@5.8.38",
    "babel-runtime": "npm:babel-runtime@5.8.38",
    "core-js": "npm:core-js@1.2.6",
    "fetch": "github:github/fetch@0.11.1",
    "nprogress": "github:rstacruz/nprogress@0.2.0",
    "prismjs": "npm:prismjs@1.5.1",
    "showdown": "npm:showdown@1.4.1",
    "text": "github:systemjs/plugin-text@0.0.3",
    "trim-html": "npm:trim-html@0.1.7",
    "vheissu/aurelia-google-maps": "github:vheissu/aurelia-google-maps@1.0.1",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.5"
    },
    "github:jspm/nodelibs-tty@0.1.0": {
      "tty-browserify": "npm:tty-browserify@0.0.0"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "github:rstacruz/nprogress@0.2.0": {
      "css": "github:systemjs/plugin-css@0.1.23"
    },
    "github:vheissu/aurelia-google-maps@1.0.1": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.2.0.7",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.2.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.2.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.3.0.6"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:aurelia-animator-css@1.0.0-beta.2.0.1": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.2.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.2.0.0",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.3.0.6"
    },
    "npm:aurelia-binding@1.0.0-beta.2.0.7": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.2.0.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.2.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.2.0.0",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.2.0.1"
    },
    "npm:aurelia-bootstrapper@1.0.0-beta.2.0.1": {
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-beta.2.0.1",
      "aurelia-framework": "npm:aurelia-framework@1.0.0-beta.2.0.1",
      "aurelia-history": "npm:aurelia-history@1.0.0-beta.2.0.1",
      "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0-beta.2.0.1",
      "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0-beta.2.0.2",
      "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0-beta.2.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.2.0.0",
      "aurelia-pal-browser": "npm:aurelia-pal-browser@1.0.0-beta.3.0.1",
      "aurelia-polyfills": "npm:aurelia-polyfills@1.0.0-beta.2.0.1",
      "aurelia-router": "npm:aurelia-router@1.0.0-beta.2.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.3.0.6",
      "aurelia-templating-binding": "npm:aurelia-templating-binding@1.0.0-beta.2.0.2",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0-beta.3.0.4",
      "aurelia-templating-router": "npm:aurelia-templating-router@1.0.0-beta.2.0.3"
    },
    "npm:aurelia-dependency-injection@1.0.0-beta.2.1.1": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.2.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.2.0.0"
    },
    "npm:aurelia-event-aggregator@1.0.0-beta.2.0.1": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.2.0.1"
    },
    "npm:aurelia-framework@1.0.0-beta.2.0.1": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.2.0.7",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.2.1.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.2.0.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.2.0.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.2.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.2.0.0",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.2.0.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.2.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.3.0.6"
    },
    "npm:aurelia-history-browser@1.0.0-beta.2.0.1": {
      "aurelia-history": "npm:aurelia-history@1.0.0-beta.2.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.2.0.0"
    },
    "npm:aurelia-loader-default@1.0.0-beta.2.0.2": {
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.2.0.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.2.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.2.0.0"
    },
    "npm:aurelia-loader@1.0.0-beta.2.0.1": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.2.0.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.2.0.1"
    },
    "npm:aurelia-logging-console@1.0.0-beta.2.0.1": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.2.0.1"
    },
    "npm:aurelia-metadata@1.0.0-beta.2.0.1": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.2.0.0"
    },
    "npm:aurelia-pal-browser@1.0.0-beta.3.0.1": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.2.0.0"
    },
    "npm:aurelia-polyfills@1.0.0-beta.2.0.1": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.2.0.0"
    },
    "npm:aurelia-route-recognizer@1.0.0-beta.2.0.1": {
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.2.0.1"
    },
    "npm:aurelia-router@1.0.0-beta.2.0.1": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.2.1.1",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-beta.2.0.1",
      "aurelia-history": "npm:aurelia-history@1.0.0-beta.2.0.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.2.0.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.2.0.1",
      "aurelia-route-recognizer": "npm:aurelia-route-recognizer@1.0.0-beta.2.0.1"
    },
    "npm:aurelia-task-queue@1.0.0-beta.2.0.1": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.2.0.0"
    },
    "npm:aurelia-templating-binding@1.0.0-beta.2.0.2": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.2.0.7",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.2.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.3.0.6"
    },
    "npm:aurelia-templating-resources@1.0.0-beta.3.0.4": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.2.0.7",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.2.1.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.2.0.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.2.0.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.2.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.2.0.0",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.2.0.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.2.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.3.0.6"
    },
    "npm:aurelia-templating-router@1.0.0-beta.2.0.3": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.2.1.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.2.0.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.2.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.2.0.0",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.2.0.1",
      "aurelia-router": "npm:aurelia-router@1.0.0-beta.2.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.3.0.6"
    },
    "npm:aurelia-templating@1.0.0-beta.3.0.6": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.2.0.7",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.2.1.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.2.0.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.2.0.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.2.0.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.2.0.0",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.2.0.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.2.0.1"
    },
    "npm:babel-runtime@5.8.38": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:cliui@3.2.0": {
      "string-width": "npm:string-width@1.0.1",
      "strip-ansi": "npm:strip-ansi@3.0.1",
      "wrap-ansi": "npm:wrap-ansi@2.0.0"
    },
    "npm:code-point-at@1.0.0": {
      "number-is-nan": "npm:number-is-nan@1.0.0"
    },
    "npm:core-js@1.2.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:is-fullwidth-code-point@1.0.0": {
      "number-is-nan": "npm:number-is-nan@1.0.0"
    },
    "npm:lcid@1.0.0": {
      "invert-kv": "npm:invert-kv@1.0.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:os-locale@1.4.0": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "lcid": "npm:lcid@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.5": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:showdown@1.4.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2",
      "yargs": "npm:yargs@3.32.0"
    },
    "npm:string-width@1.0.1": {
      "code-point-at": "npm:code-point-at@1.0.0",
      "is-fullwidth-code-point": "npm:is-fullwidth-code-point@1.0.0",
      "strip-ansi": "npm:strip-ansi@3.0.1"
    },
    "npm:strip-ansi@3.0.1": {
      "ansi-regex": "npm:ansi-regex@2.0.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    },
    "npm:window-size@0.1.4": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "tty": "github:jspm/nodelibs-tty@0.1.0"
    },
    "npm:wrap-ansi@2.0.0": {
      "string-width": "npm:string-width@1.0.1"
    },
    "npm:y18n@3.2.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:yargs@3.32.0": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "camelcase": "npm:camelcase@2.1.1",
      "cliui": "npm:cliui@3.2.0",
      "decamelize": "npm:decamelize@1.2.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "os-locale": "npm:os-locale@1.4.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "string-width": "npm:string-width@1.0.1",
      "window-size": "npm:window-size@0.1.4",
      "y18n": "npm:y18n@3.2.1"
    }
  }
});
