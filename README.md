# dcurry

[한국어 버전](https://github.com/anisotropy/dcurry/blob/main/README.ko.md)

`dcurry` curries a given function. However, unlike [Ramda.curry](https://ramdajs.com/docs/#curry), the arguments for this function must be a single dictionary (object). For example, if `f` is a function that takes an argument of type `{ a: number, b: number, c: number }` and `g` is `dcurry(['a', 'b', 'c'], f)`, the following expressions are equivalent:

- `g({ a: 1 })({ b: 2 })({ c: 3 })`
- `g({ a: 1, b: 2 })({ c: 3 })`
- `g({ a: 1 })({ b: 2, c: 3 })`
- `g({ a: 1, b: 2, c: 3 })`

The advantage of `dcurry` over [Ramda.curry](https://ramdajs.com/docs/#curry) is that you don't need to consider the order of arguments. In the case of [Ramda.curry](https://ramdajs.com/docs/#curry), if you want to create a function that takes the first argument, you need to use a somewhat awkward placeholder `R.__`, like this:

```ts
g(R.__, 2, 3)
```

In the case of `dcurry`, you just need to input all arguments except the first one:

```ts
g({ b: 2, c: 3 })
```

Therefore, the following cases all mean the same thing:

- `g({ c: 3 })({ b: 2 })({ a: 1 })`
- `g({ b: 2 })({ c: 3 })({ a: 1 })`
- `g({ c: 2 })({ a: 1, c: 3 })`
- `g({ a: 1, b: 3 })({ b: 2 })`

## Installation

```bash
pnpm add dcurry
```

or

```bash
npm i dcurry
```

## Usage

For example, if you have the following function:

```ts
const fn = (params: { a: number; b: number; c: number }) => `${a}-${b}-${c}`
```

To curry this function, you need to input an array of all keys of the dictionary given as an argument to `dcurry` as the first argument:

```ts
import { dcurry } from 'dcurry'

const curriedFn = dcurry(['a', 'b', 'c'], fn)
```

The curried function `curriedFn` can be used as follows:

```ts
const curriedFn2 = curriedFn({ b: 2, c: 3 })
curredFn2({ a: 1 }) // -> 1-2-3
```

If there are optional keys in the dictionary given as an argument, when entering the value for that key, you must use `undefined`:

```ts
const fn = (params: { a?: number; b: number; c: number }) => `${a ?? 'a'}-${b}-${c}`

const curriedFn = dcurry(['a', 'b', 'c'], fn)

const curriedFn2 = curriedFn({ b: 2, c: 3 })
curredFn2({ a: undefined }) // -> a-2-3
```
