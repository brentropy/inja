# Inja: Simple Dependency Injection for JavaScript

Inja makes dependency injection easy and helps you write well-structured,
testable code. Inja can be added gradually to an existing application or serve
as a solid foundation for your next greenfield project.

## Features

- Seperates module loading and initialization
- Helps avoid global state
- Explicit injection (no magic)
- Supports singleton and transient service lifetimes
- Makes testing easy without stubbing shared bindings
- Easy to introduce gradually in an existing application
- Works with Node.js and the Browser

## Installation

```bash
npm install inja

# or

yarn add inja
```

## Terminology

Inja is designed to be as simple as possible; however, it does introduce a few
terms: *provider*, *service*, *container*, *singleton*, and *transient*.
Don't be intimidated though! Each term represents an easy to understand concept.
Having a name for these concepts will help faciliate better communication and
naming conventions.

### Provider

With `inja`, a provider is a object with an `init()` method and optionally an
`inject()` method to describe dependencies that should be passed to `init()`.
Additionally, a provider may have a property identifiying it as a `transient`
provider, meaning it should generate a new service instance each time it is
requested. A provider typically maps one to one with a module.

#### Example:

```javascript
const exampleProvider = {
  transient: true,

  inject (provide) {
    return [
      otherProvider,
      provide(process.env),
      provide.factory(transientProvider)
    ]
  },

  init (otherService, envService, makeTransientService) {
    return {/* some service object /*}
  }
}

module.exports = exampleProvider
```

### Interface Provider

It is possible to supply a alternate implementation of a provider within your
container. One case for this would be a service that can depend on any service
that satisfies a given interface.

#### Example:

```js
const inja = require('inja')
const cacheInterface = require('./cache-interface')
const redisProvider = require('./redis')

const thingProvider = {
  inject () {
    return [cacheInterface]
  },

  init (cacheService) {
    return { /* service instance */ }
  }
}

const thingService = inja()
  .implement(cacheInterface, redisProvider)
  .make(thingProvider)
```

An interface provider may have no default implementation. In this case the init
method should throw an `Error` to force consumers to implement the interface
within the container.

#### Example:

```js
const cacheInterface = {
  init () {
    throw new Error('Cache interface not implemented.')
  }
}
```

### Service

Services handle effects and access to internal or external state. A service is
an instance returned when making a provider. Values injected when initializing
a service are also services.

#### Example:

In the code below `apiService` and `thingService` are examples of *injected* and
*made* services respectively.

```javascript
const inja = require('inja')
const apiProvider = require('./api')

const thingProvider = {
  inject () {
    return [apiProvider]
  },

  init (apiService) {
    return {
      get (id) {
        return apiService.get(`/things/${id}`)
      }
    }
  }
}

const thingService = inja().make(thingProvider)
```

### Container

Calling `inja()` returns a new container with its own injection context.
Singletons will be unique to this context. A container has a `make(provider)`
method used to initialize a service.

#### Example:

```javascript
const inja = require('inja')
const exampleProvider = require('./example')

const container = inja()

const exampleService = container.make(exampleProvider)
```

## Best Practices

### Bootstrapping

Ideally only one module in an application should have side effects. This module
is responsible for bootstrapping your application. With `inja`, you would
typically have a single application service which injects all of its
dependencies. In this case there is no need to export the inja container.

```javascript
const applicationProvider = require('./application')
const inja = require('inja')

// create a new injection container and initialize the application
inja().make(applicationProvider)
```

## License

Copyright 2018 Brent Burgoyne

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
