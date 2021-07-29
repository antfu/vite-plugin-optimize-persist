import upperCase from 'lodash/upperCase'

export function getName() {
  return upperCase(__NAME__)
}
