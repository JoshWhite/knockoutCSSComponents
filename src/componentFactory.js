import ko from 'knockout';


const componentFactory = function (css, label) {
    let componentStore = ko.bindingHandlers.cssComponent.componentStore,
        hash;

    // if needed, create component & add it to the store
    createComponent(css, label);

    // returns unique hash & methods for adding and removing components to the DOC head
    return {
        hash: hash,
        addComponentStyleToHead: addComponentStyleToHead,
        removeComponentStyleFromHead: removeComponentStyleFromHead,
    };

    /* Public functions 
    ------------------------------------------ */
    function addComponentStyleToHead() {
        let component = componentStore[hash],
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
        let componentToRemove = componentStore[hash];
        componentToRemove.count--;

        if (componentToRemove.count === 0) {
            componentToRemove.styleBlock.parentNode.removeChild(componentToRemove.styleBlock);
        }
    }

    /* Private functions 
    ------------------------------------------ */
    function createComponent(css, label) {

        let mediaQueries = [],
            parsedCss, noMediaQueryCss, styleBlock;

        //create unique component hash with with prefix
        hash = label + generateStringhashCode(css.substring(0, 1000));

        // if component doesn't already exist, create & add it to componentStore object
        if (componentStore[hash] !== undefined) {
            return;
        }
        else {

            //Removes newlines & comments
            parsedCss = css.replace(/(\r\n|\n|\r)|(\/\*(\n|.)+?\*\/|\/\/.*(?=[\n\r]))/gm, '');

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
                let querySelector, queryRules;

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
                let trimmedCssLine = cssLine.trim(),
                    selectors;

                if (trimmedCssLine.match('PLACEHOLDER')) {
                    return mediaQueries.shift();
                }

                if (trimmedCssLine !== '') {
                    selectors = trimmedCssLine.split('{')[0].trim();
                    const rule = trimmedCssLine.split('{')[1].trim();
                    const prependedSelectors = selectors
                        .trim()
                        .split(',')
                        .map(function (selector) {
                            // special selector for targetting the root element
                            if (selector.trim().match('._root')) {
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
            css: rules,
        };

        return componentStore;
    }

    // taken from: http://stackoverflow.com/a/7616484
    function generateStringhashCode(string) {
        let hash = 0, i, chr, len;

        if (string.length === 0) {
            return hash;
        }

        for (i = 0, len = string.length; i < len; i++) {
            chr = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }

        return hash;
    }

};

export default componentFactory;