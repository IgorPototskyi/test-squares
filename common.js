(function() {
	
	var count = 0;
	init();

	function init() {
		$('<input/>', {type: 'button', 
				   	   name: 'btn1', 
				   	   value: 'Sort',
				   	   class: 'btn'}).appendTo("body");
		var $cont = $('<ul>', {class : "rectangles-container"}).appendTo("body");

		if (isStorageEmpty()) {
			$cont.attr('data-sorted', 'false');
			var items = [];

			$.getJSON('data.json', function(data) {
				parseObj(data, items);
				renderItems(items, $cont);
			});
		} else {
			loadFromStorage($cont);
		}
	}

	function parseObj(json, result) {
		for (var key in json) {

			if (typeof(json[key]) == 'object') {
				parseObj(json[key], result); 
			} else {
				var $rectangle = $('<li>');
				$rectangle.attr('data-pos', count);
				$rectangle.attr('data-key', key);
				$rectangle.attr('data-color', json[key]);
				$rectangle.attr('data-border-width-x3', 'false');

				result.push($rectangle);
				count++;
			}
		}
	}

	function renderItems(items, $cont) {
		var style = {},
			$item = {},
			$dataColor,
			$dataKey,
			$dataPos;

		for (var i = 0; i < items.length; i++) {
			$item = items[i];
			$dataColor = $item.attr('data-color');
			$dataKey = $item.attr('data-key');
			$dataPos = $item.attr('data-pos');
			style = {'border-width' : $dataKey};

			if (!(i % 3)) $item.addClass('clearfix');
			if (i % 2) style['box-shadow'] = '0 5px 3px yellow';

			if (!($dataKey % 2)) style["border-color"] = $dataColor;	
			else style["background-color"] = $dataColor;

			$($item).addClass('rectangle').css(style).appendTo($cont);
		}
	}

	function addSpecClasses(item) {
		item.addClass('rotating');
		item.prev().addClass('yellow');
		item.next().addClass('opacity');
	}

	function removeSpecClasses(item) {
		item.removeClass('rotating');
		item.prev().removeClass('yellow');
		item.next().removeClass('opacity');
	}

	$('body').on('mouseenter', '.rectangle', function() {
		addSpecClasses($(this));
	});

	$('body').on('mouseleave', '.rectangle', function() {
		removeSpecClasses($(this));
	});

	$('body').on('click', '.rectangle', function() {
		$self = $(this);
		var dataBorderWidthX3 = $self.attr('data-border-width-x3');
		var $borderWidth = $self.css('border-width');
		
		if (dataBorderWidthX3 == 'true') {
			$self.css({'border-width': parseInt($borderWidth) / 3 + 'px'});
			$self.attr('data-border-width-x3', 'false');
		} else {
			$self.css({'border-width': parseInt($borderWidth) * 3 + 'px'});
			$self.attr('data-border-width-x3', 'true');
		}

		removeSpecClasses($self);
		saveToStorage($self.parent());
		addSpecClasses($self);
	});

	$('body').on('click', '.btn', function() {
		var $cont = $('.rectangles-container');
		var $items = $cont.children();

		if ($cont.attr('data-sorted') == 'true') {
			$items.sort(function(a, b){	
				return a.getAttribute('data-pos') - b.getAttribute('data-pos');
			});
			$cont.attr('data-sorted', 'false');
		} else {
			$items.sort(function(a, b){			
				return a.getAttribute('data-key') - b.getAttribute('data-key');
			});
			$cont.attr('data-sorted', 'true');
		}

		for (var j = 0; j < $items.length; j++)
		{	
			$item = $items.eq(j);
			$item.removeClass('clearfix');
			$item.css({'box-shadow' : 'none'});

			if (!(j % 3)) $item.addClass('clearfix');
			if (j % 2) $item.css({'box-shadow' : '0 5px 3px yellow'});
		}
		$items.detach().appendTo($cont);
		saveToStorage($cont);
	});

	function saveToStorage(container) {
		localStorage.setItem('data-sorted', container.attr('data-sorted'));
		localStorage.setItem('container-html', container.html());
	};

	function loadFromStorage(container) {
		container.attr('data-sorted', localStorage.getItem('data-sorted'));
		container.html(localStorage.getItem('container-html'));
	}

	function isStorageEmpty() {
		return (localStorage.getItem('data-sorted') === null || localStorage.getItem('container-html') === null);
	}

		// function jSort(items, attr) {
	// 	console.log(items);
	// 	for (var i = 0; i < items.length; i++) {
	// 		for (var j = 0; j < items.length - i - 1; j++) {
	// 			if (items.eq(j).attr(attr) > items.eq(j + 1).attr(attr)) {
	// 				var temp = items.eq(j);
	// 				items.eq(j) = items.eq(j + 1);
	// 				items.eq(j + 1) = temp;
	// 			}
	// 		}
	// 	}
	// };

	
		
})();
