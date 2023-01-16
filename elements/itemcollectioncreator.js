function createDataContainer (lib, applib) {
  'use strict';

  var JobOnDestroyable = lib.qlib.JobOnDestroyable;

  function ElementJob (elem, defer) {
    JobOnDestroyable.call(this, elem, defer);
  }
  lib.inherit(ElementJob, JobOnDestroyable);
  ElementJob.prototype.go = function () {
    var ok = this.okToGo();
    if (!ok.ok) {
      return ok.val;
    }
    lib.runNext(this.jobProcMain.bind(this));
    return ok.val;
  };
  ElementJob.prototype.jobProcMain = function () {
    throw new lib.Error('NOT_IMPLEMENTED', this.constructor.name+' has to implement jobProcMain');
  };

  function ElementsVisualiserJob (elem, defer) {
    ElementJob.call(this, elem, defer);
    this.originalData = elem.get('data');
    this.currentIndex = elem.elementCountForStaticAdd-1;
  }
  lib.inherit(ElementsVisualiserJob, ElementJob);
  ElementsVisualiserJob.prototype.destroy = function () {
    this.currentIndex = null;
    this.originalData = null;
    ElementJob.prototype.destroy.call(this);
  };
  ElementsVisualiserJob.prototype.go = function () {
    var ok = this.okToGo();
    if (!ok.ok) {
      return ok.val;
    }
    lib.runNext(this.visualizeOne.bind(this));
    return ok.val;
  };
  ElementsVisualiserJob.prototype.visualizeOne = function () {
    if (!this.okToProceed()) {
      return;
    }
    if (this.originalData != this.destroyable.get('data')) {
      this.resolve(this.currentIndex);
      return;
    }
    if (!lib.isArray(this.originalData)) {
      this.resolve(0);
      return;
    }
    this.currentIndex++;
    if (this.currentIndex>=this.originalData.length) {
      this.resolve(this.currentIndex);
      return;
    }
    this.destroyable.visualizeItem(
      this.originalData[this.currentIndex],
      null
    );
    lib.runNext(this.visualizeOne.bind(this));
  };
  ElementsVisualiserJob.prototype.jobProcMain = ElementsVisualiserJob.prototype.visualizeOne;

  function ItemsAdderJob (elem, items, defer) {
    ElementJob.call(this, elem, defer);
    this.items = items;
  }
  lib.inherit(ItemsAdderJob, ElementJob);
  ItemsAdderJob.prototype.destroy = function () {
    this.items = null;
    ElementJob.prototype.destroy.call(this);
  };
  ItemsAdderJob.prototype.jobProcMain = function () {
    if (lib.isArray(this.items)) {
      this.items.forEach(this.destroyable.addItem.bind(this.destroyable));
      this.destroyable.reSetData();
      this.resolve(this.items.length);
      return;
    }
    this.destroyable.addItem(this.items);
    this.destroyable.reSetData();
    this.resolve(1);
    /*
    this.data = this.data || [];
    if (lib.isArray(items)) {
      Array.prototype.push.apply(this.get('data'), items);
      this.reSetData();
      items.forEach(this.visualizeItem.bind(this));
      return;
    }
    this.get('data').push(items);
    this.visualizeItem(items);
    this.reSetData();
    */
  };

  function ItemsRemoverJob (element, items, defer) {
    ElementJob.call(this, element, defer);
    this.items = items;
  }
  lib.inherit(ItemsRemoverJob, ElementJob);
  ItemsRemoverJob.prototype.destroy = function () {
    this.items = null;
    ElementJob.prototype.destroy.call(this);
  };
  ItemsRemoverJob.prototype.jobProcMain = function () {
    //console.log(this.destroyable.__parent.__parent.id, '=>', this.destroyable.id, 'ItemsRemoverJob', this.items);
    if (lib.isArray(this.items)) {
      this.items.forEach(this.destroyable.removeItem.bind(this.destroyable));
      this.destroyable.reSetData();
      this.resolve(this.items.length);
      return;
    }
    this.destroyable.removeItem(this.items);
    this.destroyable.reSetData();
    this.resolve(1);
  };

  function DataVisualizerJob (element, data, defer) {
    ElementJob.call(this, element, defer);
    this.data = data;
  }
  lib.inherit(DataVisualizerJob, ElementJob);
  DataVisualizerJob.prototype.destroy = function () {
    this.data = null;
    ElementJob.prototype.destroy.call(this);
  };
  DataVisualizerJob.prototype.jobProcMain = function () {
    var i;
    this.destroyable.purgeAllVisualization();
    if (!lib.isArray(this.data)) {
      this.resolve(0);
      return;
    }
    for (i=0; i<this.data.length; i++) {
      if (i>=this.destroyable.elementCountForStaticAdd) {
        break;
      }
      this.destroyable.visualizeItem(this.data[i], null);
    }
    lib.qlib.promise2defer((new ElementsVisualiserJob(this.destroyable)).go(), this);
  };

  function sortcheck (thingy) {
    if (this.getConfigVal('presorteditems')) {
      return;
    }
    if (lib.isArray(thingy)) {
      thingy.sort(this.compareItems.bind(this));
    }
  }

  var WebElement = applib.getElementType('WebElement');

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
    this.set('totalcount', lib.isArray(data) ? data.length : 0);
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
    var ret = [], _r = ret;
    this.itemHelperMap.traverse(visiblechooser.bind(null, _r));
    _r = null;
    return ret;
  };
  function visiblechooser (ret, item) {
    if (item && !item.filterblocked) {
      ret.push(item.value);
    }
  }


  ItemCollectionElement.prototype.visualizeData = function () {
    var data = this.get('data');
    this.jobs.run('.', new DataVisualizerJob(this, data));
  };
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
    this.jobs.run('.', new ItemsRemoverJob(this, items));
  };
  ItemCollectionElement.prototype.removeItem = function (item) {
    var itemindex = this.findDataItemIndexByItem(item);
    if (itemindex >= 0) {
      this.performItemRemoval(itemindex);
    }
  };
  ItemCollectionElement.prototype.performItemRemoval = function (itemindex) {
    return this.get('data').splice(itemindex, 1)[0];
  };

  ItemCollectionElement.prototype.addItems = function (items) {
    sortcheck.call(this, items);
    this.jobs.run('.', new ItemsAdderJob(this, items));
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
    var cntobj = {cnt: 0}, totalcount;
    totalcount = this.get('totalcount');
    this.itemHelperMap.traverse(filteredCountEvaluator.bind(null, cntobj));
    this.set('filteredcount', cntobj.cnt);
    cntobj = null;
  };
  function filteredCountEvaluator (cntobj, mapitem) {
    if (!mapitem.filterblocked) {
      cntobj.cnt++;
    }
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