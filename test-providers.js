"use strict";

const providers = {
  a: {
    inject() {
      return [providers.b, providers.c];
    },
    init(b, c) {
      return { a: true, b: b, c: c };
    }
  },

  b: {
    singleton: true,
    inject(provide) {
      return [providers.d, provide.factory(providers.c)];
    },
    init(d, cf) {
      return { b: true, d: d, cf: cf };
    }
  },

  c: {
    inject() {
      return [providers.d];
    },
    init(d) {
      return { c: true, d: d };
    }
  },

  d: {
    inject(provide) {
      return [provide(providers.v)];
    },
    init(v) {
      return { d: true, v: v };
    }
  },

  e: class {
    static inject(provide) {
      return [providers.a, providers.b, provide.make];
    }

    constructor(a, b, make) {
      this.a = a;
      this.b1 = b;
      this.b2 = make(providers.b);
    }
  },

  v: { v: true }
};

module.exports = providers;
