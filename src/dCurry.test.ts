import { dCurry } from './dCurry'

describe('dCurry()', () => {
  describe('All required', () => {
    const fn = ({ a, b, c, d, e }: { a: number; b: string; c: number; d: string; e: number }) =>
      `${a}-${b}-${c}-${d}-${e}`
    const curriedFn = dCurry(['a', 'b', 'c', 'd', 'e'], fn)
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
    const curriedFn = dCurry(['a', 'b', 'c', 'd', 'e'], fn)
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

    // Should not use union
  })
})
