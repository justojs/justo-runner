module.exports = function(grunt) {
  "use strict";

  // Project configuration
  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),

    // Task configuration
    babel: {
      options: {
        sourceMap: false,
        comments: false,
        retainLines: true,
        presets: ["es2015"]
      },

      es5: {
        files: {
        	"build/es5/index.js": "index.js",
          "build/es5/lib/Catalog.js": "lib/Catalog.js",
          "build/es5/lib/CompositeTask.js": "lib/CompositeTask.js",
          "build/es5/lib/FileMacro.js": "lib/FileMacro.js",
          "build/es5/lib/Finalizer.js": "lib/Finalizer.js",
          "build/es5/lib/Initializer.js": "lib/Initializer.js",
          "build/es5/lib/Operation.js": "lib/Operation.js",
          "build/es5/lib/RunError.js": "lib/RunError.js",
          "build/es5/lib/Runner.js": "lib/Runner.js",
          "build/es5/lib/SimpleTask.js": "lib/SimpleTask.js",
          "build/es5/lib/Stack.js": "lib/Stack.js",
          "build/es5/lib/Suite.js": "lib/Suite.js",
          "build/es5/lib/Task.js": "lib/Task.js",
          "build/es5/lib/TaskMacro.js": "lib/TaskMacro.js",
          "build/es5/lib/Test.js": "lib/Test.js",
          "build/es5/lib/Workflow.js": "lib/Workflow.js"
        }
      }
    },

    clean: {
      es5: {
        src: ["build/es5", "dist/es5"]
      }
    },

    copy: {
    	nodejs: {
    		files: [
    		  {cwd: "build/es5/", src: ["index.js", "lib/*.js"], dest: "dist/es5/nodejs/<%= pkg.name %>/", expand: true},
    		  {src: ["package.json", "README.md"], dest: "dist/es5/nodejs/<%= pkg.name %>/", expand: true}
    		]
    	}
    },

    jshint: {
      gruntfile: {
        src: ["Gruntfile.js"]
      },

      lib: {
        options: {
          jshintrc: true
        },

        src: ["lib/**"]
      },

      test: {
        options: {
        	jshintrc: true,
          ignores: [
            "test/mocha.opts",
            "test/unit/data/invalid.js"
          ]
        },

        src: ["test/**"]
      }
    },

    mochaTest:{
    	options: {
    		ignoreLeaks: false,
    		quiet: false,
    		reporter: "spec",
  			timeout: 1500
    	},

      es5: {
        options: {
          require: [
            "justo-assert"
          ]
        },

        src: [
          "test/unit/lib/**/*.js"
        ]
      }
    }
  });

  // These plugins provide necessary tasks
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-mocha-test");
  grunt.loadNpmTasks("grunt-travis-lint");

  //aliases
  grunt.registerTask("buildes5", ["travis-lint", "jshint", "clean:es5", "babel:es5", "copy:nodejs"]);
  grunt.registerTask("test", ["mochaTest:es5"]);
  grunt.registerTask("es5", ["buildes5", "test"]);

  // Default task
  grunt.registerTask("default", []);
};
