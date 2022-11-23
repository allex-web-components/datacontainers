function createELements (execlib) {
  var lib = execlib.lib,
  lR = execlib.execSuite.libRegistry,
  applib = lR.get('allex_applib');

  require('./itemcollectioncreator')(lib, applib);
  require('./htmlvisualizeditemcollectioncreator')(lib, applib);
  require('./htmlvisualizedstringlistcreator')(lib, applib);
  require('./htmlvisualizedhash2stringlistcreator')(lib, applib);
  require('./htmlvisualizedhash2stringlistwithgroupingcreator')(lib, applib);
  require('./htmlvisualizedavailablechosencombo')(lib, applib);
}
module.exports = createELements;