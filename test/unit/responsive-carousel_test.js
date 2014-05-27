/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {
  var $carousel = $( "[data-carousel]" ), $items;

	function setup() {
		$carousel = $( "[data-carousel]" ).carousel();
		$items = $carousel.find("[data-carousel-item]");
	}

	module( "no-loop", {
		setup: function() {
			$carousel = $( "[data-carousel]" ).attr( "data-loop", false ).carousel();
			$items = $carousel.find("[data-carousel-item]");
		}
	});

	test( "prev disabled initially", function() {
		ok( $carousel.find( "a.prev" ).is( ".disabled" ), "previous is disabled" );
	});

	test( "next disabled when the last item is active", function() {
		$carousel.carousel( "goTo", $items.length );
		ok( $carousel.find( "a.next" ).is( ".disabled" ), "next is disabled" );
	});

	test( "next using goto on the last item is prevented", function() {
		$carousel.carousel( "goTo", $items.length );
		ok( $items.last().is( ":visible" ), "last item focused" );
		$carousel.carousel( "goTo", "+1" );
		ok( $items.last().is( ":visible" ), "last item focused" );
	});

	test( "next using goto on the last item is prevented", function() {
		$carousel.carousel( "goTo", 1 );
		ok( $items.first().is( ":visible" ), "first item focused" );
		$carousel.carousel( "goTo", "-1" );
		ok( $items.first().is( ":visible" ), "first item focused" );
	});

	test( "both are enabled when an inner item is active", function() {
		$carousel.carousel( "goTo", $items.length - 1);
		ok( !$carousel.find( "a.next" ).is( ".disabled" ), "next is enabled" );
		ok( !$carousel.find( "a.prev" ).is( ".disabled" ), "prev is enabled" );
	});

	test( "nav is enabled when an inner item is active", function() {
		$carousel = $( "[data-carousel]" ).carousel();
		$carousel.carousel( "goTo", $items.length - 1);

		ok( !$carousel.find( "a.next" ).is( ".disabled" ), "next is enabled" );
		ok( !$carousel.find( "a.prev" ).is( ".disabled" ), "next is enabled" );
	});

	module( "core", {setup: setup});

	test( "child-items have carousel-item class", function() {
		$items.each(function(i, item) {
			ok( $(item).is(".carousel-item") );
		});
	});

	module( "goTo", {setup: setup});

	test( "shows the right carousel item" , function(){
		var position = 2;

		$carousel.carousel( "goTo", position );
		ok( $items.eq(position - 1).is(":visible") );
	});

	test( "+1 advances by one position", function() {
		var position = 2;

		$carousel.carousel( "goTo", position );
		$carousel.carousel( "goTo", "+1" );
		ok( $items.eq(position).is(":visible") );
	});

	test( "-1 retreats by one position", function() {
		var position = 2;

		$carousel.carousel( "goTo", position );
		$carousel.carousel( "goTo", "-1" );
		ok( $items.first().is(":visible") );
	});

	test( "-1 at the first item returns to the last item", function() {
		$carousel.carousel( "goTo", 1 );
		$carousel.carousel( "goTo", "-1" );
		ok( $items.last().is(":visible") );
	});

	test( "+1 at the last item returns to the first item", function() {
		$carousel.carousel( "goTo", $items.length );
		$carousel.carousel( "goTo", "+1" );
		ok( $items.first().is(":visible") );
	});
}(jQuery));
