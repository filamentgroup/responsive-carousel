(function($) {
	var pluginName = "carousel";

	// DOM-ready auto-init
	$( document ).on( "create." + pluginName, function( event ){
		$( event.target )[ pluginName ]( "_linkedInit" );
	});

	$.extend( $.fn[pluginName].prototype, {
		_linkedInit: function() {
			var $this = $(this),
				prototype = $.fn[pluginName].prototype, selector;

			selector = $this.attr("data-linked");

			if( !selector ){
				return;
			}

			// mirror the master carousel's movements
			$( selector ).on( "goto." + pluginName, $.proxy(prototype._linkedGoto, this));

			// disable goto on this, the slave carousel
			$( this ).on( "beforegoto." + pluginName, $.proxy(function( event ) {
				if( !$this.data('gotoPermitted') ) {
					event.preventDefault();
				}
			}, this));

			$this.find( "." + pluginName + "-nav" ).addClass( "disabled" );
		},

		_linkedGoto: function( event, to ) {
			var index = 0, $this = $(this);

			// NOTE the choice to do the index work here is to avoid alterations
			//			to the core carousel code
			$(event.target).children().each(function(i, elem) {
				if( elem === to ){
					index = i;
					return false;
				}
			});

			$this[pluginName]( '_permitGoTo', function() {
				$this[pluginName]( 'goTo', index + 1 );
			});
		},

		_permitGoTo: function( callback ) {
			var $this = $(this);
			$this.data( 'gotoPermitted', true );
			callback.call(this);
			$this.data( 'gotoPermitted', false );
		}
	});
})(jQuery);