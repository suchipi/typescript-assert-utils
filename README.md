# `typescript-assert-utils`

Some importable TypeScript types that help you make assertions about your types.

You can use these tools in your TypeScript project to "test" your types. This can be useful to verify that the types are working as intended, or to ensure that you don't accidentally make breaking changes to your APIs from a types perspective.

## Usage

- Install `typescript-assert-utils` with npm or yarn or pnpm or whatever Node.js package manager you like.
- In your TypeScript project, import `assert` and `Is`:

```ts
import { assert, Is } from "typescript-assert-utils"
```

- Use `assert` and `Is` on your types:

```ts
function myFunc<T>(t: T) {
  return t;
}

const result = myFunc({ hello: true });
assert<Is<typeof result, { hello: boolean }>>();
```

Then, run TypeScript normally to check for errors:

```sh
$ tsc
```

At runtime, `assert` is a no-op function.

### Excluding Assertions from Compiled Code

You may wish to exclude assertion-related code from your compiled code.

To do so, you may use the tsConfig [`stripInternal`](https://www.typescriptlang.org/tsconfig#stripInternal) option, in conjunction with `@internal` comments:
```ts
import { assert, Is } from "typescript-assert-utils"

function myFunc<T>(t: T) {
  return t;
}

// This will remove the following code block.
/** @internal */
{
  const result = myFunc({ hello: true });
  assert<Is<typeof result, { hello: boolean }>>();
}
```

Or, you can put your assertions in a separate file. The separate file must be part of your TypeScript project (ie. included by your tsconfig.json), but shouldn't get imported by any of your normal code:

`myFunc.ts`:
```ts
export function myFunc<T>(t: T) {
  return t;
}
```

`myFunc.type-assertions.ts`:
```ts
import { assert, Is } from "typescript-assert-utils"

import { myFunc } from "./myFunc";

const result = myFunc({ hello: true });
assert<Is<typeof result, { hello: boolean }>>();
```

## API

The following named exports are available:

### assert

Use this to cause an error at type-checking type if `T` is not `true`.

```ts
export function assert<T>(): void;
```

Note that `T` must be *exactly* the type `true`; `boolean` will not work.

Example:

```ts
import { assert, Is } from "@suchipi/typescript-assert-utils";

function add(a: number, b: number) {
  return a + b;
}

const result = add(1, 2);

assert<Is<typeof result, number>>();
assert<Is<ReturnType<typeof add>, number>>();

// Error: Type 'false' does not satisfy the constraint 'true'.
assert<Is<typeof result>, string>();
```

### Is

true when `T` is exactly `U`, and false otherwise.

```ts
export type Is<T, U> = true | false;
```

Note that, unlike the rest of TypeScript, `Is` does not consider `any` to be assignable to anything other than `any`. In other words, `Is<any, string>` is `false`.

Example:

```ts
import { assert, Is } from "@suchipi/typescript-assert-utils";

function add(a: number, b: number) {
  return a + b;
}

const result = add(1, 2);

assert<Is<typeof result, number>>();
assert<Is<ReturnType<typeof add>, number>>();

// Error: Type 'false' does not satisfy the constraint 'true'.
assert<Is<typeof result>, string>();
```

### Not

false if `T` is true; true otherwise

```ts
export type Not<T> = false | true;
```

Example:

```ts
import { assert, Is, Not } from "@suchipi/typescript-assert-utils";

const something = 4;

// No error
assert<Is<typeof something>, number>();

// Error: Type 'false' does not satisfy the constraint 'true'.
assert<Is<typeof something>, string>();

// No error because we inverted the expression with Not
assert<Not<Is<typeof something>, string>>();
```

### IsAny

true if `T` is the special type `any`; false otherwise

```ts
export type IsAny<T> = true | false;
```

Example:

```ts
import { assert, IsAny } from "@suchipi/typescript-assert-utils";

const something = 4;

// No error
assert<IsAny<any>>();

// Error: Type 'false' does not satisfy the constraint 'true'.
assert<IsAny<number>>();
```

### IsNever

true if `T` is the special type `never`; false otherwise

```ts
export type IsNever<T> = true | false;
```

Example:

```ts
import { assert, IsNever } from "@suchipi/typescript-assert-utils";

const something = 4;

// No error
assert<IsNever<never>>();

// Error: Type 'false' does not satisfy the constraint 'true'.
assert<IsNever<number>>();
```

## License

MIT
