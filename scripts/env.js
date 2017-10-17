"use strict";

(function (window) {
	window.__env = window.__env || {};

        window.__env.environment = 'qa';

 	// Whether or not to enable debug mode
 	// Setting this to false will disable console output
 	window.__env.enableDebug = true;
   	//window.__env.apiUrl = 'https://devvm.onescreen.branham.us';
   	window.__env.apiUrl = 'https://onescreen-neha.qa.kotter.net';
   	//window.__env.apiUrl = 'https://onescreen-keith.qa.kotter.net';

        // Setting this to false will disable VertoInit
        window.__env.enableVerto = true;

	// Disable Chat in View and Signin ... will still be part of Signup
 	window.__env.disableChat = false;

        window.__env.disableAutoLogout = true;

}(this));

