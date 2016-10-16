global.ko = require('../src/js/knockout.js');
var expect  = require("chai").expect;
var rewire = require("rewire");
var binding = rewire("../src/js/cssComponentBinding");
console.log(binding.__get__();

var mediaQuery = "@media (max-width: 600px) {.title {font-style: italic;color: blue;}}";

describe("CSS Component Binding", function() {
	describe("Create a component", function() {
		describe("Remove all media queries", function() {
			// console.log(binding.__get__('extractMediaQueries'));
			// var extractMediaQueries = binding.componentFactory.__get__('extractMediaQueries');
			// console.log(extractMediaQueries);
			// it('Should not have any media queries in the string', function() {

			// })
		})
	})
});