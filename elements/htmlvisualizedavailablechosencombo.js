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