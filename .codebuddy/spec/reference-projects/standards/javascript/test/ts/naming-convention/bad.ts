const FOO = 123;

export const isTrue = true;
export const foo = 123;
export const bar = 'abc';
export const INSTANCE = new Object();
export const OBJ = {};

interface fOo {
  __str__: string;
}

class fOo implements fOo {
  __str__ = 'foobar';

  public Print() {
    this.__log__();
  }

  private __log__() {
    console.log(this.__str__);
  }
}
