// Generated by CoffeeScript 1.12.1
(function() {
  var Adapter, MinifyJS, W, convert, path, sourcemaps,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Adapter = require('../../adapter_base');

  sourcemaps = require('../../sourcemaps');

  W = require('when');

  path = require('path');

  convert = require('convert-source-map');

  MinifyJS = (function(superClass) {
    var compile;

    extend(MinifyJS, superClass);

    function MinifyJS() {
      return MinifyJS.__super__.constructor.apply(this, arguments);
    }

    MinifyJS.prototype.name = 'minify-js';

    MinifyJS.prototype.extensions = ['js'];

    MinifyJS.prototype.output = 'js';

    MinifyJS.prototype.supportedEngines = ['uglify-js'];

    MinifyJS.prototype.isolated = true;

    MinifyJS.prototype._render = function(str, options) {
      if (options.sourcemap === true) {
        options.sourceMap = true;
        options.outSourceMap = path.basename(options.filename);
      }
      return compile((function(_this) {
        return function() {
          var obj, res;
          res = _this.engine.minify(str, Object.assign(options, {
            fromString: true
          }));
          obj = {
            result: res.code
          };
          if (options.sourceMap) {
            obj.sourcemap = JSON.parse(res.map);
            obj.sourcemap.sources.pop();
            obj.sourcemap.sources.push(options.filename);
            obj.result = convert.removeMapFileComments(obj.result).trim();
            return sourcemaps.inline_sources(obj.sourcemap).then(function(map) {
              obj.sourcemap = map;
              return obj;
            });
          } else {
            return obj;
          }
        };
      })(this));
    };

    compile = function(fn, map) {
      var err, res;
      try {
        res = fn();
      } catch (error) {
        err = error;
        return W.reject(err);
      }
      return W.resolve(res);
    };

    return MinifyJS;

  })(Adapter);

  module.exports = MinifyJS;

}).call(this);
