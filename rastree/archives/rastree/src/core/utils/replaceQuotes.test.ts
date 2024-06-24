import { replaceQuotes } from './replaceQuotes'

test('replaceQuotes', () => {
  expect(replaceQuotes('"12"')).toBe('"12"')
  expect(replaceQuotes('"12\\"12"')).toBe(JSON.stringify('12"12'))
  expect(replaceQuotes('"12\\\\"12"')).toBe(JSON.stringify('12\\"12'))
  expect(replaceQuotes('"12\\\\\\\\"12"')).toBe(JSON.stringify('12\\\\"12'))
  expect(replaceQuotes('"12\\"12`12"')).toBe(JSON.stringify('12"12`12'))
  expect(replaceQuotes('"12\n12"')).toBe(JSON.stringify('12\n12'))

  expect(replaceQuotes('`12`')).toBe('"12"')
  expect(replaceQuotes('`12\\`12`')).toBe(JSON.stringify('12`12'))
  expect(replaceQuotes('`12\\`12"12`')).toBe(JSON.stringify('12`12"12'))
  expect(replaceQuotes('`12\n12`')).toBe(JSON.stringify('12\n12'))

  expect(replaceQuotes(`'12\n
12'`)).toBe(JSON.stringify(`12\n
12`))

  expect(replaceQuotes(`"12\n
12"`)).toBe(JSON.stringify(`12\n
12`))

  expect(replaceQuotes('`12\\n12`')).toBe(JSON.stringify('12\n12'))
})
