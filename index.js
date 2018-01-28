'use strict'

function init () {
  var singletons = new Map()

  function make (provider, transients) {
    transients = transients || new Map()
    var cache = provider.singleton ? singletons : transients
    var instance = cache.get(provider)
    var deps
    if (!instance) {
      if (provider.inject) {
        deps = provider.inject(provide).map(function (dep) {
          return make(dep, transients)
        })
      }
      instance = provider.init.apply(provider, deps)
      cache.set(provider, instance)
    }
    return instance
  }

  function provide (value) {
    return {
      init: function () {
        return value
      }
    }
  }

  function factory (provider) {
    return provide(function () {
      return make(provider)
    })
  }

  provide.factory = factory

  return {
    make: make
  }
}

module.exports = init
