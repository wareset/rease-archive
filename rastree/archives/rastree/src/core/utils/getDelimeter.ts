import { enumChars } from 'enum-chars'

export const getDelimeter = (
  content: string,
  // eslint-disable-next-line default-param-last
  salt = '_',
  type?: 'lowers' | 'uppers' | 'numbers' | 'letters'
): string => {
  let res: string
  let rand = ''
  const fn = type && enumChars[type] ? enumChars[type] : enumChars.letters
  do rand = fn(rand)
  while (content.indexOf(res = salt + rand) > -1)
  return res
}
