'use strict'

var inja = require('./index')
var test = require('tape')

var providers = {
  a: {
    name: 'a',
    inject: function () {
      return [providers.b, providers.c]
    },
    init: function (b, c) {
      return { a: true, b: b, c: c }
    }
  },

  b: {
    name: 'b',
    singleton: true,
    inject: function (provide) {
      return [providers.d, provide.factory(providers.c)]
    },
    init: function (d, cf) {
      return { b: true, d: d, cf: cf }
    }
  },

  c: {
    name: 'c',
    inject: function () {
      return [providers.d]
    },
    init: function (d) {
      return { c: true, d: d }
    }
  },

  d: {
    name: 'd',
    inject: function (provide) {
      return [provide(providers.v)]
    },
    init: function (v) {
      return { d: true, v: v }
    }
  },

  e: class {
    static inject (provide) {
      return [providers.a, providers.b, provide.make]
    }

    constructor (a, b, make) {
      this.a = a
      this.b1 = b
      this.b2 = make(providers.b)
    }
  },

  v: { v: true }
}

test('makes an instance of a provider', function (t) {
  var a = inja().make(providers.a)
  t.ok(a.a)
  t.end()
})

test('makes a new instance for transients', function (t) {
  var make = inja().make
  var a1 = make(providers.a)
  var a2 = make(providers.a)
  t.notEqual(a1, a2)
  t.end()
})

test('returns same instance for singletons', function (t) {
  var make = inja().make
  var b1 = make(providers.b)
  var b2 = make(providers.b)
  t.equal(b1, b2)
  t.end()
})

test('injects dependencies', function (t) {
  var a = inja().make(providers.a)
  t.ok(a.b.b)
  t.ok(a.c.c)
  t.end()
})

test('injects provided values', function (t) {
  var d = inja().make(providers.d)
  t.ok(d.v.v)
  t.end()
})

test('injects provided factory for provider', function (t) {
  var b = inja().make(providers.b)
  t.ok(b.cf().c)
  t.end()
})

test('implements one provider with another', function (t) {
  var b = inja().implement(providers.a, providers.b).make(providers.a)
  t.ok(b.b)
  t.end()
})

test('supports class providers', function (t) {
  var e = inja().make(providers.e)
  t.ok(e.a.a)
  t.end()
})

test('injects make function for container', function (t) {
  var e = inja().make(providers.e)
  t.equal(e.b1, e.b2)
  t.end()
})
