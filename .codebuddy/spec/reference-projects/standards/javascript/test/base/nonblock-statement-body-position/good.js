function foo() {
  // good
  if (test) return false;

  // good
  if (test) {
    return false;
  }
}

// bad
function bar() { return false; }

// good
function baz() {
  return false;
}
