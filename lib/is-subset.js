function isSubset(a, b) {
  // Return false if types do not match
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    return false
  }
  // Compare objects
  if (typeof a === 'object' && !Array.isArray(a)) {
    for (const key in a) {
      if (!b.hasOwnProperty(key) || !isSubset(a[key], b[key])) {
        return false
      }
    }
  }
  // Compare arrays
  if (typeof a === 'object' && Array.isArray(a)) {
    for (const element of a) {
      if (b.indexOf(element) === -1) {
        return false
      }
    }
  }
  // Compare single items
  if (typeof a !== 'object') {
    return a === b
  }
  // Return true if the checks above did not return false
  return true
}

module.exports = isSubset
