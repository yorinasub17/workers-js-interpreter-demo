# Cloudflare Workers JS-Intepreter demo

This repository is a demo of how to setup [NeilFraser/JS-Interpreter](https://github.com/NeilFraser/JS-Interpreter) to
run in Cloudflare Workers.

Note that this is a minimal effort integration and is not the most ideal way to integrate the two. Namely:

- `Interpreter` and `acorn` is added to the global this object.

## Quickstart

```
pnpm
pnpm start
```

Hit the endpoint. You should get the response, `Yori`.

## Explanation

`JS-Interpreter` doesn't have an official NPM package, and the current third party packages are not up to
date (see [this issue](https://github.com/NeilFraser/JS-Interpreter/issues/216) on the current state of `JS-Interpreter`
NPM packages). So instead, we install it through the git integration in NPM/PNPM, e.g:

```
pnpm add github:NeilFraser/JS-Interpreter
```

> This doesn't work for yarn, since it requires a package.json file and the source repo doesn't have one.
> You can instead use [my minimal fork](https://github.com/yorinasub17/JS-Interpreter/tree/pkgd), which only has a
> package.json file.
>
> E.g., `yarn add 'JS-Interpreter@https://github.com/yorinasub17/JS-Interpreter#20230804'`

Note that `JS-Interpreter` is optimized for the browser environment, and thus doesn't export the objects.
Meaning, you can't do

```typescript
// THIS DOESN'T WORK
import Interpreter from "JS-Interpreter/acorn_interpreter.js";
```

like you would expect. You must do

```typescript
// This loads Interpreter into globalThis, making it accessible as "globalThis.Interpreter".
import "JS-Interpreter/interpreter.js";
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
