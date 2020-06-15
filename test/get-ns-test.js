import assert from 'assert'

import { getv, parseNs } from '../'

describe('getv', () => {
  const object = {
    foo: {
      bar: 1
    },
    baz: 5,
    lor: ['mir', 'dal'],
    tar: false
  }

  const array = [
    {
      id: 1,
      name: 'Test'
    }
  ]

  it('should return undefined when path is incorrect', () => {
    assert.equal(getv(object, 'none.bar'), undefined)
  })

  it('should return undefined when path is incorrect, even if it is deeply nested', () => {
    assert.equal(getv(object, 'none.bar.nor.gar'), undefined)
  })

  it('should be able to return false', () => {
    assert.equal(getv(object, 'tar'), false)
  })

  it('should return a default value when path is incorrect and a default value is specified', () => {
    assert.equal(getv(object, 'none.bar', 'default'), 'default')
  })

  it('should return 5 for baz', () => {
    assert.equal(getv(object, 'baz'), 5)
  })

  it('should return 1 for foo.bar', () => {
    assert.equal(getv(object, 'foo.bar'), 1)
  })

  it('should return "dal" for index 1 of lor', () => {
    assert.equal(getv(object, 'lor.1'), 'dal')
  })

  it('should ignore default value if path is correct', () => {
    assert.equal(getv(object, 'lor.1'), 'dal')
  })

  it('should accept array', () => {
    assert.equal(getv(array, '0.id'), 1)
  })

  it('should treat missing inner array as undefined', () => {
    assert.equal(getv(array, '0.items', []).length, 0)
  })
})

describe('parseNs', () => {
  var o = {
    a: {
      b: {
        c: {
          d: 1,
          'k.k': 'k'
        }
      },
      'c.d': {
        f: 4,
        'k.n': 5,
        'o.b': {
          k1: '6'
        }
      },
      'c.d.e': 7,
      'attrs.tt': [1, 2, 3, 4]
    },
    'tar': false
  }

  const checkNs = (ns, hostObj, k) => {
    ns = typeof ns === 'string' ? ns.split('.') : ns
    const x = ns.join('.')
    const model = parseNs(o, ns)
    assert.deepEqual(model.k, k, x + '/k')
    assert.deepEqual(model.v, hostObj[k], x + '/v')
    assert.deepEqual(model.o, hostObj, x + '/o')
    assert.equal(model.n, 0, x + '/n')
  }

  test('parse by ns path', () => {
    checkNs('a.b', o.a, 'b')
    checkNs('a.b.c.d', o.a.b.c, 'd')
    checkNs('a.c.d', o.a, 'c.d')
    checkNs('a.c.d.f', o.a['c.d'], 'f')
    checkNs('a.c.d.k.n', o.a['c.d'], 'k.n')
    checkNs('a.c.d.o.b.k1', o.a['c.d']['o.b'], 'k1')
    checkNs('a.c.d.e', o.a, 'c.d.e')
    checkNs('a.attrs.tt.3', o.a['attrs.tt'], '3')
  })

  test('trace parseNs (k, v, o, n)', () => {
    let path = 'a.dd.xx.n.k'.split('.') // only first step valid
    let model = parseNs(o, path)
    assert.equal(model.k, path[1])
    assert.equal(model.v, undefined, 'invalid paths')
    assert.equal(model.n, path.length - 1, 'invalid paths trace position')
  })

  test('trace parseNs count deeply', () => {
    // o.a['c.d']['o.b']...
    const path = 'a.c.d.o.b.no_exist.foo'.split('.')
    const model = parseNs(o, path)
    assert.equal(model.k, 'no_exist')
    assert.equal(model.n, 2, 'invalid paths trace position')
  })
})
