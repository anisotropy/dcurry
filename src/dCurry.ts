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
const dCurry = <A extends Dict, R>(keys: (keyof A)[], fn: (params: A) => R) => dictCurry(keys, fn, {})

export { dCurry }
