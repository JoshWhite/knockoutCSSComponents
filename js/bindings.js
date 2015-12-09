ko.bindingHandlers.cssComponent = {
    init: function(element, valueAccessor) {
    	var self = ko.bindingHandlers.cssComponent;

    	// get style with type="text/template" to prevent DOM remdering it
    	var style = $(element).find('style[type="text/template"]').html();

    	if(style === undefined) {
    		throw 'No style tag with type "text/template" found';
    	}

    	// create component and return unique hash
    	var hash = self.CCSS().createComponent(style);

        // add hash as class to all children
        // debugger;
        $(element).find('*').addClass(hash);

        // if component doesn't exist, create, else increment count
        if(self.components[hash].count === 0) {
        	self.CCSS().addComponentStyleToHead(hash);
        }
        else {
        	self.components[hash].count++;
        }

        // replace data attr with unique hash
        $(element).data('component-style', hash);

        // remove style blocks
        $(element).find('style').remove();

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {

            var hash = $(element).data('component-style');
            var component = self.components[hash];
            component.count--;
            
            if(component.count === 0) {
            	$(component.element).remove();
            }
        });

    },

    components: {},

    CCSS: function () {
	
		var components = ko.bindingHandlers.cssComponent.components;

		return {
			createComponent: createComponent,
			addComponentStyleToHead: addComponentStyleToHead,
			generateStringhashCode: generateStringhashCode
		}

		function createComponent(css) {
			//Removes newlines
			var parsedCss = css.replace(/(\r\n|\n|\r)/gm,"");

			//create unique component class with prefix and css string
			var hash = '__CCSS__' + this.generateStringhashCode(parsedCss);
			
			//split into array of CSS rules (won't work with media queries)
			var cssRulesArray = parsedCss.split('}');

			// add hash to each selector in rule 
			// returns array of strings containing the rules + selector
			var componentRules = cssRulesArray.map(function(cssLine) {
				var trimmedCssLine = cssLine.trim();
				if(trimmedCssLine !== "") {
					var selectors = trimmedCssLine.split('{')[0].trim();
					var rule = trimmedCssLine.split('{')[1].trim();
					var prependedSelectors = selectors
						.trim()
						.split(',')
						.map(function(selector) { 
							return selector.trim() + '.' + hash;
						});

					return prependedSelectors.join(',') + '{' + rule + '}';
				}
			});

			// if component doesn't already exist, add it to components object
			if(components[hash] === undefined) {
				components[hash] = {
					element: null,
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

			if (styleBlock.styleSheet){
			  styleBlock.styleSheet.cssText = css;
			} 
			else {
			  styleBlock.appendChild(document.createTextNode(css));
			}

			head.appendChild(styleBlock);
			//

			// Update component values
			component.count = 1;
			component.element = styleBlock;
		}

		// taken from: http://stackoverflow.com/a/7616484
		function generateStringhashCode(string) {
		  	var hash = 0, i, chr, len;
		  	
		  	if (string.length === 0) {
		  		return hash;
		  	}

		  	for (i = 0, len = string.length; i < len; i++) {
		    	chr   = string.charCodeAt(i);
		    	hash  = ((hash << 5) - hash) + chr;
		    	hash |= 0; // Convert to 32bit integer
		  	}
		  	
		  	return hash;
		};

	}
};