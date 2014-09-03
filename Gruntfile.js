/*global module:false*/

var childProc = require("child_process");

module.exports = function(grunt) {
	var pkg, minfiles = {},
		lintFiles = ['Gruntfile.js', 'src/*.js', 'test/**/*.js'],
		pluginNamespaces = [
			"ajax",
			"autoplay",
			"drag",
			"dynamic-containers",
			"flip",
			"keybd",
			"loop",
			"pagination",
			"touch"
		];


	// Minify all the plugins
	pluginNamespaces.forEach(function( namespace, i ) {
		minfiles[ "dist/<%= pkg.name %>." + namespace + ".min.js" ] =
			[ "dist/<%= pkg.name %>." + namespace + ".js" ];
	});

	// Minify the main concatenated files
	minfiles[ "dist/<%= pkg.name %>.min.js" ] = [ "dist/<%= pkg.name %>.js" ];

	// Project configuration.
	grunt.initConfig({
		pkg: pkg = grunt.file.readJSON('package.json'),
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>*/'
		},

		concat: {
			dist: {
				src: ['<banner:meta.banner>', 'src/responsive-carousel.js', 'src/responsive-carousel.touch.js', 'src/responsive-carousel.drag.js', 'src/responsive-carousel.pagination.js', 'src/responsive-carousel.autoinit.js' ],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},

		copy: {
			plugins: {
				files: [
					{
						expand: true,
						// NOTE prevent overwritting by only pulling namespaced files
						src: "src/*.*.js",
						dest: "dist/",
						filter: "isFile",
						flatten: true
					},

					{
						expand: true,
						src: "src/*.css",
						dest: "dist/",
						filter: "isFile",
						flatten: true
					}
				]
			}
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>'
			},

			dist: {
				files: minfiles
			}
		},

		watch: {
			files: lintFiles,
			tasks: 'jshint qunit'.split( " " )
		},

		jshint: {
			all: lintFiles
		},

		qunit: {
			all: [ "test/unit/responsive-carousel.html" ]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.task.registerTask( "compress", "compress the dist folder", function() {
		var done = this.async();
		childProc.exec( "tar czf dist-" + pkg.version + ".tar.gz dist", function() {
			done();
		});
	});

	// Default task.
	grunt.registerTask('default', 'jshint qunit copy:plugins concat uglify'.split( " " ));

	// Travis
	grunt.registerTask('travis', 'jshint qunit'.split( " " ));
};
