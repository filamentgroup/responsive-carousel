/*! Shoestring - v0.1.0 - 2012-07-25
* http://github.com/filamentgroup/shoestring/
* Copyright (c) 2012 Scott Jehl, Filament Group, Inc; Licensed MIT & GPLv2 */

/*! shoestring - a simple framework for DOM utilities, targeting modern browsers without failing the rest. Copyright 2012 @scottjehl, Filament Group, Inc. Licensed MIT/GPLv2 */
(function( w, undefined ){
	
	"use strict";
	
	var doc = w.document,
		shoestring = function( prim, sec ){
		
			var pType = typeof( prim ),
				ret = [];
				
			if( prim ){
				// if string starting with <, make html
				if( pType === "string" && prim.indexOf( "<" ) === 0 ){
					var dfrag = document.createElement( "div" );
					dfrag.innerHTML = prim;
					return shoestring( dfrag ).children().each(function(){
						dfrag.removeChild( this );
					});
				}
				else if( pType === "function" ){
					return shoestring.ready( prim );
				}
				// if string, it's a selector, use qsa
				else if( pType === "string" ){
					if( sec ){
						return shoestring( sec ).find( prim );
					}
					for( var i = 0, sel = doc.querySelectorAll( prim ), il = sel.length; i < il; i++ ){
						ret[ i ] = sel[ i ];
					}
				}
				// object? passthrough
				else {
					ret = ret.concat( prim );
				}
			}
			// if no prim, return a wrapped doc
			else{
				ret.push( doc );
			}
		
			ret = shoestring.extend( ret, shoestring.fn );
		
			return ret;
		};
	
	// For adding element set methods
	shoestring.fn = {};
	
	// Public each method
	// For iteration on sets
	shoestring.fn.each = function( fn ){
		for( var i = 0, il = this.length; i < il; i++ ){
			fn.call( this[ i ], i );
		}
		return this;
	};
	
	// For contextual lookups
	shoestring.fn.find = function( sel ){
		var ret = [],
			finds;
		this.each(function(){
			finds = this.querySelectorAll( sel );
			for( var i = 0, il = finds.length; i < il; i++ ){
				ret = ret.concat( finds[i] );
			}
		});
		return shoestring( ret );
	};
	
	// Children - get element child nodes.
	// This is needed for HTML string creation
	shoestring.fn.children = function(){
		var ret = [],
			childs,
			j;
		this.each(function(){
			childs = this.children;
			j = -1;
		
			while( j++ < childs.length-1 ){
				if( shoestring.inArray(  childs[ j ], ret ) === -1 ){
					ret.push( childs[ j ] );
				}
			}
		});
		return shoestring(ret);
	};
	
	// Public non-dom utilities
	
	// browser support qualifier - shoestring any usage of shoestring in a qualify callback
	shoestring.qualified = "querySelectorAll" in doc;
	
	shoestring.qualify = function( callback ){
		if( callback && shoestring.qualified ){
			return callback();
		}
		// return support bool if there's no callback
		else if( !callback ){
			return shoestring.qualified;
		}
	};
	
	// For extending objects
	shoestring.extend = function( first, second ){
		for( var i in second ){
			if( second.hasOwnProperty( i ) ){
				first[ i ] = second[ i ];
			}
		}
		return first;
	};
	
	// check if an item exists in an array
	shoestring.inArray = function( needle, haystack ){
		var isin = -1;
		for( var i = 0, il = haystack.length; i < il; i++ ){
			if( haystack.hasOwnProperty( i ) && haystack[ i ] === needle ){
				isin = i;
			}
		}
		return isin;
	};
	
	// For DOM ready execution
	shoestring.ready = function( fn ){
		if( ready && fn && shoestring.qualified ){
			fn.call( document );
		}
		else if( fn && shoestring.qualified ){
			readyQueue.push( fn );
		}
		else {
			runReady();
		}
		
		return [doc];
	};
	
	// non-shortcut ready
	shoestring.fn.ready = function( fn ){
		shoestring.ready( fn );
		return this;
	};
	
	// Empty and exec the ready queue
	var ready = false,
		readyQueue = [],
		runReady = function(){
			if( !ready ){
				while( readyQueue.length ){
					readyQueue.shift().call( document );
				}
				ready = true;
			}
		};
	
	// Quick IE8 shiv
	if( !w.addEventListener ){
		w.addEventListener = function( evt, cb ){
			return w.attachEvent( "on" + evt, cb );
		};
	}
	
	// DOM ready
	w.addEventListener( "DOMContentLoaded", runReady, false );
	w.addEventListener( "readystatechange", runReady, false );
	w.addEventListener( "load", runReady, false );
	// If DOM is already ready at exec time
	if( doc.readyState === "complete" ){
		runReady();
	}
	
	// expose
	w.shoestring = shoestring;

}( this ));
// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	
	var xmlHttp = (function() {
		var xmlhttpmethod = false;	
		try {
			xmlhttpmethod = new XMLHttpRequest();
		}
		catch( e ){
			xmlhttpmethod = new ActiveXObject( "Microsoft.XMLHTTP" );
		}
		return function(){
			return xmlhttpmethod;
		};
	}());
	
	shoestring.ajax = function( url, options ) {
		var req = xmlHttp(),
		settings = shoestring.ajax.settings;
		
		if( options ){
			shoestring.extend( settings, options );
		}
		if( !url ){
			url = settings.url;
		}
		
		if( !req || !url ){
			return;
		}	
		
		req.open( settings.method, url, settings.async );
		
		req.onreadystatechange = function () {
			if ( req.readyState !== 4 || req.status !== 200 && req.status !== 304 ){
				return settings.error( req.responseText, req.status, req );
			}
			settings.success( req.responseText, req.status, req );
		};
		if( req.readyState === 4 ){
			return;
		}

		req.send( null );
	};
	
	shoestring.ajax.settings = {
		success: function(){},
		error: function(){},
		method: "GET",
		async: true,
		data: null
	};
}());
// Extensions
(function( undefined ){
	shoestring.get = function( url, callback ){
		return shoestring.ajax( url, { success: callback } );
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.load = function( url, callback ){
		var self = this,
			args = arguments,
			intCB = function( data ){
				self.each(function(){
					shoestring( this ).html( data );
				});
				if( callback ){
					callback.apply( self, args );
				}
		};
		shoestring.ajax( url, { success: intCB } );
		return this;
	};
}());
// Extensions
(function( undefined ){
	shoestring.post = function( url, data, callback ){
		return shoestring.ajax( url, { data: data, method: "POST", success: callback } );
	};
}());
// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	shoestring.fn.data = function( name, val ){
		if( name !== undefined ){
			if( val !== undefined ){
				return this.each(function(){
					if( !this.shoestringData ){
						this.shoestringData = {};
					}
					this.shoestringData[ name ] = val;
				});
			}
			else {
				return this[ 0 ].shoestringData && this[ 0 ].shoestringData[ name ];
			}
		}
		else {
			return this[ 0 ].shoestringData;
		}
	};
}());
// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	shoestring.fn.removeData = function( name ){
		return this.each(function(){
			if( name !== undefined && this.shoestringData ){
				this.shoestringData[ name ] = undefined;
				delete this.shoestringData[ name ];
			}
			else {
				this[ 0 ].shoestringData = {};
			}
		});
	};
}());
// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	window.$ = shoestring;
}());
// Extensions
(function( undefined ){
	shoestring.fn.add = function( sel ){
		var ret = [];
		this.each(function( i ){
			ret.push( this );
		});
		
		shoestring( sel ).each(function(){
			ret.push( this );
		});
		
		return shoestring( ret );
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.addClass = function( cname ){
		var classes = cname.trim().split( " " );
		return this.each(function(){
			for( var i = 0, il = classes.length; i < il; i++ ){
				if( this.className !== undefined && ( this.className === "" || !this.className.match( new RegExp( "(^|\\s)" + classes[ i ] + "($|\\s)" ) ) ) ){
					this.className += " " + classes[ i ];
				}
			}
		});
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.after = function( frag ){
		if( typeof( frag ) === "string" || frag.nodeType !== undefined ){
			frag = shoestring( frag );
		}
		return this.each(function( i ){
			for( var j = 0, jl = frag.length; j < jl; j++ ){
				var insertEl = i > 0 ? frag[ j ].cloneNode( true ) : frag[ j ];
				this.parentNode.insertBefore( insertEl, this );
				this.parentNode.insertBefore( this, insertEl );
			}
		});
	};
	
	shoestring.fn.insertAfter = function( sel ){
		return this.each(function(){
			shoestring( sel ).after( this );
		});
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.append = function( frag ){
		if( typeof( frag ) === "string" || frag.nodeType !== undefined ){
			frag = shoestring( frag );
		}
		return this.each(function( i ){
			for( var j = 0, jl = frag.length; j < jl; j++ ){
				this.appendChild( i > 0 ? frag[ j ].cloneNode( true ) : frag[ j ] );
			}
		});
	};
	
	shoestring.fn.appendTo = function( sel ){
		return this.each(function(){
			shoestring( sel ).append( this );
		});
	};
	
}());
// Extensions
(function( undefined ){
	shoestring.fn.attr = function( name, val ){
		var nameStr = typeof( name ) === "string";
		if( val !== undefined || !nameStr ){
			return this.each(function(){
				if( nameStr ){
					this.setAttribute( name, val );
				}
				else {
					for( var i in name ){
						if( name.hasOwnProperty( i ) ){
							this.setAttribute( i, name[ i ] );
						}
					}
				}
			});
		}
		else {
			return this[ 0 ].getAttribute( name );
		}
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.before = function( frag ){
		if( typeof( frag ) === "string" || frag.nodeType !== undefined ){
			frag = shoestring( frag );
		}
		return this.each(function( i ){
			for( var j = 0, jl = frag.length; j < jl; j++ ){
				this.parentNode.insertBefore( i > 0 ? frag[ j ].cloneNode( true ) : frag[ j ], this );
			}
		});
	};
	
	shoestring.fn.insertBefore = function( sel ){
		return this.each(function(){
			shoestring( sel ).before( this );
		});
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.closest = function( sel ){
		var ret = [];
		if( !sel ){
			return shoestring( ret );
		}
		
		this.each(function(){
			var self = this,
				generations = 0;
				
			shoestring( sel ).each(function(){
				if( self === this ){
					ret[ 0 ] = self;
				}
				else {
					var i = 0;
					while( self.parentElement && ( !generations || i < generations ) ){
						i++;
						if( self.parentElement === this ){
							ret[ 0 ] = self.parentElement;
							generations = i;
						}
						else{
							self = self.parentElement;
						}
					}
				}
			});
		});
		return shoestring( ret );
	};
}());
// Extensions.
(function( undefined ){	// TODO: This code should be consistent with attr().
	shoestring.fn.css = function( prop, val ){
		if( typeof prop === "object" ) {
			return this.each(function() {
				for( var key in prop ) {
					if( prop.hasOwnProperty( key ) ) {
						this.style[ key ] = prop[ key ];
					}
				}
			});
		}
		else {
			if( val !== undefined ){
				return this.each(function(){
					this.style[ prop ] = val;
				});
			}
			else {
				return window.getComputedStyle( this[ 0 ], prop );
			}
		}
	};
}());
// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	shoestring.fn.eq = function( num ){
		if( this[ num ] ){
			return shoestring( this[ num ] );
		}
		return shoestring([]);
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.filter = function( sel ){
		var ret = [],
			wsel =  shoestring( sel );

		this.each(function(){
			
			if( !this.parentNode ){
				var context = shoestring( document.createDocumentFragment() );
				context[ 0 ].appendChild( this );
				wsel = shoestring( sel, context );
			}
			
			if( shoestring.inArray( this, wsel ) > -1 ){
				ret.push( this );				
			}
		});

		return shoestring( ret );
	};
}());
// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	shoestring.fn.first = function(){
		return this.eq( 0 );
	};
}());

// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	shoestring.fn.get = function( num ){
		return this[ num ];
	};
}());
// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	shoestring.fn.height = function( num ){
		if( num === undefined ){
			return this[ 0 ].offsetHeight;
		}
		else {
			return this.each(function(){
				this.style.height = num;
			});
		}
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.html = function( html ){
		if( html ){
			return this.each(function(){
				this.innerHTML = html;
			});
		}
		else{
			var pile = "";
			return this.each(function(){
				pile += this.innerHTML;
			});
		}
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.is = function( sel ){
		var ret = false;
		this.each(function( i ){
			if( shoestring.inArray( this, shoestring( sel ) )  > -1 ){
				ret = true;				
			}
		});
		return ret;
	};
}());
// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	shoestring.fn.last = function(){
		return this.eq( this.length - 1 );
	};
}());

// Extensions
(function( undefined ){
	shoestring.fn.next = function(){
		var ret = [],
			next;
		this.each(function( i ){
			next = this.nextElementSibling;
			if( next ){
				ret = ret.concat( next );
			}
		});
		return shoestring(ret);
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.not = function( sel ){
		var ret = [];
		this.each(function( i ){
			if( shoestring.inArray( this, shoestring( sel ) ) === -1 ){
				ret.push( this );				
			}
		});
		return shoestring( ret );
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.parent = function(){
		var ret = [],
			parent;
		this.each(function(){
			parent = this.parentElement;
			if( parent ){
				ret.push( parent );
			}
		});
		return shoestring(ret);
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.parents = function( sel ){
		var ret = [];
		
		this.each(function(){
			var curr = this,
				match;
			while( curr.parentElement && !match ){
				curr = curr.parentElement;
				if( sel ){
					if( curr === shoestring( sel )[0] ){
						match = true;
						if( shoestring.inArray( curr, ret ) === -1 ){
							ret.push( curr );
						}
					}
				}
				else {
					if( shoestring.inArray( curr, ret ) === -1 ){
						ret.push( curr );
					}
				}				
			}
		});
		return shoestring(ret);
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.prepend = function( frag ){
		if( typeof( frag ) === "string" || frag.nodeType !== undefined ){
			frag = shoestring( frag );
		}
		return this.each(function( i ){
			
			for( var j = 0, jl = frag.length; j < jl; j++ ){
				var insertEl = i > 0 ? frag[ j ].cloneNode( true ) : frag[ j ];
				if ( this.firstChild ){
					this.insertBefore( insertEl, this.firstChild );
				}
				else {
					this.appendChild( insertEl );
				}
			}
		});
	};
	
	shoestring.fn.prependTo = function( sel ){
		return this.each(function(){
			shoestring( sel ).prepend( this );
		});
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.prev = function(){
		var ret = [],
			next;
		this.each(function( i ){
			next = this.previousElementSibling;
			if( next ){
				ret = ret.concat( next );
			}
		});
		return shoestring(ret);
	};
}());
// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	shoestring.fn.prevAll = function(){
		var ret = [];
		this.each(function( i ){
			var self = this;
			while( self.previousElementSibling ){
				ret = ret.concat( self.previousElementSibling );
				self = self.previousElementSibling;
			}
		});
		return shoestring(ret);
	};
}());

// Extensions
(function( undefined ){
	shoestring.fn.prop = function( name, val ){
		name = shoestring.propFix[ name ] || name;
		if( val !== undefined ){
			return this.each(function(){
				this[ name ] = val;
			});
		}
		else {
			return this[ 0 ][ name ];
		}
	};
	
	// Property normalization, a subset taken from jQuery src
	shoestring.propFix = {
		"class": "className",
		contenteditable: "contentEditable",
		"for": "htmlFor",
		readonly: "readOnly",
		tabindex: "tabIndex"
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.remove = function( sel ){
		return this.each(function(){
			this.parentNode.removeChild( this );
		});
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.removeAttr = function( attr ){
		return this.each(function(){
			this.removeAttribute( attr );
		});
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.removeClass = function( cname ){
		var classes = cname.trim().split( " " );
		
		return this.each(function(){
			for( var i = 0, il = classes.length; i < il; i++ ){
				if( this.className !== undefined ){
					this.className = this.className.replace( new RegExp( "(^|\\s)" + classes[ i ] + "($|\\s)", "gmi" ), " " );
				}
			}
		});
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.removeProp = function( prop ){
		var name = shoestring.propFix && shoestring.propFix[ name ] || name;
		return this.each(function(){
			this[ prop ] = undefined;
			delete this[ prop ];
		});
	};
}());
// Extensions
(function( undefined ){
	shoestring.fn.replaceWith = function( frag ){
		if( typeof( frag ) === "string" ){
			frag = shoestring( frag );
		}
		var ret = [];
		this.each(function( i ){
			for( var j = 0, jl = frag.length; j < jl; j++ ){
				var insertEl = i > 0 ? frag[ j ].cloneNode( true ) : frag[ j ];
				this.parentNode.insertBefore( insertEl, this );
				insertEl.parentNode.removeChild( this );
				ret.push( insertEl );
			}
		});
		return shoestring( ret );
	};
}());
// Extensions.
(function( undefined ){
	shoestring.fn.siblings = function(){
		var sibs = [],
			el = this[ 0 ].parentNode.firstChild;

		while( el = el.nextSibling ) {
			if( el.nodeType === 1 && el !== this[ 0 ] ) {
				sibs.push( el );
			}
		}
		return shoestring( sibs );
	};
}());
// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	shoestring.fn.width = function( num ){
		if( num === undefined ){
			return this[ 0 ].offsetWidth;
		}
		else {
			return this.each(function(){
				this.style.width = num;
			});
		}
	};
}());
// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	shoestring.fn.shoestringInner = function( html ){
		return this.each(function(){
			var inH = this.innerHTML;
			this.innerHTML = "";
			shoestring( this ).append( shoestring( html ).html( inH ) );
		});
	};
}());

// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	shoestring.fn.bind = function( evt, callback ){
		var evts = evt.split( " " );
		return this.each(function(){
			for( var i = 0, il = evts.length; i < il; i++ ){
				if( "addEventListener" in this ){
					this.addEventListener( evts[ i ], callback, false );
				}
				else if( this.attachEvent ){
					this.attachEvent( "on" + evts[ i ], callback );
				}
			}
		});
	};
}());
// Extensions

// keep this shoestringper around the ones you use!
(function( undefined ){
	shoestring.fn.live = function( evt, callback ){
		var evts = evt.split( " " );
		return this.each(function(){
			var self = this;
			
			function newCB( e ){
				if( event.target === self ){
					callback.call( self, e );
				}
			}
			
			for( var i = 0, il = evts.length; i < il; i++ ){
				if( "addEventListener" in document ){
					document.addEventListener( evts[ i ], newCB, false );
				}
				else if( document.attachEvent ){
					document.attachEvent( "on" + evts[ i ], newCB );
				}
			}
		});
	};
}());
// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	shoestring.fn.one = function( evt, callback ){
		var evts = evt.split( " " );
		return this.each(function(){
			var cb;

			for( var i = 0, il = evts.length; i < il; i++ ){
				var thisevt = evts[ i ];
				if( "addEventListener" in this ){
					cb = function( e ){
						callback.call( this, e );
						this.removeEventListener( thisevt, cb );
					};
					this.addEventListener( thisevt, cb, false );
				}
				else if( this.attachEvent ){
					cb = function( e ){
						callback.call( this, e );
						this.detachEvent( "on" + thisevt, cb );
					};
					this.attachEvent( "on" + thisevt, cb );
				}
			}
		});
	};
}());
// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	shoestring.fn.trigger = function( evt, args ){
		var evts = evt.split( " " );
		return this.each(function(){
			for( var i = 0, il = evts.length; i < il; i++ ){
				// TODO needs IE8 support
				if( document.createEvent ){
					var event = document.createEvent( "Event" );
					event.initEvent( evts[ i ], true, true );
					event.args = args;
					this.dispatchEvent( event );
				}
			}
		});
	};
}());
// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	shoestring.fn.unbind = function( evt, callback ){
		var evts = evt.split( " " );
		return this.each(function(){
			for( var i = 0, il = evts.length; i < il; i++ ){
				if( "removeEventListener" in this ){
					this.removeEventListener( evts[ i ], callback );
				}
				else if( this.detachEvent ){
					this.detachEvent( "on" + evts[ i ], callback );
				}
			}
		});
	};
}());
