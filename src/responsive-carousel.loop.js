(function($) {
	var pluginName = "carousel",
			itemClass = pluginName + "-item",
			activeClass = pluginName + "-active",
			isLooped = function( $element ) {
				return $element.attr( "data-loop" ) !== "false";
			};

	// DOM-ready auto-init
	$( document ).bind( "beforecreate." + pluginName, function( e ){
		$( e.target )[ pluginName ]( "_loopInit" );
	});

	$.extend( $.fn[pluginName].prototype, {
		_loopInit: function() {
			var $this = $(this),
				prototype = $.fn[pluginName].prototype;

			// prevent carousel movement on nav clicks
			$this.on( "beforegoto." + pluginName, prototype._loopBefore);

			// prevent drag movement on the carousel at either end
			$this.on( "beforedrag." + pluginName, prototype._loopBefore);
			$this.on( "drag." + pluginName, prototype._loopBefore);

			// hook into creation to style the nav
			$this.on( "beforecreatenav." + pluginName, prototype._loopBeforeCreateNav);
		},

		_loopBefore: function( event, data ) {
			var $this = $(event.target), newIndex, currentIndex, items;

			// if this carousel is supposed to loop, skip
			if( isLooped( $this ) ) {
				return;
			}

			newIndex = data.$to.index();
			currentIndex = data.$from.index();
			items = $this.find( "." + itemClass );

			// if the request index is greater than the # of items or smaller than zero
			if( (currentIndex === 0 && data.direction == "backward") ||
					(currentIndex == items.length - 1 && data.direction == "forward" )) {
				data.isDefaultPrevented = true;
				return;
			}

			if( newIndex === items.length - 1 ){
				$this[pluginName]( '_disableNav', 'next' );
			}

			if( newIndex === 0 ){
				$this[pluginName]( '_disableNav', 'prev' );
			}

			if( newIndex > 0 && newIndex < items.length - 1 ) {
				$this[pluginName]( '_enableNav', 'next' );
				$this[pluginName]( '_enableNav', 'prev' );
			}
		},

		_loopBeforeCreateNav: function( event, data ) {
			var $this = $(event.target), $items, $active;

			if( isLooped( $this ) ) {
				return;
			}

			$items = $this.find( "." + itemClass );
			$active = $items.filter( "." + activeClass );

			// if this is not a looped carousel enable and disable nav appropriately
			if( $active[0] === $items[0]) {
				$this[pluginName]( '_disableNav', 'prev', data.$nav );
			}

			if( $active.last()[0] === $items.last()[0]) {
				$this[pluginName]( '_disableNav', 'next', data.$nav );
			}
		},

		_disableNav: function( direction, $element ) {
			($element || $(this)).find( "a." + direction ).addClass( "disabled" );
		},

		_enableNav: function( direction, $element ) {
			($element || $(this)).find( "a." + direction ).removeClass( "disabled" );
		}
	});
})(jQuery);
