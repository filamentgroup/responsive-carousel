/*
 * responsive-carousel pagination extension
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function( $, undefined ) {
	var pluginName = "carousel",
		initSelector = "." + pluginName + "[data-paginate]",
		paginationClass = pluginName + "-pagination",
		paginationMethods = {
			_createPagination: function(){
				var nav = $( this ).find( "." + pluginName + "-nav" ),
					items = $( this ).find( "." + pluginName + "-item" ),
					pNav = $( "<ol class='" + paginationClass + "'></ol>" ),
					num;
				
				// remove any existing nav
				nav.find( "." + paginationClass ).remove();
				
				for( var i = 0, il = items.length; i < il; i++ ){
					num = i + 1;
					pNav.append( "<li><a href='#" + num + "' title='Go to slide " + num + "'>" + num + "</a>" );
				}
				nav
					.addClass( pluginName + "-nav-paginated" )
					.find( "a" ).first().after( pNav );
			},
			_bindPaginationEvents: function(){
				$( this ).bind( "click", function( e ){
					var pagLink = $( e.target ).closest( "a" ),
						href = pagLink.attr( "href" );
						
					if( href ){
						$( this )[ pluginName ]( "goTo", parseFloat( href.split( "#" )[ 1 ] ) );
						e.preventDefault();
					}
				} );
			}
		};
			
	// add methods
	$.extend( $.fn[ pluginName ].prototype, paginationMethods ); 
	
	// create pagination on create and update
	$( initSelector )
		.live( "create." + pluginName, function(){
			$( this )
				[ pluginName ]( "_createPagination" )
				[ pluginName ]( "_bindPaginationEvents" );
		} )
		.live( "update." + pluginName, function(){
			$( this )[ pluginName ]( "_createPagination" );
		} );

}(jQuery));