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
          .filter(arg => utils.isLiteral(arg) && typeof arg.value === 'string' && arg.value.indexOf('.') >= 0)
          .map(e => e.value.split('.'));

        for (let i = 0; i < properties.length - 1; i++) {
          const current = properties[0];
          const similar = properties.filter(e => e !== current && e[0] === current[0]);
          if (similar.length > 0 && !(hasBraces(current) && similar.filter(hasBraces).length > 0)) {
            report(node);
          }
        }
      },
    };
  }
};
