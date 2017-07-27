"use strict";
(function (window) {
    window.__env = window.__env || {};

    // REQUIRED per env - this will be used in constants.js to point to the proper environment URL's
    window.__env.environment = 'qa'; 
    //window.__env.environment = 'production'; 
    //window.__env.environment = 'staging'; 

    // UNCOMMENT / CHANGE if using a local or non standard version of onescreen. This will override the onescreen used in constants.js
    //window.__env.apiUrl = 'http://onescreenapi.dev';
    window.__env.apiUrl = 'https://onescreen-keith.qa.kotter.net';
    //window.__env.apiUrl = 'https://onescreen-neha.qa.kotter.net';
    //window.__env.apiUrl = 'https://onescreen-rbranham.qa.kotter.net';

    // UI URI 
    // UNCOMMENT / CHANGE if using a local or non standard version of symphony. This will override the symphony used in constants.js
    window.__env.symphonyUrl = 'http://localhost:9000';

    //Custom ScreenSharing URL
    //window.__env.ssUrl = 'https://myscreen.kotter.net';

    //Custom Chat Servers
    // UNCOMMENT & CHANGE if using a non standard version of mattermost. This will override the mattermost used in constants.js
    //window.__env.mmUrl = 'https://chat.keithgallant.com/api/v3';
    //window.__env.chatWebsocket = 'wss://chat.keithgallant.com/api/v3/users/websocket';

    // Whether or not to enable debug mode
    // Setting this to false will disable some console output and some error logging
    window.__env.enableDebug = true;

    // Setting this to false will disable VertoInit - calls will not be possible
    window.__env.enableVerto = true;

    // Disable Chat in View and Signin ... will still be part of Signup
    window.__env.disableChat = false;
    window.__env.disableMobileCutoff = true;
    window.__env.disableAutoLogout = true;

}(this));
