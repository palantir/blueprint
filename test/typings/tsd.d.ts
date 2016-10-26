/// <reference path="sinon/sinon.d.ts" />

/*
NOTE

Sinon lives here instead of @types because the two typings seem to encourage different usages,
and this one better fits ours.

With this typings file, a global `sinon` variable is declared so tests can easily reference `sinon.spy()`
without an import. The `karma-sinon` plugin supports this usage.

Conversely, the @types version _does not_ declare that global correctly so the package must be imported.
But `import "sinon"` causes all sorts of webpack issues where the dependencies cannot be analyzed.
*/
