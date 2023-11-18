import { formatWidth } from '@/utils'
import { describe, expect, it } from 'vitest'

describe('test', () => {
  it('formatWidth', () => {
    it('percent', () => {
      expect(formatWidth('50%')).toBe('50%')
    })
    it('number', () => {
      expect(formatWidth(50)).toBe('50px')
    })
    it('string', () => {
      expect(formatWidth('50px')).toBe('50px')
    })
    it('undefined', () => {
      expect(formatWidth(undefined)).toBe('100%')
    })
  })
})
