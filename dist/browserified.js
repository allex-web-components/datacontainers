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
        type: 'SearchInputElement'
      }, options.widgets.availablesearch),
      lib.extend({
        type: 'WebElement'
      }, options.widgets.availabletotalcount),
      lib.extend({
        type: 'WebElement'
      }, options.widgets.availablefilteredcount),
      lib.extend({
        type: 'HtmlVisualizedItemCollection'
      }, options.widgets.chosen),
      lib.extend({
        type: 'SearchInputElement'
      }, options.widgets.chosensearch),
      lib.extend({
        type: 'WebElement'
      }, options.widgets.chosentotalcount),
      lib.extend({
        type: 'WebElement'
      }, options.widgets.chosenfilteredcount),
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
    this.needsChosenToBeReset = this.createBufferableHookCollection();
  }
  lib.inherit(HtmlVisualizedAvailableChosenElement, WebElement);
  HtmlVisualizedAvailableChosenElement.prototype.__cleanUp = function () {
    if(this.needsChosenToBeReset) {
       this.needsChosenToBeReset.destroy();
    }
    this.needsChosenToBeReset = null;
    WebElement.prototype.__cleanUp.call(this);
  };
  HtmlVisualizedAvailableChosenElement.prototype.get_available = function () {
    var w = this.getWidget('available');
    return w ? w.get('data') : null;
  };
  HtmlVisualizedAvailableChosenElement.prototype.set_available = function (data) {
    var w = this.getWidget('available');
    if (!w) {
      return false;
    }
    return w.queueFunctionInvocation(doSetAvailable, [data]);
  };
  function doSetAvailable (data) {
    return this.set('data', data);
  }
  HtmlVisualizedAvailableChosenElement.prototype.get_visibleavailable = function () {
    var w = this.getWidget('available');
    return w ? w.get('visible') : null;
  };
  HtmlVisualizedAvailableChosenElement.prototype.get_chosen = function () {
    var w = this.getWidget('chosen');
    return w ? w.get('data') : null;
  };
  HtmlVisualizedAvailableChosenElement.prototype.set_chosen = function (data) {
    var avlacc, chsnacc;
    avlacc = this.getWidget('available');
    chsnacc = this.getWidget('chosen');
    if (!(avlacc && chsnacc)) {
      return false;
    }
    avlacc.queueFunctionInvocation(doSetChosen, [chsnacc, data]);
  };
  function doSetChosen (chsnacc, newchosen) {
    this.removeItems(newchosen);
    chsnacc.set('data', newchosen);
  }
  HtmlVisualizedAvailableChosenElement.prototype.get_visiblechosen = function () {
    var w = this.getWidget('chosen');
    return w ? w.get('visible') : null;
  };
  HtmlVisualizedAvailableChosenElement.prototype.resetChosen = function () {
    this.needsChosenToBeReset.fire(true);
  };

  HtmlVisualizedAvailableChosenElement.prototype.getWidget = function (name) {
    try {
      return this.getElement(this.getConfigVal('widgets')[name].name);
    } catch (e) {
      return null;
    }
  }

  HtmlVisualizedAvailableChosenElement.prototype.staticEnvironmentDescriptor = function (myname) {
    var widgets, availaccnts, availsearch, availtotalcount, availfilteredcount, availaccntsselmode,
      chosenaccnts, chosensearch, chosentotalcount, chosenfilteredcount, chosenaccntsselmode, chooseone, chooseall,
      unchooseone, unchooseall;
    widgets = this.getConfigVal('widgets');
    availaccnts = widgets.available.name;
    availsearch = widgets.availablesearch.name;
    availtotalcount = widgets.availabletotalcount.name;
    availfilteredcount = widgets.availablefilteredcount.name;
    availaccntsselmode = widgets.available.options.selectmode;
    chosenaccnts = widgets.chosen.name;
    chosensearch = widgets.chosensearch.name;
    chosentotalcount = widgets.chosentotalcount.name;
    chosenfilteredcount = widgets.chosenfilteredcount.name;
    chosenaccntsselmode = widgets.chosen.options.selectmode;
    chooseone = widgets.chooseone.name;
    chooseall = widgets.chooseall.name;
    unchooseone = widgets.unchooseone.name;
    unchooseall = widgets.unchooseall.name;
    return {
      logic: [
        {
          triggers: [
            'element.'+myname+'.'+availaccnts+':totalcount',
            'element.'+myname+'.'+availaccnts+':filteredcount',
          ].join(','),
          references: 'element.'+myname+'.'+availfilteredcount,
          handler: filteredController
        },
        {
          triggers: [
            'element.'+myname+'.'+chosenaccnts+':totalcount',
            'element.'+myname+'.'+chosenaccnts+':filteredcount',
          ].join(','),
          references: 'element.'+myname+'.'+chosenfilteredcount,
          handler: filteredController
        },
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
            'element.'+myname,
            'element.'+myname+'.'+availaccnts,
            'element.'+myname+'.'+chosenaccnts
          ].join(','),
          handler: function(me, avlacc, chsnacc) {
            var allvisible = me.get('visibleavailable');
            avlacc.removeItems(allvisible);
            chsnacc.addItems(allvisible);
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
          triggers: 'element.'+myname+'!needsChosenToBeReset',
          references: [
            'element.'+myname+'.'+availsearch,
            'element.'+myname+'.'+chosensearch
          ].join(','),
          handler: function (avsrch, chsrch) {
            avsrch.set('value', '');
            chsrch.set('value', '');
          }
        },
        {
          triggers: [
            'element.'+myname+'.'+unchooseall+'!clicked',
            'element.'+myname+'!needsChosenToBeReset',
          ],
          references: [
            'element.'+myname,
            'element.'+myname+'.'+availaccnts,
            'element.'+myname+'.'+chosenaccnts
          ].join(','),
          handler: function(me, avlacc, chsnacc) {
            var allvisible = me.get('visiblechosen');
            allvisible = lib.isArray(allvisible) ? allvisible : [];
            chsnacc.removeItems(allvisible);
            avlacc.addItems(allvisible);
          }
        }
      ],
      links: [
        {
          source: 'element.'+myname+'.'+availaccnts+':totalcount',
          target: 'element.'+myname+'.'+availtotalcount+':actual',
          filter: function (num) {return num>=0;}
        },
        {
          source: 'element.'+myname+'.'+availaccnts+':totalcount',
          target: 'element.'+myname+'.'+availtotalcount+':html',
          filter: function (num) {return num > 0 ? 'Total: '+num : '<i>Empty List</i>';}
        },
        {
          source: 'element.'+myname+'.'+chosenaccnts+':totalcount',
          target: 'element.'+myname+'.'+chosentotalcount+':actual',
          filter: function (num) {return num>=0;}
        },
        {
          source: 'element.'+myname+'.'+chosenaccnts+':totalcount',
          target: 'element.'+myname+'.'+chosentotalcount+':html',
          filter: function (num) {return num > 0 ? 'Total: '+num : '<i>Empty List</i>';}
        },
        {
          source: 'element.'+myname+'.'+availsearch+':value',
          target: 'element.'+myname+'.'+availaccnts+':filter'
        },
        {
          source: 'element.'+myname+'.'+chosensearch+':value',
          target: 'element.'+myname+'.'+chosenaccnts+':filter'
        },
        {
          source: 'element.'+myname+'.'+availaccnts+':data',
          target: 'element.'+myname+'.'+availsearch+':actual',
          filter: function (data) {
            return lib.isArray(data) && data.length > 10;
          }
        },
        {
          source: 'element.'+myname+'.'+chosenaccnts+':data',
          target: 'element.'+myname+'.'+chosensearch+':actual',
          filter: function (data) {
            return lib.isArray(data) && data.length > 10;
          }
        },
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

  function filteredController (el, totcnt, fltcnt) {
    if (totcnt == fltcnt) {
      el.set('actual', false);
      return;
    }
    el.set('text', 'Filtered: '+fltcnt);
    el.set('actual', true);
  }
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
},{}],3:[function(require,module,exports){
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
  HtmlVisualizedHash2StringListWithGroupingElement.prototype.annotateVisualizationUnit = function (valuevisual) {
    var visitem;
    HtmlVisualizedHash2StringListElement.prototype.annotateVisualizationUnit.call(this, valuevisual);
    visitem = valuevisual.visual;
    if (lib.isArray(valuevisual.value.group)) {
      valuevisual.value.group.forEach(this.handleGroupItemVisualization.bind(this, visitem));
      visitem = null;
      return;
    }
    this.handleDuplicate(null, valuevisual, valuevisual.value);
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
},{}],4:[function(require,module,exports){
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
  HtmlVisualizedItemCollectionElement.prototype.get_values = function () {
    var value = this.get('value');
    return lib.isArray(value) ? value.map(this.valueFromVisualizationItem.bind(this)) : null;
  };
  //static
  function valueser (res, item) {
    return res;
  }
  //endof static
  HtmlVisualizedItemCollectionElement.prototype.set_values = function (vals) {
    return this.queueFunctionInvocation(valuesSetter, [vals]);
  };
  function valuesSetter (vals) {
    var setobj;
    if (!lib.isNonEmptyArray(vals)) {
      return false;
    }
    setobj = {sel: [], desel: [], vals: vals};
    this.itemHelperMap.reduce(valuesSelector, setobj);
    setobj.sel.forEach(selectValNVis.bind(this));
    setobj.desel.forEach(deselectValNVis.bind(this));
    return true;
  };
  function valuesSelector (setobj, item, itemkey) {
    var maybenum = parseFloat(itemkey);
    var val = lib.isNumber(maybenum) ? maybenum : itemkey;
    setobj[(setobj.vals.indexOf(val)<0) ? 'desel' : 'sel'].push(item);
    return setobj;
  }
  function selectValNVis (valnvis) {
    valnvis.visual.addClass('active');
    this.addItemToValue(valnvis.value);
  }
  function deselectValNVis (valnvis) {
    valnvis.visual.removeClass('active');
    this.removeItemFromValue(valnvis.value);
  }
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
      if (this.getConfigVal('sortedvalues')){
        this.set('value', sortedValues(this.get('data'), currval.slice(), item));
        return;
      }
      this.set('value', currval.concat([item]));
      return;
    }
    this.set('value', item);
  };
  function sortedValues(data, currval, item) {
    var itind = data.indexOf(item), i, valind, insertindex=-1;
    for (i=0; i<currval.length && insertindex<0; i++) {
      valind = data.indexOf(currval[i]);
      if (valind>itind) {
        insertindex = i;
      }
    }
    if (insertindex<0) {
      insertindex = i;
    }
    currval.splice(insertindex, 0, item);
    //console.log('new value', currval);
    return currval;
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
},{}],5:[function(require,module,exports){
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
  HtmlVisualizedStringListElement.prototype.valueFromVisualizationItem = function (item) {
    return item;
  };

  applib.registerElementType('HtmlVisualizedStringList', HtmlVisualizedStringListElement);
}
module.exports = createHtmlVisualizedStringList;
},{}],6:[function(require,module,exports){
function createELements (execlib) {
  var lib = execlib.lib,
  lR = execlib.execSuite.libRegistry,
  applib = lR.get('allex_applib');

  require('./itemcollectioncreator')(lib, applib);
  require('./htmlvisualizeditemcollectioncreator')(lib, applib);
  require('./htmlvisualizedstringlistcreator')(lib, applib);
  require('./htmlvisualizedhash2stringlistcreator')(lib, applib);
  require('./htmlvisualizedhash2stringlistwithgroupingcreator')(lib, applib);
  require('./htmlvisualizedavailablechosencombo')(lib, applib);
}
module.exports = createELements;
},{"./htmlvisualizedavailablechosencombo":1,"./htmlvisualizedhash2stringlistcreator":2,"./htmlvisualizedhash2stringlistwithgroupingcreator":3,"./htmlvisualizeditemcollectioncreator":4,"./htmlvisualizedstringlistcreator":5,"./itemcollectioncreator":7}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
(function (execlib) {
  'use strict';

  require('./elements')(execlib);

})(ALLEX);

},{"./elements":6}]},{},[8]);
