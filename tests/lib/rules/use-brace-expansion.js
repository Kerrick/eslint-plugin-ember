// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/use-brace-expansion');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('use-brace-expansion', rule, {
  valid: [
    { code: '{ test: computed("a", "b", function() {}) }' },
    { code: '{ test: computed(function() {}) }' },
    { code: '{ test: computed("a.test", "b.test", function() {}) }' },
    { code: '{ test: computed("a.{test,test2}", "b", function() {}) }' },
    { code: '{ test: computed("a.{test,test2}", "c", "b", function() {}) }' },
    { code: '{ test: computed("model.a.{test,test2}", "model.b.{test3,test4}", function() {}) }' },
    { code: '{ test: computed("foo.bar.{name,place}", "foo.qux.[]", "foo.baz.{thing,@each.stuff}", "foo.a", function() {}) }' },
    { code: "{ test: Ember.computed.filterBy('a', 'b', false) }" },
  ],
  invalid: [
    {
      code: '{ test: computed("a.test", "a.test2", function() {}) }',
      errors: [{
        message: 'Use brace expansion',
      }],
    },
    {
      code: '{ test: computed("a.{test,test2}", "c", "a.test3", function() {}) }',
      errors: [{
        message: 'Use brace expansion',
      }],
    },
    {
      code: '{ test: computed("a.{test,test2}", "a.test3", function() {}) }',
      errors: [{
        message: 'Use brace expansion',
      }],
    },
  ],
});
