function createHtmlVisualizedItemCollection (lib, applib) {
  'use strict';

  var ItemCollectionElement = applib.getElementType('ItemCollection');

  function HtmlVisualizedItemCollectionElement (id, options) {
    ItemCollectionElement.call(this, id, options);
    this.htmlHelperMap = new lib.Map();
    this.onItemClickeder = this.onItemClicked.bind(this);
    if (options.selectionmode=='multi') {
      this.value = [];
    }
  }
  lib.inherit(HtmlVisualizedItemCollectionElement, ItemCollectionElement);
  HtmlVisualizedItemCollectionElement.prototype.__cleanUp = function () {
    this.onItemClickeder = null;
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
    console.log('removed', key);
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
    /*
    if (lib.isArray(currval)) {
      if (wasclickedactive) {
        valindex = currval.indexOf(valnvis.value);
        if (valindex>=0) {
          currval.splice(valindex, 1);
          this.set('value', currval.slice());
        }
      } else {
        this.set('value', currval.concat([valnvis.value]));
      }
      return;
    }
    this.set('value', wasclickedactive ? null : valnvis.value);
    */
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