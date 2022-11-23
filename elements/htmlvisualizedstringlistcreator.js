function createHtmlVisualizedStringList (lib, applib) {
  'use strict';

  var HtmlVisualizedItemCollectionElement = applib.getElementType('HtmlVisualizedItemCollection')

  function HtmlVisualizedStringListElement (id, options) {
    HtmlVisualizedItemCollectionElement.call(this, id, options);
  }
  lib.inherit(HtmlVisualizedStringListElement, HtmlVisualizedItemCollectionElement);
  HtmlVisualizedStringListElement.prototype.keyFromItem = function (item) {
    return item;
  };
  HtmlVisualizedStringListElement.prototype.textFromVisualizationItem = function (item) {
    return item;
  };

  applib.registerElementType('HtmlVisualizedStringList', HtmlVisualizedStringListElement);
}
module.exports = createHtmlVisualizedStringList;