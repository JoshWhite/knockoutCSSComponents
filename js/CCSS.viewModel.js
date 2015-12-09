var CCSS = {};

CCSS.viewModel = function(options) {

	'use strict';

	var itemArray = ko.observableArray([
		{
			title: "1",
			description: "something about 1"	
		},
		{
			title: "2",
			description: "something about 2"
		},
		{
			title: "3",
			description: "something about 3"
		}

	]);

	var thingArray = ko.observableArray([
		{
			title: "1",
			description: "something about 1"	
		},
		{
			title: "2",
			description: "something about 2"
		},
		{
			title: "3",
			description: "something about 3"
		}

	]);

	itemArray().map(function (item) {
		return itemFactory(item);
	});

	return {
		items: itemArray,
		things: thingArray,
		add: add
	}

	function remove(data) {
		itemArray.remove(data);
	}

	function add() {

		itemArray.push(itemFactory(
			{
				title: "newItem",
				description: "new description!!!!"
			}
		));
	}

	function itemFactory (item) {
		item.remove = remove;
		return item;
	}

};