/** Use this to cause an error at type-checking type if `T` is not `true`. */
export function assert<T extends true>(): void {}

/** false if `T` is true; true otherwise */
export type Not<T extends boolean> = T extends true ? false : true;

assert<Not<false>>();
// @ts-expect-error
assert<Not<true>>();

// `any` and `never` are the only values of `T` for which `T extends never` is true.
// The outer `boolean extends...` filters out the `never`, because `any` is the only value
// that universally returns the consequent of an `extends` type expression.
/** true if `T` is the special type `any`; false otherwise */
export type IsAny<T> = boolean extends (T extends never ? true : false)
  ? true
  : false;

assert<IsAny<any>>();

// @ts-expect-error
assert<IsAny<never>>();
assert<Not<IsAny<never>>>();

/** true if `T` is the special type `never`; false otherwise */
// Info about why we put brackets around T and never:
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
export type IsNever<T> = [T] extends [never] ? true : false;

assert<IsNever<never>>();
// @ts-expect-error
assert<IsNever<any>>();
// @ts-expect-error
assert<IsNever<string>>();

type CanTypesExtendEachOther<T, U> = U extends T
  ? T extends U
    ? true
    : false
  : false;

/** true if `T` is a union type; false otherwise */
type IsUnion<T> = CanTypesExtendEachOther<T, T> extends true
  ? false
  : CanTypesExtendEachOther<T, T> extends false
  ? false
  : // CanTypesExtendEachOther resolves to "boolean" for unions (instead of true or false), because each union member might not be equivalent to other members in the union
    true;

const uniqueUnionMember = Symbol("uniqueUnionMember");
type uniqueUnionMember = typeof uniqueUnionMember;

// `Is` for union types
type AreUnionTypesEquivalent<T, U> = CanTypesExtendEachOther<
  Exclude<T | uniqueUnionMember, U>,
  uniqueUnionMember
> extends true
  ? CanTypesExtendEachOther<
      Exclude<U | uniqueUnionMember, T>,
      uniqueUnionMember
    > extends true
    ? true
    : false
  : false;

/** true when `T` is exactly `U`, and false otherwise. */
// prettier-ignore
export type Is<T, U> =
  IsAny<T> extends true ?
    IsAny<U> extends true ?
      true 
    : false
  : IsUnion<T> extends true ?
    IsUnion<U> extends true ?
      AreUnionTypesEquivalent<T, U>
    : false
  : IsNever<T> extends true ?
    IsNever<U> extends true ?
      true
    : false
  : IsNever<U> extends true ?
    IsNever<T> extends true ?
      true
    : false
  : CanTypesExtendEachOther<T, U> extends true ?
    true
  : false;

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
