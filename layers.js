/**
 * @author apendua / apendua@gmail.com
 */

var dependencies = {};
var manager = new AMDManager();
var definedLayers = {};

Layers = { // public API

  define: function (name, deps, body) {
    //---------------------------------
    definedLayers[name] = true;
    //--------------------------
    if (arguments.length == 2) {
      body = deps; deps = [];
    }
    manager.define(name, deps, body);
  },

  require: function (listOrName, body) {
    var readyDep, isReady;
    if (_.isFunction(body)) {
      if (!_.isArray(listOrName)) {
        listOrName = [listOrName, ];
      }
      return manager.require(listOrName, body);
    } else {
      if (_.isArray(listOrName)) {
        readyDep = new Deps.Dependency();
        manager.require(listOrName, function () {
          readyDep.changed();
          isReady = true;
        });
        return {
          ready: function () {
            readyDep.depend();
            return !!isReady;
          },
        }; // ready handle
      } else if (_.isString(listOrName)) {
        if (dependencies[listOrName] === undefined) {
          dependencies[listOrName] = new Deps.Dependency();
          manager.require([listOrName, ], function () {
            dependencies[listOrName].changed();
          });
        }
        dependencies[listOrName].depend();
        return manager.get(listOrName);
      }
    }
    
    // TODO: be more specific
    throw new Error('Wrong parameters for require.');
  },

};

// manager setup

var layers = {};
var useAjax = false;

manager.onModuleNotFound(function (module) {
  var layerName = module.name;
  var layer = layers[layerName];
  if (useAjax && !layer.ajax) {
    layer.ajax = true;
    $.ajax({
      url  : layer.path,
      type : 'GET', dataType : 'script',
    }).done(function () {
      if (!definedLayers[layerName]) { // maybe the layer code already contains define statement?
        Layers.define(layerName, function () {});
      }
    });
  }
});

Meteor.startup(function () {
  _.each(__atmosphere_layers__, function (layerInfo) {
    layers[layerInfo.name] = {
      path: layerInfo.path
    };
  });
  useAjax = true;
});
