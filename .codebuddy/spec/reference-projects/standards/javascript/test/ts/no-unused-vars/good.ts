export interface IModel {
  toList(isCompact: boolean): any[];
}

export class EmptyModel implements IModel {
  toList(_isCompact: boolean) {
    return [];
  }
}

export class MyModel implements IModel {
  private data: any[];
  toList(isCompact: boolean) {
    return isCompact ? this.data.flat() : this.data;
  }
}

(function () {
  const a = new EmptyModel();
  a.toList(true);
})();

const match = location.href.match(/^(.+):\/\/(.+):(\d+)\/?/);

const [_result, _protocol, _hostname, port] = match;
console.log(port);
