function createHtmlVisualizedHash2StringListWithGrouping (lib, applib) {
  'use strict';

  var HtmlVisualizedHash2StringListElement = applib.getElementType('HtmlVisualizedHash2StringList');

  function HtmlVisualizedHash2StringListWithGroupingElement (id, options) {
    HtmlVisualizedHash2StringListElement.call(this, id, options);
  }
  lib.inherit(HtmlVisualizedHash2StringListWithGroupingElement, HtmlVisualizedHash2StringListElement);

  //showcase for how to do things here
  HtmlVisualizedHash2StringListWithGroupingElement.prototype.visualizationUnit = function () {
    return jQuery('<li class="listwithgrouping"><span class="itemcaption"></span><span class="itemgroup"></span></li>');
  };
  HtmlVisualizedHash2StringListWithGroupingElement.prototype.annotateVisualizationUnit = function (valuevisual, item) {
    var visitem;
    HtmlVisualizedHash2StringListElement.prototype.annotateVisualizationUnit.call(this, valuevisual, item);
    visitem = valuevisual.visual;
    if (lib.isArray(valuevisual.value.group)) {
      valuevisual.value.group.forEach(this.handleGroupItemVisualization.bind(this, visitem));
      visitem = null;
      return;
    }
    this.handleDuplicate(null, valuevisual, item);
  };
  HtmlVisualizedHash2StringListWithGroupingElement.prototype.setCaptionOnVisualization = function (visunit, caption) {
    visunit.find('.itemcaption').html(caption);
  };
  HtmlVisualizedHash2StringListWithGroupingElement.prototype.handleDuplicate = function (key, valuevisualfound, item) {
    if (!lib.isArray(valuevisualfound.value.group)) {
      valuevisualfound.value.group = [];
    }
    valuevisualfound.value.group.push(item);
    this.handleGroupItemVisualization(valuevisualfound.visual, item);
  };
  //endof showcase

  //overloadables
  HtmlVisualizedHash2StringListWithGroupingElement.prototype.handleGroupItemVisualization = function (visitem, item) {
    var ig = visitem.find('.itemgroup');
    ig.html(parseInt(ig.html())+1);
  }
  //endof overloadables

  HtmlVisualizedHash2StringListWithGroupingElement.prototype.groupedValues = function (item) {
    var groupfields = this.getConfigVal('groupfields'), ret;
    if (lib.isString(groupfields)) {
      return item[groupfields];
    }
    if (lib.isArray(groupfields)) {
      ret = groupfields.reduce(grouper.bind(null, item), []);
      item = null;
      return ret;
    }
    return item;
  };

  function grouper (item, res, gf) {
    if (lib.isString(gf)) {
      res.push(item[gf]);
    }
    return res;
  }

  applib.registerElementType('HtmlVisualizedHash2StringListWithGrouping', HtmlVisualizedHash2StringListWithGroupingElement);
}
module.exports = createHtmlVisualizedHash2StringListWithGrouping;