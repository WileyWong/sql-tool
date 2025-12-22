(function example() {
  const a = 1;
  const b = a;
  const c = a;
}());

// throws ReferenceError
console.log(a);
// throws ReferenceError
console.log(b);
// throws ReferenceError
console.log(c);
