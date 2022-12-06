function createHtmlVisualizedItemCollection (lib, applib) {
  'use strict';

  var ItemCollectionElement = applib.getElementType('ItemCollection');

  function HtmlVisualizedItemCollectionElement (id, options) {
    ItemCollectionElement.call(this, id, options);
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
    ItemCollectionElement.prototype.__cleanUp.call(this);
  };
  HtmlVisualizedItemCollectionElement.prototype.purgeAllVisualization = function () {
    this.$element.empty();
    return ItemCollectionElement.prototype.purgeAllVisualization.call(this);
  };
  HtmlVisualizedItemCollectionElement.prototype.visualizationFromItem = function (key, item) {
    var visunit;
    visunit = this.visualizationUnit();
    visunit.attr('itemcollectionkey', key);
    return visunit;
  };
  HtmlVisualizedItemCollectionElement.prototype.addVisualizationToSelf = function (visitem, nextitem) {
    var nextkey, nextvalnvis;
    nextkey = nextitem ? this.keyFromItem(nextitem)+'' : null;
    nextvalnvis = nextkey == null ? null : this.itemHelperMap.get(nextkey);
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
      rmvalnvis = this.itemHelperMap.remove(key);
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
    valnvis = this.itemHelperMap.get(key);
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
    valnvis = this.itemHelperMap.get(key);
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
  HtmlVisualizedItemCollectionElement.prototype.doesVisualPassTheFilter = function (visitem) {
    var text = this.get('filter') || '';
    var fail = text.length > 0 && (visitem.text().toLowerCase().indexOf(text) < 0);
    visitem[fail ? 'hide' : 'show']();
    return !fail;
  };
  /*
  HtmlVisualizedItemCollectionElement.prototype.doTheFiltering = function () {    
    filterCollection.call(this);
    return ItemCollectionElement.prototype.doTheFiltering.call(this);
  };
  */
  //overridables
  HtmlVisualizedItemCollectionElement.prototype.visualizationUnit = function () {
    return jQuery('<li>');
  };
  HtmlVisualizedItemCollectionElement.prototype.annotateVisualizationUnit = function (valuevisual) {
    var p, visunit = valuevisual.visual, item = valuevisual.value;
    var itemopts = this.getConfigVal('item') || {}, itemoptattrs;
    itemoptattrs = itemopts.attrs;
    if (itemoptattrs) {
      for (p in itemoptattrs) {
        if (!itemoptattrs.hasOwnProperty(p)) {
          continue;
        }
        visunit.attr(p, itemoptattrs[p]);
      }
    }
    if (itemopts.class) {
      visunit.addClass(itemopts.class);
    }
    this.setCaptionOnVisualization(visunit, this.textFromVisualizationItem(item));
  };
  HtmlVisualizedItemCollectionElement.prototype.setCaptionOnVisualization = function (visunit, caption) {
    visunit.html(caption);
  };
  HtmlVisualizedItemCollectionElement.prototype.handleDuplicate = function (key, valuevisualfound, item) {
    console.warn(this.id, 'Duplicate key found', key, 'on', item);
  };
  //overridables end
  //abstraction
  HtmlVisualizedItemCollectionElement.prototype.keyFromItem = function (item) {
    throw new lib.Error('NOT_IMPLEMENTED', 'keyFromItem has to be implemented by '+this.constructor.name);
  };
  HtmlVisualizedItemCollectionElement.prototype.textFromVisualizationItem = function (item) {
    throw new lib.Error('NOT_IMPLEMENTED', 'textFromVisualizationItem has to be implemented by '+this.constructor.name);
  };
  HtmlVisualizedItemCollectionElement.prototype.valueFromVisualizationItem = function (item) {
    throw new lib.Error('NOT_IMPLEMENTED', this.constructor.name+' has to implement valueFromVisualizationItem');
  };
  HtmlVisualizedItemCollectionElement.prototype.itemFromKey = function (key) {
    return this.itemHelperMap.get(key);
  };
  //abstraction end

  HtmlVisualizedItemCollectionElement.prototype.deselectCurrentlyActive = function () {
    var val = this.get('value'), key = this.keyFromItem(val)+'', valnvis = this.itemHelperMap.get(key);
    if (valnvis) {
      valnvis.visual.removeClass('active');
    }
  };
  applib.registerElementType('HtmlVisualizedItemCollection', HtmlVisualizedItemCollectionElement);


}
module.exports = createHtmlVisualizedItemCollection;