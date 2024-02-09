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

// @level 1
const toDictParams = <ArrParams extends unknown[], Keys extends string[], R>(
  keys: readonly [...Keys],
  fn: (...arrParams: ArrParams) => R
) => {
  type DictParams = {
    [K in keyof Omit<ArrParams, keyof unknown[]> as K extends keyof Keys
      ? Keys[K] extends PropertyKey
        ? Keys[K]
        : Keys[number]
      : Keys[number]]: ArrParams[K]
  }
  if (keys.length !== fn.length) throw new Error(`'keys.length' should be same as 'fn.length'.`)
  return (dictParams: DictParams) => {
    const arrParams = keys.map((key) => dictParams[key as unknown as keyof typeof dictParams]) as ArrParams
    return fn(...arrParams)
  }
}

// @level 1
const toArrParams = <DictParams extends Dict, Keys extends (keyof DictParams)[], Return>(
  keys: readonly [...Keys],
  fn: (dictParams: DictParams) => Return
) => {
  type InverseKeys = { [K in keyof Keys as Keys[K] extends PropertyKey ? Keys[K] : Keys[number]]: K }
  type ArrParams = { [K in keyof DictParams as InverseKeys[K]]: DictParams[K] } & DictParams[keyof DictParams][]
  return (...arrParams: ArrParams) => {
    const dictParams = keys.reduce((dictParams, key, index) => {
      dictParams[key] = arrParams[index]
      return dictParams
    }, {} as DictParams)
    return fn(dictParams)
  }
}

export { dcurry, toDictParams, toArrParams }
