
root._ = require 'underscore'
vows = require 'vows'
assert = require 'assert'

root.dw = {}
require '../src/dw.column.js'
require '../src/dw.column.types.js'


vows
    .describe('Some tests for different number formats')
    .addBatch
        'check column range':
            'topic': dw.column('', [0,1,2,3,4,5,6,7])
            'range': (topic) -> assert.deepEqual topic.range(), [0, 7]
        'check date range':
            'topic': dw.column('', [new Date(1990, 0, 1), new Date(1990, 6, 1), new Date(1991, 11, 1)])
            'range': (topic) -> assert.deepEqual topic.range(), [new Date(1990, 0, 1), new Date(1991, 11, 1)]
    .export module
