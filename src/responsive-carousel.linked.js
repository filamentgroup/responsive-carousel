(function($) {
	var pluginName = "carousel";

	// DOM-ready auto-init
	$( document ).on( "create." + pluginName, function( event ){
		$( event.target )[ pluginName ]( "_linkedInit" );
	});

	$.extend( $.fn[pluginName].prototype, {
		_linkedInit: function() {
			var $this = $(this),
				prototype = $.fn[pluginName].prototype;

			$( $this.attr("data-linked")	 ).on( "goto." + pluginName, $.proxy(prototype._linkedGoto, this));
		},

		_linkedGoto: function( event, to ) {
      var index = 0;

      // NOTE the choice to do the index work here is to avoid alterations
      //      to the core carousel code
      $(event.target).children().each(function(i, elem) {
        if( elem === to ){
          index = i;
          return false;
        }
      });

			$( this )[pluginName]( 'goTo', index + 1 );
		}
	});
})(jQuery);