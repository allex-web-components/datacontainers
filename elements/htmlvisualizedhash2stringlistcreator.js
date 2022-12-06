function createHtmlVisualizedHash2StringList (lib, applib) {
  'use strict';

  var HtmlVisualizedItemCollectionElement = applib.getElementType('HtmlVisualizedItemCollection')

  function HtmlVisualizedHash2StringListElement (id, options) {
    HtmlVisualizedItemCollectionElement.call(this, id, options);
  }
  lib.inherit(HtmlVisualizedHash2StringListElement, HtmlVisualizedItemCollectionElement);
  HtmlVisualizedHash2StringListElement.prototype.keyFromItem = function (item) {
    var valuepath = this.getConfigVal('valuepath');
    return (lib.isString(valuepath) && valuepath.length>0) ? item[valuepath] : item;
  };
  HtmlVisualizedHash2StringListElement.prototype.compareItems = function (a,b) {
    var valuepath = this.getConfigVal('valuepath');
    return (lib.isString(valuepath) && valuepath.length>0)
    ?
    HtmlVisualizedItemCollectionElement.prototype.compareItems.call(this, a[valuepath], b[valuepath])
    :
    HtmlVisualizedItemCollectionElement.prototype.compareItems.call(this, a, b)
  };
  HtmlVisualizedHash2StringListElement.prototype.textFromVisualizationItem = function (item) {
    var titlepath = this.getConfigVal('titlepath');
    return (lib.isString(titlepath) && titlepath.length>0) ? item[titlepath] : item;
  };
  HtmlVisualizedHash2StringListElement.prototype.valueFromVisualizationItem = function (item) {
    var valuepath = this.getConfigVal('valuepath');
    return (lib.isString(valuepath) && valuepath.length>0) ? item[valuepath] : item;
  };

  applib.registerElementType('HtmlVisualizedHash2StringList', HtmlVisualizedHash2StringListElement);
}
module.exports = createHtmlVisualizedHash2StringList;