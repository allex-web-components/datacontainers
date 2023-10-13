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
    /*
    var titlepath = this.getConfigVal('titlepath');
    return (lib.isString(titlepath) && titlepath.length>0) ? item[titlepath] : item;
    */
    var titlefields, titlepath, titlejoiner, ret;
    if (!item) {
      return '';
    }
    titlefields = this.getConfigVal('titlefields');
    if (lib.isArray(titlefields)) {
      titlejoiner = this.getConfigVal('titlejoiner') || ',';
      ret = titlefields.reduce(titleReducer.bind(null, titlejoiner, item), '');
      titlejoiner = null;
      item = null;
      return ret;
    }
    titlepath = this.getConfigVal('titlepath');
    if (!titlepath) {
      return item;
    }
    return item[titlepath];
  };
  HtmlVisualizedHash2StringListElement.prototype.valueFromVisualizationItem = function (item) {
    var valuepath = this.getConfigVal('valuepath');
    return (lib.isString(valuepath) && valuepath.length>0) ? item[valuepath] : item;
  };

  applib.registerElementType('HtmlVisualizedHash2StringList', HtmlVisualizedHash2StringListElement);

    //title reducer via titlefields
    function titleReducer (joinerstring, optiondata, result, titleelement) {
      if (!lib.isString(titleelement)) {
        return result;
      }
      return lib.joinStringsWith(result, valueFromColonSplits(optiondata, titleelement.split(':')), joinerstring);
    };
  
    function valueFromColonSplits (optiondata, splits) {
      var val = optiondata[splits[0]];
      if (splits.length<2) {
        return val+'';
      }
      val = modify(val, splits[1], 'pre');
      val = modify(val, splits[1], 'post');
      return val+'';
    }
    function modify(value, thingy, direction) {
      var intvalue = parseInt(thingy);
      if (!lib.isNumber(intvalue)) {
        return '';
      }
      return modifiers[direction+'pendToLength'](value+'', lib.isNumber(value) ? '0' : ' ', intvalue);
    }
    var modifiers = {
      prependToLength: function (str, thingy, len) {
        while(str.length < len) {
          str = thingy+str;
        }
        return str;
      },
      postpendToLength: function (str, thingy, len) {
        while(str.length < len) {
          str = str+thingy;
        }
        return str;
      }
    };
    //endof title reducer via titlefields
}
module.exports = createHtmlVisualizedHash2StringList;