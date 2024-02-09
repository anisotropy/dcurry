# dcurry

`dcurry`는 주어진 함수를 커리한다. 하지만 [Ramda.curry](https://ramdajs.com/docs/#curry)와는 다르게 해당 함수의 인자는 단 하나의 dictionary(object)이어야만 한다. 예를 들어, `f`가 `{ a: number, b: number, c: number }` 타입의 인자를 입력받는 함수이고 `g`가 `dcurry(['a', 'b', 'c'], f)`라면, 다음 구문은 모두 동일하다.

- `g({ a: 1 })({ b: 2 })({ c: 3 })`
- `g({ a: 1, b: 2 })({ c: 3 })`
- `g({ a: 1 })({ b: 2, c: 3 })`
- `g({ a: 1, b: 2, c: 3 })`

[Ramda.curry](https://ramdajs.com/docs/#curry)와 비교했을 때 `dcurry`의 장점은, argument의 순서를 고려하지 않아도 된다는 것이다. [Ramda.curry](https://ramdajs.com/docs/#curry)의 경우 첫 번째 argument를 입력받는 함수를 생성하고 싶다면, 다음과 같이 `R.__`라는 다소 '어색한' placeholder를 사용해야 하지만,

```ts
g(R.__, 2, 3)
```

`dcurry`의 경우에는 첫 번째 argument를 제외한 모든 argument를 입력하기만 하면 된다.

```ts
g({ b: 2, c: 3 })
```

따라서 다음의 경우는 모두 동일한 것을 의미한다.

- `g({ c: 3 })({ b: 2 })({ a: 1 })`
- `g({ b: 2 })({ c: 3 })({ a: 1 })`
- `g({ c: 2 })({ a: 1, c: 3 })`
- `g({ a: 1, b: 3 })({ b: 2 })`

## 설치

```bash
pnpm add dcurry
```

또는

```bash
npm i dcurry
```

## 사용법

### `dcurry`

예를 들어, 다음과 같은 함수가 있다면,

```ts
const fn = (params: { a: number; b: number; c: number }) => `${a}-${b}-${c}`
```

이 함수를 커리하기 위해서는 인자로 주어지는 딕션어리의 모든 key의 배열을 `dcurry`의 첫 번째 인자로 입력해야 한다.

```ts
import { dcurry } from 'dcurry'

const curriedFn = dcurry(['a', 'b', 'c'], fn)
```

커리된 함수 `curriedFn`는 다음과 같은 방식으로 사용될 수 있다.

```ts
const curriedFn2 = curriedFn({ b: 2, c: 3 })
curredFn2({ a: 1 }) // -> 1-2-3
```

만약 인자로 주어지는 딕션어리 중 optional한 key가 있다면, 해당 value를 입력할 때는 `undefined`를 사용해야만 한다.

```ts
const fn = (params: { a?: number; b: number; c: number }) => `${a ?? 'a'}-${b}-${c}`

const curriedFn = dcurry(['a', 'b', 'c'], fn)

const curriedFn2 = curriedFn({ b: 2, c: 3 })
curredFn2({ a: undefined }) // -> a-2-3
```

### `toDictParams`

`toDictParams`는 배열 매개변수를 가진 함수를 딕션어리 매개변수를 가진 함수로 변환합니다.

```ts
const fn = (a: number, b?: string) => `${a}-${b}`

toDictParams(['a', 'b'], fn) // -> ({ a: number, b?: string }) => string
```

디폴트 매개변수를 사용하면 안된다는 점에 주의하세요.

```ts
const fn = (a: number, b = '3') => `${a}-${b}`

toDictParams(['a', 'b'], fn) // 에러가 발생합니다.
```

### `toArrParams`

`toArrParams`는 딕션어리 매개변수를 가진 함수를 배열 매개변수를 가진 함수로 변환합니다.

```ts
const fn = (params: { a: number; b?: string }) => `${params.a}-${params.b}`

toArrParams(['a', 'b'], fn) // -> (a: number, b?: string) => string
```
