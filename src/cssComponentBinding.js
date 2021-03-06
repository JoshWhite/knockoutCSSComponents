ko.bindingHandlers.cssComponent = {
    init: function (element, valueAccessor) {
        var self = ko.bindingHandlers.cssComponent,
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

    },

    componentStore: {},

    componentFactory: function componentFactory(css, label) {
        var componentStore = ko.bindingHandlers.cssComponent.componentStore,
            hash;

        // if needed, create component & add it to the store
        createComponent(css, label);

        // returns unique hash & methods for adding and removing components to the DOC head
        return {
            hash: hash,
            addComponentStyleToHead: addComponentStyleToHead,
            removeComponentStyleFromHead: removeComponentStyleFromHead
        }

        /* Public functions 
        ------------------------------------------ */
        function addComponentStyleToHead() {
            var component = componentStore[hash],
                css = component.css,
                head, styleBlock;

            if (component.count === 0) {

                // adapted from http://stackoverflow.com/a/524721
                head = document.head || document.getElementsByTagName('head')[0];
                styleBlock = document.createElement('style');

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
            else {
                component.count++;
            }
        }

        function removeComponentStyleFromHead() {
            var componentToRemove = componentStore[hash];
            componentToRemove.count--;

            if (componentToRemove.count === 0) {
                componentToRemove.styleBlock.parentNode.removeChild(componentToRemove.styleBlock);
            }
        }

        /* Private functions 
        ------------------------------------------ */
        function createComponent(css, label) {

            var mediaQueries = [],
                parsedCss, noMediaQueryCss, styleBlock;

            //create unique component hash with with prefix
            hash = label + generateStringhashCode(css.substring(0, 1000));

            // if component doesn't already exist, create & add it to componentStore object
            if (componentStore[hash] !== undefined) {
                return;
            }
            else {

                //Removes newlines & comments
                parsedCss = css.replace(/(\r\n|\n|\r)|(\/\*(\n|.)+?\*\/|\/\/.*(?=[\n\r]))/gm, "");

                noMediaQueryCss = extractMediaQueries(parsedCss, mediaQueries);

                styleBlock = mapCss(noMediaQueryCss, mediaQueries);

                addComponentToStore(hash, styleBlock);

            }
        }

        function extractMediaQueries(css, mediaQueries) {
            return css
                //split by media queries
                .split(/(@media[^{]*{(?:(?!}\s*}).)*}.*?})/)
                .map(function (line) {
                    var querySelector, queryRules;

                    // add mappedCss inside queries to containing array
                    // replace with placeholder
                    if (line.match(/@media/)) {
                        querySelector = line.split(/(?={)/).shift();
                        queryRules = mapCss(line.split(/@media[^{]+\{([\s\S]+?\})\s*\}/)[1]);

                        mediaQueries.push(querySelector + '{' + queryRules + '}');

                        return 'PLACEHOLDER }';

                    }
                        // return line without modifying
                    else {
                        return line;
                    }
                })
                .join('');
        }

        function mapCss(css, mediaQueries) {
            // add hash to each selector in rule 
            // return component style block
            return css
                .split('}')
                .map(function (cssLine) {
                    var trimmedCssLine = cssLine.trim(),
                        selectors;

                    if (trimmedCssLine.match('PLACEHOLDER')) {
                        return mediaQueries.shift();
                    }

                    if (trimmedCssLine !== "") {
                        selectors = trimmedCssLine.split('{')[0].trim(),
                        rule = trimmedCssLine.split('{')[1].trim(),
                        prependedSelectors = selectors
                            .trim()
                            .split(',')
                            .map(function (selector) {
                                // special selector for targetting the root element
                                if (selector.trim().match("._root")) {
                                    return selector.replace('_root', hash);
                                }
                                    //prepend every selector with the hash as a class
                                else {
                                    return '.' + hash + ' ' + selector.trim();
                                }
                            });

                        return prependedSelectors.join(',') + '{' + rule + '}';
                    }
                })
                .join('');
        }

        // should only be called if component doesn't exist.
        function addComponentToStore(name, rules) {
            componentStore[name] = {
                styleBlock: null,
                count: 0,
                css: rules
            };

            return componentStore;
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