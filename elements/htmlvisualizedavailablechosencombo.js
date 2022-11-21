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
    this.needsChosenToBeSet = this.createBufferableHookCollection();
    this.needsChosenToBeReset = this.createBufferableHookCollection();
  }
  lib.inherit(HtmlVisualizedAvailableChosenElement, WebElement);
  HtmlVisualizedAvailableChosenElement.prototype.__cleanUp = function () {
    if(this.needsChosenToBeReset) {
       this.needsChosenToBeReset.destroy();
    }
    this.needsChosenToBeReset = null;
    if(this.needsChosenToBeSet) {
       this.needsChosenToBeSet.destroy();
    }
    this.needsChosenToBeSet = null;
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
    /* niet goed
    var w = this.getWidget('chosen');
    return w ? w.set('data', data) : false;
    */
    this.needsChosenToBeSet.fire(data);
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
          triggers: [
            'element.'+myname+'.'+unchooseall+'!clicked',
            'element.'+myname+'!needsChosenToBeReset',
          ],
          references: [
            'element.'+myname+'.'+availaccnts,
            'element.'+myname+'.'+chosenaccnts
          ].join(','),
          handler: function(avlacc, chsnacc) {
            var all = chsnacc.get('data');
            chsnacc.set('data', null);
            avlacc.addItems(lib.isArray(all) ? all : []);
          }
        },
        {
          triggers: 'element.'+myname+'!needsChosenToBeSet',
          references: [
            'element.'+myname+'.'+availaccnts,
            'element.'+myname+'.'+chosenaccnts
          ].join(','),
          handler: function(avlacc, chsnacc, newchosen) {
            avlacc.removeItems(newchosen);
            chsnacc.addItems(newchosen);
          }
        }
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