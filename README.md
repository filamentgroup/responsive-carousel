# Responsive Carousel

A jQuery-based script for responsive carousels that work with mouse, touch, and keyboard

[![Build Status](https://travis-ci.org/filamentgroup/responsive-carousel.png)](https://travis-ci.org/filamentgroup/responsive-carousel)

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/filamentgroup/responsive-carousel/master/dist/responsive-carousel.min.js
[max]: https://raw.github.com/filamentgroup/responsive-carousel/master/dist/responsive-carousel.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/responsive-carousel.min.js"></script>
<link href="src/responsive-carousel.css" rel="stylesheet">

<div class="carousel">
	<div>
		<!-- carousel item content here -->
	</div>
	<div>
		<!-- carousel item content here -->
	</div>
</div>

```

The default build includes the slide/drag transition that you can apply by adding a data attribute and including some additional CSS.
```html
<script src="jquery.js"></script>
<script src="dist/responsive-carousel.min.js"></script>
<link href="src/responsive-carousel.css" rel="stylesheet">
<link href="src/responsive-carousel.slide.css" rel="stylesheet">

<div class="carousel" data-transition="slide">
	<div>
		<!-- carousel item content here -->
	</div>
	<div>
		<!-- carousel item content here -->
	</div>
</div>

```

### Extended features

There are other extensions in the `src` folder, such as flip and fade transitions, autoplay, keyboard handling, pagination, and more. If you'd like to create a build that includes certain extensions, just add them to the JS files listed under `concat` in the `/grunt.js` file, and run `grunt` from a command line.

### Demos

Check out the [`test/functional/`](http://filamentgroup.github.com/responsive-carousel/test/functional/) directory for demos.

## Documentation

### Preventing Content Looping

The default carousel (`responsive-carousel.js`) returns to the initial active item(s) once it reaches the end of its list. This behavior can be disabled by annotating the carousel DOM element with `data-loop='false'` and including `responsive-carousel.loop.js` directly after the core carousel JS. For example:

```html
...
<script src="path/to/responsive-carousel.js"></script>
<script src="path/to/responsive-carousel.loop.js"></script>
...

<div class="carousel" data-loop="false">
  <div>
	  <img src="...">
  </div>

  ...
</div>
```

Then, after both the carousel and plugin have loaded you can initialize as normal.

```javascript
$( ".carousel" ).carousel();
```

When the carousel reaches the end or beginning of the list, the inserted navigation links (`a.next` and `a.prev`) will be decorated with an additional `disabled` class. This class receives no properties from the library by default.

For a demo see `test/functional/no-loop.html`.

### Linked Carousels

Two carousels can be linked in a master/slave relationship where the slave carousel's navigation is disabled and dictated solely by navigation operations on the master carousel.

```html
...

<script src="../../src/responsive-carousel.js"></script>
<script src="../../src/responsive-carousel.loop.js"></script>
<script src="../../src/responsive-carousel.linked.js"></script>

...
	<div class="carousel master" data-loop="false">
	    <div>
	        <img src="../assets/large.jpg">
	    </div>

			...

	</div>

	<div class="carousel slave" data-linked=".carousel.master">
	    <div>
	        <img src="../assets/large.jpg">
	    </div>

			...


	</div>
```

The slave carousel designates it's master using a selector string value for the `data-linked` attribute. Otherwise the carousels can be initialized as normal.

```javascript
$( ".carousel.master, .carousel.slave" ).carousel();
```

**NOTE** There is no special accounting for different numbers of slides in each carousel. Without `data-loop=false` on the slave carousel it will simply wrap to the first slide when it's master has a greater number of slides. Adding the `data-loop=false` stops the slave at it's final slide.

### More

More coming soon.


## Examples

Check out the [`test/functional/`](http://filamentgroup.github.com/responsive-carousel/test/functional/) directory for examples.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "src" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Filament Group, Inc.
Licensed under the MIT, GPL licenses.
