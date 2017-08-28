(function() {
    //$.verto.init({}, bootstrapBase);
    //vertoInit();
})();

var vertoHandleBase, vertoCallbacksBase, currentCallBase, callListBase;
var loginExtensionBase, fsDomainBase, pwBase, callerIdNameBase;
var wssServerBase;
var bandwidthTestDataBase;
var destinationNumberBase;
var decliningCall = false;
var useVideoBase = false;
var verto_port;

var heartBeatStarted = false;

var standaloneDemo = false;
//standaloneDemo = true;
var angularCallService;

function vertoInit(callService, vertoPort) {
    angularCallService = callService;
    verto_port = vertoPort;
    $.verto.init({}, bootstrapBase);
}

function tag() {
    var vid = document.createElement('video');
    vid.setAttribute("style", "width: 1px; height: 1px");
    vid.setAttribute("autoplay", "autoplay");
    var randomNumber = Math.floor(Math.random() * (10000000 - 1000000 + 1)) + 1000000; // Math.floor(Math.random() * (max - min + 1)) + min;
    vid.id = "v-" + randomNumber;
    document.getElementById("videoElements").appendChild(vid);
    return vid.id;
}

function makeCallBase(destinationNumberBase) {
    vertoHandleBase.videoParams({
        // Dimensions of the video feed to send.
        minWidth: 320,
        minHeight: 240,
        maxWidth: 640,
        maxHeight: 480,
        // The minimum frame rate of the client camera, Verto will fail if it's
        // less than this.
        minFrameRate: 15,
        // The maximum frame rate to send from the camera.
        vertoBestFrameRate: 30
    });
    if(__env.enableDebug) console.log("destinationNumberBase = " + destinationNumberBase);
    destinationNumberBase = angularCallService.formatPhoneNumber(destinationNumberBase);
    if(__env.enableDebug) console.log("After str replace, destinationNumberBase = " + destinationNumberBase);

    currentCallBase = vertoHandleBase.newCall({
        // Extension to dial.
        destination_number: destinationNumberBase,
        caller_id_name: callerIdNameBase,
        caller_id_number: loginExtensionBase,
        //outgoingBandwidth: 'default',
        //incomingBandwidth: 'default',
        outgoingBandwidth: 2000,
        incomingBandwidth: 5000,
        // Enable stereo audio.
        useStereo: true,
        //screenShare: true,
        useVideo: false,
        tag:  tag(),
        mirrorInput: true,
        // You can pass any application/call specific variables here, and they will
        // be available as a dialplan variable, prefixed with 'verto_dvar_'.
        userVariables: {
            // Shows up as a 'verto_dvar_email' dialplan variable.
            email: 'test@test.com'
        },
        // Use a dedicated outbound encoder for this user's video.
        // NOTE: This is generally only needed if the user has some kind of
        // non-standard video setup, and is not recommended to use, as it
        // dramatically increases the CPU usage for the conference.
        dedEnc: false
        // Example of setting the devices per-call.
        //useMic: 'any',
        //useSpeak: 'any',
    });

}; // makeCallBase

function isValidVertoPort(portNum) {
    if (portNum === "0" || !portNum) { return false; };
    return true;
};

function bootstrapBase(status) {

    //  if(standaloneDemo)
    //  {
    //    loginExtensionBase = document.getElementById("myExtensionBase").value;
    //  }
    //  else {
    //    loginExtensionBase = $("#txtMyExtension").html();
    //  }

    if(__env.enableDebug) console.log("Setting wssServerBase = fsDomainBase.");
    wssServerBase = fsDomainBase;


    var which_port;
    var which_server;

    which_port =  isValidVertoPort(verto_port) ? verto_port :
        parseInt(CryptoJS.MD5(wssServerBase).toString().substring(0, 1), 16) % 3;

    switch(which_port) {
    case 0:
        which_server = "wss://" + wssServerBase + ":8084";
        break;
    case 1:
        which_server = "wss://" + wssServerBase + ":8083";
        break;
    case 2:
        which_server = "wss://" + wssServerBase + ":8082";
        break;
    default:
        which_server = "wss://" + wssServerBase + ":" + which_port;
        break;
    }

    //wssServerBase = 'telephony.kotter.net';
    //which_server = "wss://" + wssServerBase + ":8082";

    if(__env.enableDebug) console.log("loginExtensionBase = " + loginExtensionBase);
    if(__env.enableDebug) console.log("fsDomainBase = " + fsDomainBase);
    if(__env.enableDebug) console.log("wssServerBase = " + wssServerBase);
    if(__env.enableDebug) console.log("which_server=", which_server);
    if(__env.enableDebug) console.log("login = " + loginExtensionBase + '@' + fsDomainBase);

    vertoHandleBase = new jQuery.verto({
        login: loginExtensionBase + '@' + fsDomainBase,
        passwd: pwBase,
        //socketUrl: 'wss://' + fsDomainBase + ':8082',
        socketUrl: which_server,
        // TODO: Where is this file, on the server? What is the base path?
        ringFile: 'sounds/bell_ring2.mp3',
        iceServers: true,
        tag:  tag(),
        deviceParams: {
            useMic: 'any',
            useSpeak: 'any',
            useVideo: false,
            useCamera:  'none'
        }
    }, vertoCallbacksBase);


    if(standaloneDemo) {
        document.getElementById("logIn").addEventListener("click", loginBase);
        document.getElementById("make-call").addEventListener("click", makeCallBase);
        document.getElementById("hang-up-call").addEventListener("click", hangupCallBase);
        document.getElementById("answer-call").addEventListener("click", answerCallBase);
        //document.getElementById("enableVideo").addEventListener("click", enableVideoBase);
        document.getElementById("hold-call").addEventListener("click", holdCallBase);
        document.getElementById("mute-call").addEventListener("click", muteCallBase);
        document.getElementById("transfer-call").addEventListener("click", transferCallBase);
    }
}; // function bootstrapBase

var testBandwidthBase = function() {
    // Translates to 256KB.
    var bytesToSendAndReceive = 1024 * 256;
    vertoHandleBase.rpcClient.speedTest(bytesToSendAndReceive, function(event, data) {
        // These values are in kilobits/sec.
        var upBand = Math.ceil(data.upKPS);
        var downBand = Math.ceil(data.downKPS);
        if(__env.enableDebug) console.log('[BANDWIDTH TEST] Up: ' + upBand + ', Down: ' + downBand);
        // Store the results for later.
        bandwidthTestDataBase = data;
    });
}; // testBandwidthBase

vertoCallbacksBase = {
    onDialogState: onDialogStateBase,
    onWSLogin: onWSLoginBase,
    onWSClose: onWSCloseBase,
    onMessage: onMessageBase
}; // vertoCallbacksBase
if(__env.enableDebug) console.log("vertoCallbacksBase");
if(__env.enableDebug) console.log(vertoCallbacksBase);

function onWSLoginBase(verto, success) {
    if(__env.enableDebug) console.log('onWSLoginBase', success);
    if(success) {
        testBandwidthBase();
    }
}; // onWSLoginBase

// Receives conference-related messages from FreeSWITCH.
// Note that it's possible to write server-side modules to send customized
// messages via this callback.
function onMessageBase(verto, dialog, message, data) {
    // console.log("onMessageBase called, message = ");
    // console.log(message);
    switch (message) {
    case $.verto.enum.message.pvtEvent:
        if (data.pvtData) {
            switch (data.pvtData.action) {
                // This client has joined the live array for the conference.
            case "conference-liveArray-join":
                // With the initial live array data from the server, you can
                // configure/subscribe to the live array.
                //console.log("Calling initLiveArray");
                initLiveArray(verto, dialog, data);
                break;
                // This client has left the live array for the conference.
            case "conference-liveArray-part":
                // Some kind of client-side wrapup...
                break;
            }
        }
        break;
    }
} // onMessageBase

function enableVideo(){
    if(currentCallBase) {
        if(__env.enableDebug) console.log('enableVideo');
        currentCallBase.useVideo = false;
    }
} // enableVideo

function loginBase(){
    bootstrapBase();
} // loginBase

function holdCallBase(){
    if(currentCallBase.state.name !== 'held') {
        currentCallBase.hold();
    }
    else {
        currentCallBase.unhold();
    }
} // holdCallBase

function muteCallBase(){
    if(__env.enableDebug) console.log("muting");
    currentCallBase.setMute("toggle");
} // muteCallBase

function sendtovoicemail(){
    if(__env.enableDebug) console.log('sendtovoicemail');
    try {
        if(currentCallBase !== null) {
            currentCallBase.transfer("*99" + loginExtensionBase);
        }
    } catch(ex) {
    }
} // sendtovoicemail

function transferCallBase(destinationNumber){
    if(__env.enableDebug) console.log('transferCallBase');
    currentCallBase.transfer(destinationNumber);
} // transferCallBase

function hangupCallBase() {
    try {
        if(currentCallBase !== null) {
            currentCallBase.hangup();
        }
    } catch(ex) {
    }
}; // hangupCallBase

function declineCallBase() {
    if(__env.enableDebug) console.log("verto declineCall,   [currentCallBase]  " );

    try {
        if(currentCallBase !== null) {
            decliningCall = true;
            answerCallBase(true);
            setTimeout(function(){
                //do what you need here
                hangupCallBase();
            }, 2000);
        }
    } catch(ex) {
    }
}

function answerDialog(incomingData) {
    if(__env.enableDebug) console.log("Entering answerDialog");
    var data = {
        "phone_number": currentCallBase.params.caller_id_number,
        "name": currentCallBase.params.caller_id_name,
        "id" : currentCallBase.callID
    };

    var element = angular.element($('#incomingCall'));
    var controller = element.controller();
    var scopeVar = element.scope();
    console.log(scopeVar);
    console.log(data);
    angularCallService.handleIncomingCall(data);
}

function onCallDialog(incomingData) {
    if(__env.enableDebug) console.log("Entering onCallDialog");
    if(__env.enableDebug) console.log(currentCallBase);

    angularCallService.onCallAdded();
}

function onCallDialogDismiss(incomingData) {
    if(__env.enableDebug) console.log("Entering onCallDialogDismiss");

    try {
        var element = angular.element($('#onCallContainer'));
        var controller = element.controller();
        var scopeVar = element.scope();

        angularCallService.callDismissed();

    } catch(ex) {
    }
}

function on3WayCall(data) {
    if(__env.enableDebug) console.log("Entering on3WayCall");

    try {
        var element = angular.element($('#onCallContainer'));
        var controller = element.controller();
        var scopeVar = element.scope();

        if(!scopeVar.$$phase) {
            // scopeVar.$apply(function(){
            //     scopeVar.calls.outgoing3WayCall(data);
            // });
        }

    } catch(ex) {
    }
}

function onCall3WayMergeDismiss(data) {
    if(__env.enableDebug) console.log("Entering onCall3WayMergeDismiss");

    try {
        var element = angular.element($('#onCallContainer'));
        var controller = element.controller();
        var scopeVar = element.scope();

        // scopeVar.$apply(function(){
        //     scopeVar.calls.onCall3WayMergeDismiss(data);
        // });

    } catch(ex) {

    }
}



function answerCallBase() {
    //alert("answerCallBase");
    try {
        if(currentCallBase !== null) {
            currentCallBase.answer({
                useVideo: true,
                useStereo: true
            });
        }
    } catch(ex) {
    }
}; // answerCallBase

function onWSCloseBase(verto, success) {
    //console.log('onWSCloseBase', success);
}; // onWSCloseBase

// Receives call state messages from FreeSWITCH.
function onDialogStateBase(d) {
    if(__env.enableDebug) console.log("Call state =============================> " + d.state.name + "; " + d.verto.options.tag);
    //console.log("onDialogStateBase, d = ");
    //console.log(d);

    if(!currentCallBase) {
        currentCallBase = d;
    }

    var callIsListed = false;
    if(typeof callListBase === 'undefined') {
        if(__env.enableDebug) console.log("Initializing callListBase");
        callListBase = Object.create(null);
    }


    for(var k in callListBase) {
        if(d.callID === k) {
            callIsListed = true;
            callListBase[k] = d;
        }
    }

    if(!callIsListed) {
        //console.log("=======================>  Adding callID " + d.callID + " to list");
        callListBase[d.callID] = d;
    }


    switch (d.state.name) {

    case "trying":
        on3WayCall(d);
        break;
    case "answering":
        if(__env.enableDebug) console.log("answering");
        break;
    case "active":
        if(__env.enableDebug) console.log("active");
        currentCallBase = d;
        if(d.lastState.name === "held") {
            break;
        }
        if(__env.enableDebug) console.log(d);
        data = {
            "phone_number": d.params.caller_id_number,
            "name": d.params.caller_id_number,
            "id" : "id"
        };
        if(!decliningCall) {
            onCallDialog();
        }

        if(callListBase) {
            var keys = Object.keys(callListBase);
            if(keys.length == 1) {
                callListBase[keys[0]].verto.options.tag = tag();
            }
        }
        break;
    case "hangup":
        if(__env.enableDebug) console.log("Call ended with cause: " + d.cause);
        if(__env.enableDebug) console.log(d);
        onCallDialogDismiss(d);
        decliningCall = false;
        break;
    case "ringing":
        // debugger;
        if(__env.enableDebug) console.log('Incoming call is ringing');
        if(__env.enableDebug) console.log(d);
        currentCallBase = d;

        if(__env.enableDebug) console.log(Object.keys(callListBase).length + " calls in list");
        if(Object.keys(callListBase).length >= 3) {
            d.transfer("*99" + d.params.callee_id_number);
            break;
        }
        console.log(currentCallBase.params);
        if (currentCallBase.params.remote_caller_id_number==='0000000000') {
            //decliningCall = true;
            //          answerCallBase();
        } else {
            //          answerDialog();
        }
        answerDialog();

        //
        break;
    case "offering":
        if(__env.enableDebug) console.log('offering');
        break;
    case "destroy":
        delete callListBase[d.callID];
        currentCallBase = null;
        break;
    }

    //  console.log("++++++++++    Call array:   ++++++++++" );
    //  console.log(callListBase);
}; // onDialogStateBase

/*
 * Setting up and subscribing to the live array.
 */
var vertoConfBase, liveArrayBase;
var initLiveArray = function(verto, dialog, data) {
    // Set up addtional configuration specific to the call.
    vertoConfBase = new $.verto.conf(verto, {
        dialog: dialog,
        hasVid: true,
        laData: data.pvtData,
        // For subscribing to published chat messages.
        chatCallback: function(verto, eventObj) {
            var from = eventObj.data.fromDisplay || eventObj.data.from || 'Unknown';
            var message = eventObj.data.message || '';
        }
    }); // initLiveArray

    var configBase = {
        subParams: {
            callID: dialog ? dialog.callID : null
        }
    }; // configBase

    // Set up the live array, using the live array data received from FreeSWITCH.
    liveArrayBase = new $.verto.liveArray(verto, data.pvtData.laChannel, data.pvtData.laName, configBase);
    // Subscribe to live array changes.
    liveArrayBase.onChange = function(liveArrayObj, args) {
        //console.log("Call UUID is: " + args.key);
        //console.log("Call data is: ", args.data);
        try {
            switch (args.action) {

                // Initial list of existing conference users.
            case "bootObj":
                //console.log("bootObj");
                //console.log(liveArrayObj);
                //console.log("Call UUID is: " + args.key);
                // console.log("Call data is: ", args.data);
                break;

                // New user joined conference.
            case "add":
                // console.log("User joined");
                // console.log(liveArrayObj);
                // console.log("Call UUID is: " + args.key);
                // console.log("Call data is: ", args.data);
                break;

                // User left conference.
            case "del":

                // Erik:  Handle the hangup of a conference leg here.


                //console.log("User left");
                //console.log(liveArrayObj);
                //console.log("Call UUID is: " + args.key);
                if(__env.enableDebug) console.log("Call data is: ", args);


                var data = {callID: args.key};
                //bkg onCall3WayMergeDismiss(data);

                break;

                // Existing user's state changed (mute/unmute, talking, floor, etc)
            case "modify":
                break;

            }
        } catch (err) {
            console.error("ERROR: " + err);
        }
    }; // liveArrayBase.onChange

    // Called if the live array throws an error.
    liveArrayBase.onErr = function (obj, args) {
        console.error("Error: ", obj, args);
    }; // liveArrayBase.onErr
}; // initLiveArray
