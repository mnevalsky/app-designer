/**
 * Simple boilerplate for defining the requirejs settings, 
 * to initialize parsequery dependencies, and to invoke
 * the parsequery.changeUrlHash to interpret the 
 * window.location.hash value.
 *
 * Also sets up a timer polling for the completion of the
 * jquery mobile platform. After it is initialized, the
 * timer then triggers the processing of the hash of the 
 * initial page load (which triggers the parsing and 
 * interpretation of the formDef.json for the form).
 */
requirejs.config({
    baseUrl: shim.getBaseUrl(),
	waitSeconds: 12,
    paths: {
        // third-party libraries we depend upon 
        //jqmobile : 'libs/jquery.mobile-1.2.0/jquery.mobile-1.2.0',
        jqmobile : 'libs/jquery.mobile-1.3.1/jquery.mobile-1.3.1',
        //jquery : 'libs/jquery.1.8.2',
        jquery : 'libs/jquery.1.9.1',
        //backbone : 'libs/backbone.0.9.2',
        backbone : 'libs/backbone.1.0.0',
        //handlebars : 'libs/handlebars.1.0.0.beta.6',
        handlebars : 'libs/handlebars.1.0.0.rc.4',
        //underscore : 'libs/underscore.1.3.3',
        //underscore : 'libs/underscore.1.4.2',
        underscore : 'libs/underscore.1.4.4',
        //text : 'libs/text.2.0.3',
        text : 'libs/text.2.0.6',
        //mobiscroll : 'libs/mobiscroll/js/mobiscroll-2.0.3.custom.min',
        mobiscroll : 'libs/mobiscroll-2.5.4/js/combined.min',
        // directory paths for resources
        img : 'img',
        templates : 'templates',
        // top-level objects
        mdl : 'js/mdl',
        screenTypes : 'js/screenTypes',
        promptTypes : 'js/promptTypes',
        // shim.js -- stub directly loaded
        // functionality
        screens : 'js/screens',
        prompts : 'js/prompts',
        database : 'js/database',
        controller : 'js/controller',
        builder : 'js/builder',
        screenManager : 'js/screenManager',
        parsequery : 'js/parsequery',
        opendatakit : 'js/opendatakit',
        jqmConfig : 'js/jqmConfig',
        handlebarsHelpers : 'js/handlebarsHelpers',
        formulaFunctions : 'js/formulaFunctions',
        'jquery-csv' : 'libs/jquery-csv/src/jquery.csv'
    },
    shim: {
        'jquery': {
            // Slimmer drop-in replacement for jquery
            //These script dependencies should be loaded before loading
            //zepto.js
            deps: [],
            //Once loaded, use the global '$' as the
            //module value.
            exports: '$'
        },
        'jqmobile': {
            // Slimmer drop-in replacement for jquery
            //These script dependencies should be loaded before loading
            //jqmobile.js
            deps: ['jquery', 'jqmConfig']
        },
        'underscore': {
            //These script dependencies should be loaded before loading
            //underscore.js
            deps: [],
            //Once loaded, use the global '_' as the
            //module value.
            exports: '_'
        },
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'handlebars': {
            //These script dependencies should be loaded before loading
            //handlebars.js
            deps: ['jquery'],
            //Once loaded, use the global 'Handlebars' as the
            //module value.
            exports: 'Handlebars'
        },
        'mobiscroll': {
            deps: ['jquery']
        },
        'jquery-csv' : {
            deps: ['jquery']
        }
    }
});

requirejs(['jquery', 'mdl','opendatakit', 'database','parsequery',
                        'jqmobile', 'builder', 'controller',
                        'screens',
                        'prompts'/* mix-in additional prompts and support libs here */], 
        function($, mdl,opendatakit,database,parsequery,m,builder,controller) {
            var ctxt = controller.newStartContext();
            ctxt.append("main.parsequery.initialize");
            parsequery.initialize(controller,builder);

            //
            // define a function that waits until jquery mobile is initialized
            // then calls changeUrlHash() to trigger loading and processing of
            // the requested form.
            var f = function() {
                if ( $.mobile != null && !$.mobile.hashListeningEnabled ) {
                    
                    if ( window.location.search != null && window.location.search.indexOf("purge") >= 0 ) {
                        ctxt.append('purging datastore');
                        database.purge($.extend({},ctxt,{success:function() {
                                parsequery.changeUrlHash(ctxt);
                            }}));
                    } else {
                        parsequery.changeUrlHash(ctxt);
                    }
                } else {
                    ctxt.append('startup.delay');
                    setTimeout(f, 200);
                }
            };
        
            f();

});