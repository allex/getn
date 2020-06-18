# getn

Helper for get a value from an object by its path, support dot paths

## Installation

```sh
yarn add getn -D
```

## Usage

```js
import { getv, parseNs } from 'getn'

const o = {
  a: {
    c: {
      n: 'a.c.n',
      d: {
        n: 'a.c.d.n'
      }
    },
    'c.d': {
      f: 4,
      'k.n': 5,
      'o.b': {
        k1: '6'
      }
    }
  }
}

const path = 'a.c.d.o.b.k1'
const model = parseNs(o, path.split('.'))

console.log(model) // { o: o.a['c.d']['o.b'], k: 'k1', v: 6, n: 0 }
console.log(getv(o, 'a.c.d.n')) // 'a.c.d.n'
console.log(getv(o, 'a.c.d.o.b.k1')) // 6
```

## License

[MIT](http://opensource.org/licenses/MIT) Copyright (c) [Allex Wang][1]

[1]: https://github.com/allex/
