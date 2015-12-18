ko.bindingHandlers.cssComponent = {
    init: function (element, valueAccessor) {
        var self = ko.bindingHandlers.cssComponent;

        // get style with type="text/template" to prevent DOM remdering it
        var style = $(element).find('style[type="text/template"]').html();

        if (style === undefined) {
            throw 'No style tag with type "text/template" found';
        }

        // create component and return unique hash
        var hash = self.componentFactory().createComponent(style);

        // add "_root" & hash as class 
        element.className = element.className + ' ' + hash;

        // if component doesn't exist, create, else increment count
        if (self.components[hash].count === 0) {
            self.componentFactory().addComponentStyleToHead(hash);
        }
        else {
            self.components[hash].count++;
        }

        // create data attr with unique hash
        element.setAttribute('data-component-style', hash);

        // remove style blocks
        $(element).find('style').remove();

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {

            var hash = element.getAttribute('data-component-style');
            var component = self.components[hash];
            component.count--;

            if (component.count === 0) {
                component.styleBlock.parentNode.removeChild(component.styleBlock);
            }
        });

    },

    components: {},

    componentFactory: function () {
        var components = ko.bindingHandlers.cssComponent.components;

        return {
            createComponent: createComponent,
            addComponentStyleToHead: addComponentStyleToHead,
            generateStringhashCode: generateStringhashCode
        }

        function createComponent(css) {
             //Removes newlines & comments
            var parsedCss = css.replace(/(\r\n|\n|\r)|(\/\*(\n|.)+?\*\/|\/\/.*(?=[\n\r]))/gm, "");

            //create unique component hash with with prefix
            var hash = '__component__' + this.generateStringhashCode(parsedCss);

            // if component doesn't already exist, add it to components object
            if (components[hash] === undefined) {

                //split into array of CSS rules (won't work with media queries)
                var cssRulesArray = parsedCss.split('}');

                // add hash to each selector in rule 
                // returns array of strings containing the rules + selector
                var componentRules = cssRulesArray.map(function (cssLine) {
                    var trimmedCssLine = cssLine.trim();
                    if (trimmedCssLine !== "") {
                        var selectors = trimmedCssLine.split('{')[0].trim();
                        var rule = trimmedCssLine.split('{')[1].trim();
                        var prependedSelectors = selectors
							.trim()
							.split(',')
							.map(function (selector) {                                
						        // special selector for targetting the root element
                                if(selector.trim() === "._root") {
                                    return '.' + hash;  
                                }
                                //prepend every selector with the hash as a class
                                else {
                                    return '.' + hash + ' ' + selector.trim();
                                }
							});

                        return prependedSelectors.join(',') + '{' + rule + '}';
                    }
                });

                //Add to components object
                components[hash] = {
                    styleBlock: null,
                    count: 0,
                    css: componentRules.join('')
                };

            }

            // returns component hash
            return hash;
        }

        function addComponentStyleToHead(hash) {
            var component = components[hash];
            var css = component.css;

            // adapted from http://stackoverflow.com/a/524721
            var head = document.head || document.getElementsByTagName('head')[0];
            var styleBlock = document.createElement('style');

            styleBlock.type = 'text/css';

            if (styleBlock.styleSheet) {
                styleBlock.styleSheet.cssText = css;
            }
            else {
                styleBlock.appendChild(document.createTextNode(css));
            }

            head.appendChild(styleBlock);
            //

            // Update component values
            component.count = 1;
            component.styleBlock = styleBlock;
        }

        // taken from: http://stackoverflow.com/a/7616484
        function generateStringhashCode(string) {
            var hash = 0, i, chr, len;

            if (string.length === 0) {
                return hash;
            }

            for (i = 0, len = string.length; i < len; i++) {
                chr = string.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }

            return hash;
        };

    }
};