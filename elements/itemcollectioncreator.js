function createDataContainer (lib, applib) {
  'use strict';

  var JobOnDestroyable = lib.qlib.JobOnDestroyable;

  var WebElement = applib.getElementType('WebElement');

  function sortcheck (thingy) {
    if (this.getConfigVal('presorteditems')) {
      return;
    }
    if (lib.isArray(thingy)) {
      thingy.sort(this.compareItems.bind(this));
    }
  }

  function ItemCollectionElement (id, options) {
    WebElement.call(this, id, options);
    this.itemHelperMap = new lib.Map();
    this.data = null;
    this.totalcount = 0;
    this.value = null;
    this.filter = null;
    this.filteredcount = 0;
    this.internalChange = null;
  }
  lib.inherit(ItemCollectionElement, WebElement);
  ItemCollectionElement.prototype.__cleanUp = function () {
    this.internalChange = null;
    this.filteredcount = null;
    this.filter = null;
    this.value = null;
    this.totalcount = null;
    this.data = null;
    if (this.itemHelperMap) {
      this.itemHelperMap.destroy();
    }
    this.itemHelperMap = null;
    WebElement.prototype.__cleanUp.call(this);
  };
  ItemCollectionElement.prototype.get_data = function () {
    return this.data;
  };
  ItemCollectionElement.prototype.set_data = function (data) {
    sortcheck.call(this, data);
    this.data = data;
    this.set('value', []);
    this.set('totalcount', lib.isArray(data) ? data.length : 0);
    //console.log(this.myNameOnMasterEnvironment(), 'data set', this.data.length);
    if (!this.internalChange) {
      this.visualizeData();
    }
    return true;
  };
  ItemCollectionElement.prototype.get_filter = function () {
    return this.filter;
  };
  ItemCollectionElement.prototype.set_filter = function (filt) {
    this.filter = filt;
    return this.doTheFiltering();
  };
  ItemCollectionElement.prototype.get_value = function () {
    return this.value;
  };
  ItemCollectionElement.prototype.set_value = function (val) {
    this.value = val;
    return true;
  };
  ItemCollectionElement.prototype.get_visible = function () {
    return this.itemHelperMap.reduce(visiblechooser, []);
  };
  function visiblechooser (res, item) {
    if (item && !item.filterblocked) {
      res.push(item.value);
    }
    return res;
  }


  ItemCollectionElement.prototype.visualizeData = function () {
    var data = this.get('data'), i=0;
    this.purgeAllVisualization();
    if (!lib.isArray(data)) {
      return;
    }
    for(i=0; i<data.length; i++) {
      this.visualizeItem(data[i], null);
    }
  }
  ItemCollectionElement.prototype.visualizeItem = function (item, nextitem) {
    var key = this.keyFromItem(item)+'', duplicate, visunit, valuevisual;
    duplicate = this.itemHelperMap.get(key);
    if (duplicate) {
      this.handleDuplicate(key, duplicate, item);
      return;
    }
    visunit = this.visualizationFromItem(key, item);
    if (visunit) {
      valuevisual = {value: item, visual: visunit};
      this.itemHelperMap.add(key, valuevisual);
      this.annotateVisualizationUnit(valuevisual);
      this.filterMapItem(valuevisual);
      this.addVisualizationToSelf(visunit, nextitem);
    }
  };

  ItemCollectionElement.prototype.removeItems = function (items) {
    if (lib.isArray(items)) {
      items.forEach(this.removeItem.bind(this));
      this.reSetData();
      return items.length;
    }
    this.removeItem(items);
    this.reSetData();
    return 1;
  };
  ItemCollectionElement.prototype.removeItem = function (item) {
    var itemindex = this.findDataItemIndexByItem(item);
    if (itemindex >= 0) {
      this.performItemRemoval(itemindex);
    }
  };
  ItemCollectionElement.prototype.performItemRemoval = function (itemindex) {
    //console.log(this.data.length);
    var ret = this.get('data').splice(itemindex, 1)[0];
    //console.log(this.myNameOnMasterEnvironment(), 'removed', ret, '=>', itemindex);
    //console.log(this.data.length);
    return ret;
  };

  ItemCollectionElement.prototype.addItems = function (items) {
    if (lib.isArray(items)) {
      items.forEach(this.addItem.bind(this));
      this.reSetData();
      return items.length;
    }
    this.addItem(this.items);
    this.reSetData();
    return 1;
  };
  ItemCollectionElement.prototype.addItem = function (item) {
    var placingindex = this.findNewDataItemPlacingIndex(item);
    if (placingindex >= 0) {
      this.performItemAddition(item, placingindex);
    }
  };
  ItemCollectionElement.prototype.performItemAddition = function (item, placingindex) {
    var data = this.get('data'), previtem;
    if (!lib.isArray(data)) {
      data = [];
      this.data = data;
    }
    if (placingindex<data.length) {
      previtem = data[placingindex];
      data.splice(placingindex, 0, null);
    } else {
      data.push(null);
      previtem = null;
    }
    data[placingindex] = item;
    this.visualizeItem(item, previtem);
    //console.log(this.myNameOnMasterEnvironment(), 'added', item, '=>', placingindex, this.data.length, this.itemHelperMap.count);
  };

  ItemCollectionElement.prototype.reSetData = function () {
    var data = this.get('data');
    this.internalChange = true;
    this.set('data', lib.isArray(data) ? data.slice() : null);
    this.evaluateFilteredCount();
    this.internalChange = false;
  };
  ItemCollectionElement.prototype.doTheFiltering = function () {
    this.itemHelperMap.traverse(this.filterMapItem.bind(this));
    this.evaluateFilteredCount();
    return true;
  };
  ItemCollectionElement.prototype.filterMapItem = function (mapitem) {
    if (!mapitem) {
      return;
    }
    if (!mapitem.visual) {
      return;
    }
    mapitem.filterblocked = !this.doesVisualPassTheFilter(mapitem.visual);
  };
  ItemCollectionElement.prototype.evaluateFilteredCount = function () {
    this.set('filteredcount', this.itemHelperMap.reduce(filteredCountEvaluator, 0));
  };
  function filteredCountEvaluator (cnt, mapitem) {
    if (!mapitem.filterblocked) {
      return cnt+1;
    }
    return cnt;
  }
  //overloadables
  ItemCollectionElement.prototype.compareItems = function (a, b) {
    if (a<b) {
      return -1;
    }
    if (a>b) {
      return 1;
    }
    return 0;
  };
  ItemCollectionElement.prototype.purgeAllVisualization = function () {
    this.set('filter', null);
    this.itemHelperMap.purge();
    return true;
  };
  ItemCollectionElement.prototype.findDataItemIndexByItem = function (item) {
    var data = this.get('data'), i;
    if (!lib.isArray(data)) {
      return 0;
    }
    for (i=0; i<data.length; i++) {
      if (lib.isEqual(data[i], item)) {
        return i;
      }
    }
    return -1;
  };
  ItemCollectionElement.prototype.findNewDataItemPlacingIndex = function (item) {
    var data = this.get('data'), i;
    if (!lib.isArray(data)) {
      //console.log(this.id, 'no data, so 0');
      return 0;
    }
    for (i=0; i<data.length; i++) {
      if (this.compareItems(data[i], item)>0) {
        //console.log(this.id, data[i], item, 'found, so', i);
        return i;
      }
    }
    //console.log(this.id, 'NOT found, so', i);
    return i;
  };
  ItemCollectionElement.prototype.doesVisualPassTheFilter = function (visitem) {
    return true;
  };
  //overloadables end

  //abstraction
  ItemCollectionElement.prototype.visualizationFromItem = function (key, item) {
    throw new lib.Error('NOT_IMPLEMENTED', 'visualizationFromItem has to be implemented by '+this.constructor.name);
  };
  ItemCollectionElement.prototype.addVisualizationToSelf = function (visitem, nextitem) {
    throw new lib.Error('NOT_IMPLEMENTED', 'addVisualizationToSelf has to be implemented by '+this.constructor.name);
  };
  //abstraction end

  ItemCollectionElement.prototype.elementCountForStaticAdd = 5;

  applib.registerElementType('ItemCollection', ItemCollectionElement);
}
module.exports = createDataContainer;