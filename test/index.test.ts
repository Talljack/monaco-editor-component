import { describe, expect, it } from 'vitest'
import { formatWidth } from '../src/utils'

describe('utils/formatWidth', () => {
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
