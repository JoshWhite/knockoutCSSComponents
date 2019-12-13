import ko from 'knockout';
import $ from 'jQuery';

const init = function (element, valueAccessor) {
    let self = ko.bindingHandlers.cssComponent,
        // get style with type="text/template" to prevent DOM remdering it
        style = $(element).children('style[type="text/template"]').html(),
        hasLabel = typeof valueAccessor() === 'string',
        componentLabel, component;

    if(hasLabel === false) {
        throw 'cssComponent missing label. Add string identifier to binding\'s value, eg: "my-component"';
    }

    // default name to __component__
    componentLabel = hasLabel ? '__' + valueAccessor() + '__' : '__component__';

    if (style === undefined) {
        throw 'No style tag with type "text/template" found: ' + componentLabel;
    }

    // create component
    component = self.componentFactory(style, componentLabel);

    // add hash to element as class 
    element.className = element.className + ' ' + component.hash;

    // add to head unless it already exists
    component.addComponentStyleToHead();

    // remove style blocks from element
    $(element).children('style').remove();

    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        // remove from head if needed
        component.removeComponentStyleFromHead();
    });

};

export default init;