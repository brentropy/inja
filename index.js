"use strict";

function context() {
  return new Map();
}

function init() {
  var singletons = context();
  var overrides = new Map();

  function make(provider, transients) {
    transients = transients || context();
    provider = overrides.get(provider) || provider;
    var cache = provider.singleton ? singletons : transients;
    var instance = cache.get(provider);
    var deps;
    if (!instance) {
      if (provider.inject) {
        deps = provider.inject(provide).map(function(dep) {
          return make(dep, transients);
        });
      }
      if (typeof provider === "function") {
        instance = new (provider.bind.apply(provider, [null].concat(deps)))();
      } else {
        instance = provider.init.apply(provider, deps);
      }
      cache.set(provider, instance);
    }
    return instance;
  }

  function implement(original, override) {
    overrides.set(original, override);
    return container;
  }

  function provide(value) {
    return {
      init: function() {
        return value;
      }
    };
  }

  function factory(provider) {
    return provide(function() {
      return make(provider);
    });
  }

  make.context = context;
  provide.factory = factory;
  provide.make = provide(make);

  var container = {
    make: make,
    implement: implement
  };

  return container;
}

module.exports = init;
