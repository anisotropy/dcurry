import { dcurry, toArrParams, toDictParams } from './dCurry'

describe('dcurry()', () => {
  describe('All required', () => {
    const fn = ({ a, b, c, d, e }: { a: number; b: string; c: number; d: string; e: number }) =>
      `${a}-${b}-${c}-${d}-${e}`
    const curriedFn = dcurry(['a', 'b', 'c', 'd', 'e'], fn)
    test(`({ a: 1, b: '2', c: 3, d: '4', e: 5 })`, () => {
      const result = curriedFn({ a: 1, b: '2', c: 3, d: '4', e: 5 })
      expect(result).toBe('1-2-3-4-5')
    })
    test(`({ a: 1, b: '2'})({ c: 3, d: '4', e: 5 })`, () => {
      const result = curriedFn({ a: 1, b: '2' })({ c: 3, d: '4', e: 5 })
      expect(result).toBe('1-2-3-4-5')
    })
    test(`({ a: 1, b: '2'})({ c: 3, d: '4'})({ e: 5 })`, () => {
      const result = curriedFn({ a: 1, b: '2' })({ c: 3, d: '4' })({ e: 5 })
      expect(result).toBe('1-2-3-4-5')
    })
    test(`({ c: 3, d: '4' })({ e: 5 })({ a: 1, b: '2' })`, () => {
      const result = curriedFn({ c: 3, d: '4' })({ e: 5 })({ a: 1, b: '2' })
      expect(result).toBe('1-2-3-4-5')
    })
    test(`({ a: 1 })({ b: '2' })({ c: 3 })({ d: '4' })({ e: 5 })`, () => {
      const result = curriedFn({ a: 1 })({ b: '2' })({ c: 3 })({ d: '4' })({ e: 5 })
      expect(result).toBe('1-2-3-4-5')
    })
    test(`({ d: '4' })({ e: 5 })({ a: 1 })({ b: '2' })({ c: 3 })`, () => {
      const result = curriedFn({ d: '4' })({ e: 5 })({ a: 1 })({ b: '2' })({ c: 3 })
      expect(result).toBe('1-2-3-4-5')
    })
  })

  describe('Optional', () => {
    const fn = ({ a, b, c, d, e }: { a?: number; b?: string; c: number; d: string; e?: number }) =>
      `${a ?? 'a'}-${b ?? 'b'}-${c}-${d}-${e ?? 'e'}`
    const curriedFn = dcurry(['a', 'b', 'c', 'd', 'e'], fn)
    test(`({ a: undefined, b: undefined, c: 3, d: '4', e: undefined })`, () => {
      const result = curriedFn({ a: undefined, b: undefined, c: 3, d: '4', e: undefined })
      expect(result).toBe('a-b-3-4-e')
    })
    test(`({ a: undefined, b: undefined })({ c: 3, d: '4', e: undefined })`, () => {
      const result = curriedFn({ a: undefined, b: undefined })({ c: 3, d: '4', e: undefined })
      expect(result).toBe('a-b-3-4-e')
    })
    test(`({ a: undefined, b: undefined })({ c: 3, d: '4' })({ e: undefined })`, () => {
      const result = curriedFn({ a: undefined, b: undefined })({ c: 3, d: '4' })({ e: undefined })
      expect(result).toBe('a-b-3-4-e')
    })
    test(`({ c: 3, d: '4' })({ e: undefined })({ a: undefined, b: undefined })`, () => {
      const result = curriedFn({ c: 3, d: '4' })({ e: undefined })({ a: undefined, b: undefined })
      expect(result).toBe('a-b-3-4-e')
    })
    test(`({ a: undefined })({ b: undefined })({ c: 3 })({ d: '4' })({ e: undefined })`, () => {
      const result = curriedFn({ a: undefined })({ b: undefined })({ c: 3 })({ d: '4' })({ e: undefined })
      expect(result).toBe('a-b-3-4-e')
    })
    test(`({ d: '4' })({ e: undefined })({ a: undefined })({ b: undefined })({ c: 3 })`, () => {
      const result = curriedFn({ d: '4' })({ e: undefined })({ a: undefined })({ b: undefined })({ c: 3 })
      expect(result).toBe('a-b-3-4-e')
    })
  })
})

describe('toDictParams', () => {
  describe(`fn: (a: number, b: string) => string`, () => {
    const fn = (a: number, b: string) => `${a}-${b}`
    test(`['a', 'b'], { a: 1, b: '2' }`, () => {
      const fnWithDictParams = toDictParams(['a', 'b'], fn)
      expect(fnWithDictParams({ a: 1, b: '2' })).toBe('1-2')
    })
    test(`'keys.length' should be same as 'fn.length'.`, () => {
      expect(() => toDictParams(['a'], fn)).toThrowError(/\w+/)
    })
  })
  describe(`fn: (a: number, b?: string) => string`, () => {
    const fn = (a: number, b?: string) => `${a}-${b}`
    test(`['a', 'b'], { a: 1, b: '2' }`, () => {
      const fnWithDictParams = toDictParams(['a', 'b'], fn)
      expect(fnWithDictParams({ a: 1, b: '2' })).toBe('1-2')
    })
    test(`['a', 'b'], { a: 1 }`, () => {
      const fnWithDictParams = toDictParams(['a', 'b'], fn)
      expect(fnWithDictParams({ a: 1 })).toBe('1-undefined')
    })
    test(`'keys.length' should be same as 'fn.length'.`, () => {
      expect(() => toDictParams(['a', 'b', 'c'], fn)).toThrowError(/\w+/)
    })
  })
  describe(`fn: (a?: number, b?: string) => string`, () => {
    const fn = (a?: number, b?: string) => `${a}-${b}`
    test(`['a', 'b'], { a: 1, b: '2' }`, () => {
      const fnWithDictParams = toDictParams(['a', 'b'], fn)
      expect(fnWithDictParams({ a: 1, b: '2' })).toBe('1-2')
    })
    test(`['a', 'b'], { a: 1 }`, () => {
      const fnWithDictParams = toDictParams(['a', 'b'], fn)
      expect(fnWithDictParams({ a: 1 })).toBe('1-undefined')
    })
    test(`['a', 'b'], {}`, () => {
      const fnWithDictParams = toDictParams(['a', 'b'], fn)
      expect(fnWithDictParams({})).toBe('undefined-undefined')
    })
    test(`'keys.length' should be same as 'fn.length'.`, () => {
      expect(() => toDictParams(['a'], fn)).toThrowError(/\w+/)
    })
  })
})

describe('toArrParams', () => {
  test(`(1, '2')`, () => {
    const fn = (params: { a: number; b: string }) => `${params.a}-${params.b}`
    const fnWithArrParams = toArrParams(['a', 'b'], fn)
    expect(fnWithArrParams(1, '2')).toBe('1-2')
  })
  test(`(1, undefined)`, () => {
    const fn = (params: { a: number; b?: string }) => `${params.a}-${params.b}`
    const fnWithArrParams = toArrParams(['a', 'b'], fn)
    expect(fnWithArrParams(1)).toBe('1-undefined')
  })
  test(`(undefined, '2')`, () => {
    const fn = (params: { a?: number; b: string }) => `${params.a}-${params.b}`
    const fnWithArrParams = toArrParams(['a', 'b'], fn)
    expect(fnWithArrParams(undefined, '2')).toBe('undefined-2')
  })
})
