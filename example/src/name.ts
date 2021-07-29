import upperCase from 'lodash/upperCase'
import set from 'lodash/set'
import map from 'lodash/map'

export function getName() {
  console.log(set({}, 'as', 's'))
  console.log(map([]))
  return upperCase(__NAME__)
}
