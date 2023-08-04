# Cloudflare Workers JS-Intepreter demo

This repository is a demo of how to setup [NeilFraser/JS-Interpreter](https://github.com/NeilFraser/JS-Interpreter) to
run in Cloudflare Workers.

## Quickstart

```
yarn
yarn start
```

Hit the endpoint. You should get the response, `Yori`.

## Explanation

`JS-Interpreter` doesn't have an official NPM package, and the current third party packages are not up to
date (see [this issue](https://github.com/NeilFraser/JS-Interpreter/issues/216) on the current state of `JS-Interpreter`
NPM packages). To handle this, I have created a minimal fork of
[JS-Interpreter](https://github.com/yorinasub17/JS-Interpreter) that has a minimal `package.json` file that allows
installing the package over GitHub (on the branch [pkgd](https://github.com/yorinasub17/JS-Interpreter/tree/pkgd)).

This allows installing the package with:

```
yarn add 'js-interpreter@https://github.com/yorinasub17/JS-Interpreter#20230804'
```

so that it can be imported in the Cloudflare workers code.

Note that this is a minimal fork to make it easier to pull in updates to the upstream changes. This means that it does
not include the necessary exports to be able to access the `Interpreter` object without `globalThis`.

Meaning, you can't do

```typescript
// THIS DOESN'T WORK
import Interpreter from "js-interpreter/acorn_interpreter.js";
```

like you would expect. You must do

```typescript
// This loads Interpreter into globalThis, making it accessible as "globalThis.Interpreter".
import "js-interpreter/interpreter.js";
```

Additionally, the provided `acorn.js` file in `js-interpreter` doesn't automatically load the `acorn` object into
`globalThis` like the browser environment even if you import it. This breaks the `Interpreter` object as it expects
being able to access acorn from `globalThis.acorn.parse`. To support this, you should install the
[acorn](https://www.npmjs.com/package/acorn) npm package and bind it manually in the workers runtime:

```typescript
import "js-interpreter/interpreter.js";
import * as acorn from "acorn";
globalThis.acorn = acorn;
```

After this, you should be able to access the `Interpreter` object using `globalThis.Interpreter`.
