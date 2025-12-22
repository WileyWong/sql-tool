const promise1 = (value) => new Promise((resolve, reject) => {
  setTimeout(() => resolve(value), 1000);
});

async function foo1() {
  if (await promise1(1)) {
    // Do something
  }
}
