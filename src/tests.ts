import {
  Is,
  IsAny,
  IsAssignable,
  IsNever,
  Not,
  assert,
  assertIsAssignableTo,
} from "./index";

assert<Not<false>>();
// @ts-expect-error
assert<Not<true>>();

assert<IsAny<any>>();

// @ts-expect-error
assert<IsAny<never>>();
assert<Not<IsAny<never>>>();

assert<IsNever<never>>();
// @ts-expect-error
assert<IsNever<any>>();
// @ts-expect-error
assert<IsNever<string>>();

assert<Is<string, string>>();
assert<Is<any, any>>();
assert<Is<never, never>>();
assert<Is<1 | 2, 2 | 1>>();

// @ts-expect-error
assert<Is<1 | never, never>>();

// @ts-expect-error
assert<Is<1 | 2 | 3, 2 | 1>>();

assert<Is<"a" | "b", "b" | "a">>();

// @ts-expect-error
assert<Is<string, number>>();
// @ts-expect-error
assert<Is<string, never>>();

assert<Not<Is<string, number>>>();

// @ts-expect-error
assert<Is<string, any>>();
assert<Not<Is<string, any>>>();

assert<IsAssignable<"five", string>>();
// @ts-expect-error
assert<IsAssignable<string, "five">>();
assert<Not<IsAssignable<string, "five">>>();

assert<IsAssignable<45, number>>();

// @ts-expect-error
assert<IsAssignable<45, { a: 5 }>>();

assertIsAssignableTo<string>("five");

// @ts-expect-error
assertIsAssignableTo<"five">(string);

assertIsAssignableTo<number>(45);

// @ts-expect-error
assertIsAssignableTo<{ a: 5 }>(45);
