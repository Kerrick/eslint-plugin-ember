'use strict';

const utils = require('../utils/utils');
const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// General rule - Use brace expansion
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforces usage of brace expansion',
      category: 'General',
      recommended: true
    },
    fixable: null, // or "code" or "whitespace"
  },

  create(context) {
    const message = 'Use brace expansion';

    function report(node) {
      context.report(node, message);
    }

    return {
      CallExpression(node) {
        if (!ember.isComputedProp(node)) return;

        const hasBraces = arr => !!arr.join('.').match(/\{.*\}/g);

        const properties = node.arguments
          .filter(arg => utils.isLiteral(arg) && typeof arg.value === 'string')
          .map(e => e.value.split('.'))
          .filter(e => e.length > 1)
          .sort((a, b) => a[0] > b[0]);

        for (let i = 0; i < properties.length - 1; i++) {
          const current = properties[i];
          const next = properties[i + 1];
          if (current[0] === next[0] && !(hasBraces(current) && hasBraces(next))) {
            report(node);
          }
        }
      },
    };
  }
};
