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
		activeClass = pluginName + "-active-page",
		paginationMethods = {
			_createPagination: function(){
				var nav = $( this ).find( "." + pluginName + "-nav" ),
					items = $( this ).find( "." + pluginName + "-item" ),
					pNav = $( "<ol class='" + paginationClass + "'></ol>" ),
					num, thumb, content, itemType;

				// remove any existing nav
				nav.find( "." + paginationClass ).remove();

				items.each(function(i){
						num = i + 1;
						thumb = $( this ).attr( "data-thumb" );
						itemType = $( this ).attr( "data-type" );
						content = num;
						if( thumb ){
							content = "<img src='" + thumb + "' alt=''>";
						}
						pNav.append( "<li" + ( itemType ? " class='carousel-" + itemType + "'" : "" ) + "><a href='#" + num + "' title='Go to slide " + num + "'>" + (itemType ? itemType : content )+ "</a>" );
					if( itemType ){
						nav.addClass( "has-" + itemType );
					}
				});


				if( thumb ){
					pNav.addClass( pluginName + "-nav-thumbs" );
				}

				nav
					.addClass( pluginName + "-nav-paginated" )
					.find( "a" ).first().after( pNav );

			},
			_bindPaginationEvents: function(){
				$( this )
					.bind( "click", function( e ){
						var pagLink = $( e.target );

						if( e.target.nodeName === "IMG" ){
							pagLink = pagLink.parent();
						}

						pagLink = pagLink.closest( "a" );
						var href = pagLink.attr( "href" );

						if( pagLink.closest( "." + paginationClass ).length && href ){
							$( this )[ pluginName ]( "goTo", parseFloat( href.split( "#" )[ 1 ] ) );
							e.preventDefault();
						}
					} )
					// update pagination on page change
					.bind( "updateactive." + pluginName + " aftergoto." + pluginName, function( e ){
						var index = 0;
						$( this ).find("." + pluginName + "-item" ).each(function(i){
							if( $( this ).is( "." + pluginName + "-active" ) ){
								index = i;
							}
						});

						$( this ).find( "ol." + paginationClass + " li" )
							.removeClass( activeClass )
							.eq( index )
								.addClass( activeClass );
					} )
					.trigger( "updateactive." + pluginName );

			}
		};

	// add methods
	$.extend( $.fn[ pluginName ].prototype, paginationMethods );

	// create pagination on create and update
	$( document )
		.bind( "create." + pluginName, function( e ){
			$( e.target )
				[ pluginName ]( "_createPagination" )
				[ pluginName ]( "_bindPaginationEvents" );
		} )
		.bind( "update." + pluginName, function( e ){
			$( e.target )[ pluginName ]( "_createPagination" );
		} );

}(jQuery));
