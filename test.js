"use strict";

const inja = require("./index");
const test = require("tape");
const providers = require("./test-providers.js");

test("makes an instance of a provider", t => {
  const a = inja().make(providers.a);
  t.ok(a.a);
  t.end();
});

test("makes a new instance for transients", t => {
  const make = inja().make;
  const a1 = make(providers.a);
  const a2 = make(providers.a);
  t.notEqual(a1, a2);
  t.end();
});

test("returns same instance for singletons", t => {
  const make = inja().make;
  const b1 = make(providers.b);
  const b2 = make(providers.b);
  t.equal(b1, b2);
  t.end();
});

test("injects dependencies", t => {
  const a = inja().make(providers.a);
  t.ok(a.b.b);
  t.ok(a.c.c);
  t.end();
});

test("injects provided values", t => {
  const d = inja().make(providers.d);
  t.ok(d.v.v);
  t.end();
});

test("injects provided factory for provider", t => {
  const b = inja().make(providers.b);
  t.ok(b.cf().c);
  t.end();
});

test("implements one provider with another", t => {
  const b = inja()
    .implement(providers.a, providers.b)
    .make(providers.a);
  t.ok(b.b);
  t.end();
});

test("supports class providers", t => {
  const e = inja().make(providers.e);
  t.ok(e.a.a);
  t.end();
});

test("injects make function for container", t => {
  const e = inja().make(providers.e);
  t.equal(e.b1, e.b2);
  t.end();
});
