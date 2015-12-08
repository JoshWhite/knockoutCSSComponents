ko.bindingHandlers.component = {
    init: function(element, valueAccessor) {
    	var style = $(element).data('component-style');
        var componentClass = CCSS.createComponentClass(style);

        $(element).children().addClass(componentClass);
    }
};