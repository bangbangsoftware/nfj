import {Type} from '@angular/core';

export class FakeRouter {
  public where: Array<string>;
  constructor(private rootComponentType: Type<any>) { }

  navigate(where) {
    console.log('FAKE ROUTER: navigate to -"' + where + '"');
    this.where = where;
    console.log(this.rootComponentType);
  }
}

export class FakeLocation {
  constructor(public pathValue: string) { }
  path() {
    return this.pathValue;
  }
}

export class FakeDirection {
  constructor() { }
}

export class FakeDB {
  constructor() { }
}
