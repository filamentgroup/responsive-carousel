# Responsive Carousel 

[![Filament Group](http://filamentgroup.com/images/fg-logo-positive-sm-crop.png) ](http://www.filamentgroup.com/)

A jQuery-based script for responsive carousels that work with mouse, touch, and keyboard

## Getting Started

Install using `npm` using:

```
npm install responsive-carousel
```

This will create a copy of the project in your `node_modules` folder.

Or get the production version (.min.js) or the development version (.js) from the [releases page](https://github.com/filamentgroup/responsive-carousel/releases). Click the `dist-<version>.tar.gz` download.

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

There are other extensions in the `src` folder, such as flip and fade transitions, autoplay, keyboard handling, pagination, and more. If you'd like to create a build that includes certain extensions, just add them to the JS files listed under `concat` in the `Gruntfile.js` file, and run `grunt` from a command line.

### Demos

Check out the [`test/functional/`](http://filamentgroup.github.io/responsive-carousel/test/functional/) directory for demos.

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

For a demo see [`test/functional/no-loop.html`](http://filamentgroup.github.io/responsive-carousel/test/functional/no-loop.html).

### Set the Carousel Speed

To declaratively set the speed of the carousel, add a <code>data-interval</code> to the carousel container with a value set in milliseconds.

```html
<!-- set the carousel to change every 5 seconds -->
<div class="carousel" data-autoplay data-interval="5000">
  <div>
    <img src="...">
  </div>
  ...
</div>
```

For a demo see [`test/functional/flip-auto.html`](http://filamentgroup.github.io/responsive-carousel/test/functional/flip-auto.html) .



## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "src" subdirectory!_

## License
Copyright (c) 2015 Filament Group, Inc.
Licensed under the MIT, GPL licenses.
