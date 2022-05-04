(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function createHtmlVisualizedAvailableChosenCombo (lib, applib) {
  'use strict';

  var WebElement = applib.getElementType('WebElement'),
    HtmlVisualizedItemCollectionElement = applib.getElementType('HtmlVisualizedItemCollection');

  function checkSubWidgetOptions (alloptions, sectionname) {
    var options = alloptions[sectionname];
    if (!options) {
      throw new lib.Error('NO_OPTIONS', 'HtmlVisualizedAvailableChosenElement and derivatives must get "options.widgets.'+sectionname+'" in the ctor');
    }
    if (!(lib.isString(options.name) && options.name)) {
      throw new lib.Error('NO_OPTIONS_NAME', 'HtmlVisualizedAvailableChosenElement and derivatives must have "name" in "options.widgets.'+sectionname+'"');
    }
  }
  function checkSubWidgetsOptions (options) {
    if (!options) {
      throw new lib.Error('NO_OPTIONS', 'HtmlVisualizedAvailableChosenElement and derivatives must get "options.widgets" in the ctor');
    }
    checkSubWidgetOptions(options, 'available');
    checkSubWidgetOptions(options, 'chosen');
    checkSubWidgetOptions(options, 'chooseone');
    checkSubWidgetOptions(options, 'chooseall');
    checkSubWidgetOptions(options, 'unchooseone');
    checkSubWidgetOptions(options, 'unchooseall');
  }
  function checkOptions (options) {
    if (!options) {
      throw new lib.Error('NO_OPTIONS', 'HtmlVisualizedAvailableChosenElement and derivatives must get "options" in the ctor');
    }
    checkSubWidgetsOptions (options.widgets);
  }
  function HtmlVisualizedAvailableChosenElement (id, options) {
    checkOptions(options);
    options.elements = [
      lib.extend({
        type: 'HtmlVisualizedItemCollection'
      }, options.widgets.available),
      lib.extend({
        type: 'HtmlVisualizedItemCollection'
      }, options.widgets.chosen),
      lib.extend({
        type: 'ClickableElement',
        options: {
          enabled: false
        }
      }, options.widgets.chooseone),
      lib.extend({
        type: 'ClickableElement',
        options: {
          enabled: false
        }
      }, options.widgets.chooseall),
      lib.extend({
        type: 'ClickableElement',
        options: {
          enabled: false
        }
      }, options.widgets.unchooseone),
      lib.extend({
        type: 'ClickableElement',
        options: {
          enabled: false
        }
      }, options.widgets.unchooseall)
    ];
    WebElement.call(this, id, options);
  }
  lib.inherit(HtmlVisualizedAvailableChosenElement, WebElement);
  HtmlVisualizedAvailableChosenElement.prototype.__cleanUp = function () {
    WebElement.prototype.__cleanUp.call(this);
  };
  HtmlVisualizedAvailableChosenElement.prototype.get_available = function () {
    var w = this.getWidget('available');
    return w ? w.get('data') : null;
  };
  HtmlVisualizedAvailableChosenElement.prototype.set_available = function (data) {
    var w = this.getWidget('available');
    return w ? w.set('data', data) : false;
  };
  HtmlVisualizedAvailableChosenElement.prototype.get_chosen = function () {
    var w = this.getWidget('chosen');
    return w ? w.get('data') : null;
  };
  HtmlVisualizedAvailableChosenElement.prototype.set_chosen = function (data) {
    var w = this.getWidget('chosen');
    return w ? w.set('data', data) : false;
  };

  HtmlVisualizedAvailableChosenElement.prototype.getWidget = function (name) {
    try {
      return this.getElement(this.getConfigVal('widgets')[name].name);
    } catch (e) {
      return null;
    }
  }

  HtmlVisualizedAvailableChosenElement.prototype.staticEnvironmentDescriptor = function (myname) {
    var widgets, availaccnts, availaccntsselmode, chosenaccnts, chosenaccntsselmode, chooseone, chooseall, unchooseone, unchooseall;
    widgets = this.getConfigVal('widgets');
    availaccnts = widgets.available.name;
    availaccntsselmode = widgets.available.options.selectmode;
    chosenaccnts = widgets.chosen.name;
    chosenaccntsselmode = widgets.chosen.options.selectmode;
    chooseone = widgets.chooseone.name;
    chooseall = widgets.chooseall.name;
    unchooseone = widgets.unchooseone.name;
    unchooseall = widgets.unchooseall.name;
    return {
      logic: [
        {
          triggers: 'element.'+myname+'.'+availaccnts+':data',
          handler: this.changed.fire.bind(this.changed, 'available')
        },
        {
          triggers: 'element.'+myname+'.'+chosenaccnts+':data',
          handler: this.changed.fire.bind(this.changed, 'chosen')
        },
        {
          triggers: 'element.'+myname+'.'+availaccnts+'!doubleClicked',
          references: [
            'element.'+myname+'.'+availaccnts,
            'element.'+myname+'.'+chosenaccnts
          ].join(','),
          handler: function (avlacc, chsnacc, dblclckval) {
            avlacc.removeItems([dblclckval]);
            chsnacc.addItems([dblclckval]);
          }
        },
        {
          triggers: 'element.'+myname+'.'+chosenaccnts+'!doubleClicked',
          references: [
            'element.'+myname+'.'+availaccnts,
            'element.'+myname+'.'+chosenaccnts
          ].join(','),
          handler: function (avlacc, chsnacc, dblclckval) {
            avlacc.addItems([dblclckval]);
            chsnacc.removeItems([dblclckval]);
          }
        },
        {
          triggers: 'element.'+myname+'.'+chooseone+'!clicked',
          references: [
            'element.'+myname+'.'+availaccnts,
            'element.'+myname+'.'+chosenaccnts
          ].join(','),
          handler: function(avlacc, chsnacc) {
            var selected = avlacc.get('value');
            avlacc.removeItems(selected);
            chsnacc.addItems(selected);
          }
        },
        {
          triggers: 'element.'+myname+'.'+chooseall+'!clicked',
          references: [
            'element.'+myname+'.'+availaccnts,
            'element.'+myname+'.'+chosenaccnts
          ].join(','),
          handler: function(avlacc, chsnacc) {
            var all = avlacc.get('data');
            avlacc.set('data', null);
            chsnacc.addItems(all);
          }
        },
        {
          triggers: 'element.'+myname+'.'+unchooseone+'!clicked',
          references: [
            'element.'+myname+'.'+availaccnts,
            'element.'+myname+'.'+chosenaccnts
          ].join(','),
          handler: function(avlacc, chsnacc) {
            var selected = chsnacc.get('value');
            chsnacc.removeItems(selected);
            avlacc.addItems(selected);
          }
        },
        {
          triggers: 'element.'+myname+'.'+unchooseall+'!clicked',
          references: [
            'element.'+myname+'.'+availaccnts,
            'element.'+myname+'.'+chosenaccnts
          ].join(','),
          handler: function(avlacc, chsnacc) {
            var all = chsnacc.get('data');
            chsnacc.set('data', null);
            avlacc.addItems(all);
          }
        },
      ],
      links: [
        {
          source: 'element.'+myname+'.'+availaccnts+':value',
          target: 'element.'+myname+'.'+chooseone+':enabled',
          filter: availaccntsselmode=='single' ? singleSelectValue2Enabled : multiSelectValue2Enabled
        },{
          source: 'element.'+myname+'.'+availaccnts+':data',
          target: 'element.'+myname+'.'+chooseall+':enabled',
          filter: availaccntsselmode=='single' ? singleSelectValue2Enabled : multiSelectValue2Enabled
        },{
          source: 'element.'+myname+'.'+chosenaccnts+':value',
          target: 'element.'+myname+'.'+unchooseone+':enabled',
          filter: chosenaccntsselmode=='single' ? singleSelectValue2Enabled : multiSelectValue2Enabled
        },{
          source: 'element.'+myname+'.'+chosenaccnts+':data',
          target: 'element.'+myname+'.'+unchooseall+':enabled',
          filter: chosenaccntsselmode=='single' ? singleSelectValue2Enabled : multiSelectValue2Enabled
        }
      ]
    };
  };

  function multiSelectValue2Enabled (value) {
    return value && value.length>0;
  }
  function singleSelectValue2Enabled (value) {
    return lib.isVal(value);
  }

  applib.registerElementType('HtmlVisualizedAvailableChosenCombo', HtmlVisualizedAvailableChosenElement);
}
module.exports = createHtmlVisualizedAvailableChosenCombo;
},{}],2:[function(require,module,exports){
function createHtmlVisualizedItemCollection (lib, applib) {
  'use strict';

  var ItemCollectionElement = applib.getElementType('ItemCollection');

  function HtmlVisualizedItemCollectionElement (id, options) {
    ItemCollectionElement.call(this, id, options);
    this.htmlHelperMap = new lib.Map();
    this.doubleClicked = this.createBufferableHookCollection();
    this.onItemClickeder = this.onItemClicked.bind(this);
    this.onItemDoubleClickeder = this.onItemDoubleClicked.bind(this);
    if (options.selectionmode=='multi') {
      this.value = [];
    }
  }
  lib.inherit(HtmlVisualizedItemCollectionElement, ItemCollectionElement);
  HtmlVisualizedItemCollectionElement.prototype.__cleanUp = function () {
    this.onItemDoubleClickeder = null;
    this.onItemClickeder = null;
    if (this.doubleClicked) {
      this.doubleClicked.destroy();
    }
    this.doubleClicked = null;
    if (this.htmlHelperMap) {
      this.htmlHelperMap.destroy();
    }
    this.htmlHelperMap = null;
    ItemCollectionElement.prototype.__cleanUp.call(this);
  };
  HtmlVisualizedItemCollectionElement.prototype.emptyAll = function () {
    this.$element.empty();
    this.htmlHelperMap.purge();
    ItemCollectionElement.prototype.emptyAll.call(this);
  };
  HtmlVisualizedItemCollectionElement.prototype.visualizationFromItem = function (item, nextitem) {
    var key = this.keyFromItem(item)+'';
    var p;
    var itemopts = this.getConfigVal('item') || {}, itemoptattrs;
    var li = jQuery('<li>');

    this.htmlHelperMap.add(key, {value: item, visual: li});
    li.attr('itemcollectionkey', key);
    itemoptattrs = itemopts.attrs;
    if (itemoptattrs) {
      for (p in itemoptattrs) {
        if (!itemoptattrs.hasOwnProperty(p)) {
          continue;
        }
        li.attr(p, itemoptattrs[p]);
      }
    }
    if (itemopts.class) {
      li.addClass(itemopts.class);
    }
    li.html(this.textFromVisualizationItem(item));
    return li;
  };
  HtmlVisualizedItemCollectionElement.prototype.addVisualizationToSelf = function (visitem, nextitem) {
    var nextkey, nextvalnvis;
    nextkey = nextitem ? this.keyFromItem(nextitem)+'' : null;
    nextvalnvis = nextkey == null ? null : this.htmlHelperMap.get(nextkey);
    visitem.on('click', this.onItemClickeder);
    visitem.on('dblclick', this.onItemDoubleClickeder);
    if (!(nextvalnvis && nextvalnvis.visual)) {
      this.$element.append(visitem);
      return;
    }
    nextvalnvis.visual.before(visitem);
  };
  HtmlVisualizedItemCollectionElement.prototype.performItemRemoval = function (itemindex) {
    var removeditem = ItemCollectionElement.prototype.performItemRemoval.call(this, itemindex),
      key = this.keyFromItem(removeditem)+'',
      rmvalnvis = this.htmlHelperMap.remove(key);
    //console.log('removed', key);
    if (rmvalnvis) {
      rmvalnvis.visual.remove();
      this.removeItemFromValue(rmvalnvis.value);
    }
  };

  HtmlVisualizedItemCollectionElement.prototype.onItemClicked = function (ev) {
    var selectionmode, jq, wasclickedactive, key, valnvis, currval, valindex;
    //console.log('clicked', ev);
    selectionmode = this.getConfigVal('selectionmode');
    if (!selectionmode || selectionmode=='none') {
      return;
    }
    jq = jQuery(ev.currentTarget);
    wasclickedactive = jq.hasClass('active');
    jq.toggleClass('active');
    if (selectionmode=='single') {
      if (wasclickedactive) {
        this.deselectCurrentlyActive();
      }
      currval = null;
    } else {
      currval = this.get('value');
    }
    key = jq.attr('itemcollectionkey');
    //console.log('key', key);
    valnvis = this.htmlHelperMap.get(key);
    if (!valnvis) {
      return;
    }
    if (wasclickedactive) {
      this.removeItemFromValue(valnvis.value);
      return;
    }
    this.addItemToValue(valnvis.value);
  };
  HtmlVisualizedItemCollectionElement.prototype.onItemDoubleClicked = function (ev) {
    //console.log('doubleclicked',ev);
    var selectionmode, jq, wasclickedactive, key, valnvis, currval, valindex;
    //console.log('clicked', ev);
    selectionmode = this.getConfigVal('selectionmode');
    if (!selectionmode || selectionmode=='none') {
      return;
    }
    jq = jQuery(ev.currentTarget);
    wasclickedactive = jq.hasClass('active');
    jq.removeClass('active');
    if (selectionmode=='single') {
      if (wasclickedactive) {
        this.deselectCurrentlyActive();
      }
      currval = null;
    } else {
      currval = this.get('value');
    }
    key = jq.attr('itemcollectionkey');
    //console.log('key', key);
    valnvis = this.htmlHelperMap.get(key);
    if (!valnvis) {
      return;
    }
    if (wasclickedactive) {
      this.removeItemFromValue(valnvis.value);
      //return;
    }
    this.doubleClicked.fire(valnvis.value);
  };
  HtmlVisualizedItemCollectionElement.prototype.addItemToValue = function (item) {
    var currval = this.get('value'), valindex;
    if (lib.isArray(currval)) {
      this.set('value', currval.concat([item]));
      return;
    }
    this.set('value', item);
  }
  HtmlVisualizedItemCollectionElement.prototype.removeItemFromValue = function (item) {
    var currval = this.get('value').slice(), valindex;
    if (lib.isArray(currval)) {
      valindex = currval.indexOf(item);
      if (valindex>=0) {
        currval.splice(valindex, 1);
        this.set('value', currval);
      }
      return;
    }
    if (item==currval) {
      this.set('value', null);
    }
  };
  //abstraction
  HtmlVisualizedItemCollectionElement.prototype.keyFromItem = function (item) {
    throw new lib.Error('NOT_IMPLEMENTED', 'keyFromItem has to be implemented by '+this.constructor.name);
  };

  HtmlVisualizedItemCollectionElement.prototype.textFromVisualizationItem = function (item) {
    throw new lib.Error('NOT_IMPLEMENTED', 'textFromVisualizationItem has to be implemented by '+this.constructor.name);
  };
  //abstraction end

  HtmlVisualizedItemCollectionElement.prototype.deselectCurrentlyActive = function () {
    var val = this.get('value'), key = this.keyFromItem(val)+'', valnvis = this.htmlHelperMap.get(key);
    if (valnvis) {
      valnvis.visual.removeClass('active');
    }
  };
  applib.registerElementType('HtmlVisualizedItemCollection', HtmlVisualizedItemCollectionElement);


}
module.exports = createHtmlVisualizedItemCollection;
},{}],3:[function(require,module,exports){
function createELements (execlib) {
  var lib = execlib.lib,
  lR = execlib.execSuite.libRegistry,
  applib = lR.get('allex_applib');

  require('./itemcollectioncreator')(lib, applib);
  require('./htmlvisualizeditemcollectioncreator')(lib, applib);
  require('./htmlvisualizedavailablechosencombo')(lib, applib);
}
module.exports = createELements;
},{"./htmlvisualizedavailablechosencombo":1,"./htmlvisualizeditemcollectioncreator":2,"./itemcollectioncreator":4}],4:[function(require,module,exports){
function createDataContainer (lib, applib) {
  'use strict';

  var JobOnDestroyable = lib.qlib.JobOnDestroyable;

  function ElementsVisualiserJob (elem, defer) {
    JobOnDestroyable.call(this, elem, defer);
    this.originalData = elem.get('data');
    this.currentIndex = elem.elementCountForStaticAdd-1;
  }
  lib.inherit(ElementsVisualiserJob, JobOnDestroyable);
  ElementsVisualiserJob.prototype.destroy = function () {
    this.currentIndex = null;
    this.originalData = null;
    JobOnDestroyable.prototype.destroy.call(this);
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
    this.data = lib.isArray(data) ? data.sort(this.compareItems.bind(this)) : data;
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
    var i;
    this.emptyAll();
    if (!lib.isArray(this.data)) {
      return;
    }
    for (i=0; i<this.data.length; i++) {
      if (i>=this.elementCountForStaticAdd) {
        break;
      }
      this.visualizeItem(this.data[i], null);
    }
    this.jobs.run('.', new ElementsVisualiserJob(this));
  };
  ItemCollectionElement.prototype.visualizeItem = function (item, nextitem) {
    var visitem = this.visualizationFromItem(item, nextitem);
    this.addVisualizationToSelf(visitem, nextitem);
  };

  ItemCollectionElement.prototype.removeItems = function (items) {
    if (lib.isArray(items)) {
      items.forEach(this.removeItem.bind(this));
      this.reSetData();
      return;
    }
    this.removeItem(items);
    this.reSetData();
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
    if (lib.isArray(items)) {
      items.forEach(this.addItem.bind(this));
      this.reSetData();
      return;
    }
    this.addItem(items);
    this.reSetData();
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
  ItemCollectionElement.prototype.compareItems = function (item1, item2) {
    return 1;
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
      return 0;
    }
    for (i=0; i<data.length; i++) {
      if (this.compareItems(data[i], item)>0) {
        return i;
      }
    }
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
},{}],5:[function(require,module,exports){
(function (execlib) {
  'use strict';

  require('./elements')(execlib);

})(ALLEX);

},{"./elements":3}]},{},[5]);
