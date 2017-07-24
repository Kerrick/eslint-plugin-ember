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

        const problem = node.arguments
          .filter(arg => utils.isLiteral(arg) && typeof arg.value === 'string' && arg.value.indexOf('.') >= 0)
          .map(e => e.value.split('.'))
          .find((current, i, properties) => {
            const matching = properties.filter(e => e[0] === current[0]);
            return matching.length > 1 && matching.filter(hasBraces).length < 2;
          });

        if (problem) {
          report(node);
        }

      },
    };
  }
};
