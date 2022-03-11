function createELements (execlib) {
  var lib = execlib.lib,
  lR = execlib.execSuite.libRegistry,
  applib = lR.get('allex_applib');

  require('./itemcollectioncreator')(lib, applib);
  require('./htmlvisualizeditemcollectioncreator')(lib, applib);
  require('./htmlvisualizedavailablechosencombo')(lib, applib);
}
module.exports = createELements;