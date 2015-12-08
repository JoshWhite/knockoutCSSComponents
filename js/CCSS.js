var CCSS = function () {
	
	var components = [];

	return {
		createComponentClass: createComponentClass,
		generateComponents: generateComponents,
		generateStringhashCode: generateStringhashCode
	}

	function createComponentClass(css) {
		//Removes whitespace/newlines
		var parsedCss = css.replace(/(\r\n|\n|\r|\s)/gm,"");
		
		//split into array of CSS rules
		//TODO: will break when '.' is used other than for a class. 
		//(eg: font-size: 2.1em)
		var cssRulesArray = parsedCss.split('.')
		
		//create unique component class with prefix and css string
		var componentClass = 'CCSS__' + this.generateStringhashCode(parsedCss) + '__'

		//add componentClass to each rule and join back to string
		var component = cssRulesArray
			.map(function(rule){
				if(rule !== '') {
					return '.' + componentClass + '.' + rule;
				}
			})
			.join('');

		// if component doesn't already exist, add it to components array
		if(components.indexOf(component) === -1) {
			components.push(component);
		}

		// returns component class string
		return componentClass;
	}

	function generateComponents () {

		//combine all components to one string
		var css = components.join(''),
			
			// add all components to style in head
			// take from http://stackoverflow.com/a/524721
		    head = document.head || document.getElementsByTagName('head')[0],
		    style = document.createElement('style');

		style.type = 'text/css';

		if (style.styleSheet){
		  style.styleSheet.cssText = css;
		} 
		else {
		  style.appendChild(document.createTextNode(css));
		}

		head.appendChild(style);
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

}();