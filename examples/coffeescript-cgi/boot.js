/*!
 * Boot file
 */

module.exports = function (meryl) {
  meryl.options = {
    templateExt: '.coffee',
    templateFunc: require('coffeekup').adapters.meryl
  };
};

