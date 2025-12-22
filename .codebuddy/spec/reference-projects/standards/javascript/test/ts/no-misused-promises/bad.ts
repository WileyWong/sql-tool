const promise2 = (value) => new Promise((resolve, reject) => {
  setTimeout(() => resolve(value), 1000);
});

async function foo2() {
  if (promise2(1)) {
    // Do something
  }
}