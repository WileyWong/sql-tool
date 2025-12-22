const foo = 123;

export const IS_TRUE = true;
export const FOO = 123;
export const BAR = 'abc';
export const instance = new Object();
export const obj = {};

interface Foo {
  str: string;
}

class Foo implements Foo {
  str = 'foobar';

  public print() {
    this.log();
  }

  private log() {
    console.log(this.str);
  }
}
