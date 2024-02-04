type Dict = Record<string, unknown>

// @level 11
const difference = <T1>(one: T1[], other: unknown[]) => one.filter((el) => !other.includes(el))

// @level 10
const union = <T1, T2>(one: T1[], other: T2[]) => [...difference(one, other), ...other]

// @level 10
const equals = <T>(one: T[], other: unknown[]): other is T[] =>
  difference(one, other).length === 0 && difference(other, one).length === 0

// @level 10
const keysOf = <T extends Dict>(dic: T) => Object.keys(dic) as unknown as (keyof T)[]

// @level 2
const dictCurry = <I extends Dict, A extends Dict, R>(keys: (keyof A)[], fn: (params: A) => R, insertedParams: I) => {
  return <T extends Partial<Omit<A, keyof I>>>(params: T) => {
    type Return = T & I extends Required<A> ? R : ReturnType<typeof dictCurry<T & I, A, R>>
    if (equals(keys, union(keysOf(params), keysOf(insertedParams)))) {
      return fn({ ...params, ...insertedParams } as A) as Return
    }
    // eslint-disable-next-line stratified-design/no-same-level-funcs
    return dictCurry(keys, fn, { ...params, ...insertedParams }) as Return
  }
}

// @level 1
const dcurry = <A extends Dict, R>(keys: (keyof A)[], fn: (params: A) => R) => dictCurry(keys, fn, {})

type Tuple<Arr extends unknown[]> = Omit<Arr, keyof unknown[]>

type KeysFor<Arr extends unknown[]> = PropertyKey[] & Record<keyof Tuple<Arr>, PropertyKey>

type ToDict<Values extends unknown[], Keys extends KeysFor<Values>> = {
  [K in keyof Tuple<Values> as Keys[K]]: Values[K]
}

// @level 1
const toDictParams = <ArrParams extends unknown[], Keys extends KeysFor<ArrParams>, R>(
  keys: readonly [...Keys],
  fn: (...arrParams: [...ArrParams]) => R
) => {
  if (keys.length !== fn.length) throw new Error(`'keys.length' should be same as 'fn.length'.`)
  return (dictParams: ToDict<ArrParams, Keys>) => {
    const arrParams = keys.map((key) => dictParams[key as unknown as keyof typeof dictParams]) as ArrParams
    return fn(...arrParams)
  }
}

export { dcurry, toDictParams }
