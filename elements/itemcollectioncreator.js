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
    this.destroyable.addItem(items);
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
    if (lib.isArray(this.items)) {
      this.items.forEach(this.destroyable.removeItem.bind(this.destroyable));
      this.destroyable.reSetData();
      this.resolve(this.items.length);
      return;
    }
    this.destroyable.removeItem(items);
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
    this.destroyable.emptyAll();
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
    if (lib.isArray(thingy)) {
      thingy.sort(this.compareItems.bind(this));
    }
  }

  var WebElement = applib.getElementType('WebElement');

  function ItemCollectionElement (id, options) {
    WebElement.call(this, id, options);
    this.data = null;
    this.value = null;
    this.internalChange = null;
  }
  lib.inherit(ItemCollectionElement, WebElement);
  ItemCollectionElement.prototype.__cleanUp = function () {
    this.internalChange = null;
    this.value = null;
    this.data = null;
    WebElement.prototype.__cleanUp.call(this);
  };
  ItemCollectionElement.prototype.get_data = function () {
    return this.data;
  };
  ItemCollectionElement.prototype.set_data = function (data) {
    sortcheck.call(this, data);
    this.data = data;
    if (!this.internalChange) {
      this.visualizeData();
    }
    return true;
  };
  ItemCollectionElement.prototype.get_value = function () {
    return this.value;
  };
  ItemCollectionElement.prototype.set_value = function (val) {
    this.value = val;
    return true;
  };
  ItemCollectionElement.prototype.visualizeData = function () {
    this.jobs.run('.', new DataVisualizerJob(this, this.get('data')));
  };
  ItemCollectionElement.prototype.visualizeItem = function (item, nextitem) {
    var visitem = this.visualizationFromItem(item, nextitem);
    if (visitem) {
      this.addVisualizationToSelf(visitem, nextitem);
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
    this.internalChange = false;
  };
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
  ItemCollectionElement.prototype.emptyAll = function () {

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
      console.log(this.id, 'no data, so 0');
      return 0;
    }
    for (i=0; i<data.length; i++) {
      if (this.compareItems(data[i], item)>0) {
        console.log(this.id, data[i], item, 'found, so', i);
        return i;
      }
    }
    console.log(this.id, 'NOT found, so', i);
    return i;
  };
  //overloadables end

  //abstraction
  ItemCollectionElement.prototype.visualizationFromItem = function (item, nextitem) {
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