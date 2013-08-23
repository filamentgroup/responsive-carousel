
(function($) {
	var pluginName = "carousel",
			itemClass = pluginName + "-item",
			activeClass = pluginName + "-active",
			isLooped = function( $element ) {
				return $element.attr( "data-loop" ) !== "false";
			};

	// DOM-ready auto-init
	$( document ).on( "beforecreate." + pluginName, function(){
		$( this )[ pluginName ]( "_loopInit" );
	});

	$.extend( $.fn[pluginName].prototype, {
		_loopInit: function() {
			var $this = $(this);

			$this.on( "beforegoto." + pluginName,
				$.proxy($.fn[pluginName].prototype._loopBeforeGoto, this));

			$this.on( "beforecreatenav." + pluginName,
				$.proxy($.fn[pluginName].prototype._loopBeforeCreateNav, this));
		},

		_loopBeforeGoto: function( event, data ) {
			var $this = $(event.target), index = data.nextIndex, items = data.items;

			if( !isLooped( $this ) ) {
				// if the request index is larger than the set of carousel items or smaller than zero
				// and the carousel has been anotated correctly, prevent wrapping
				if( (index < 0 || index > (items.length - 1))) {
					event.preventDefault();
					return;
				}

				if( index === items.length - 1 ){
					$this[pluginName]( '_disableNav', 'next' );
				}

				if( index === 0 ){
					$this[pluginName]( '_disableNav', 'prev' );
				}

				if( index > 0 && index < items.length - 1 ) {
					$this[pluginName]( '_enableNav', 'next' );
					$this[pluginName]( '_enableNav', 'prev' );
				}
			}
		},

		_loopBeforeCreateNav: function( event, data ) {
			var $this = $(event.target), $items, $active;

			$items = $this.find( "." + itemClass );

			$active = $items.filter( "." + activeClass );

			// if this is not a looped carousel enable and disable nav appropriately
			if( !isLooped( $this ) ) {
				if( $active[0] === $items[0]) {
					$this[pluginName]( '_disableNav', 'prev', data.$nav );
				}

				if( $active.last()[0] === $items.last()[0]) {
					$this[pluginName]( '_disableNav', 'next', data.$nav );
				}
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