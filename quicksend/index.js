// replace this with the credentials of the Lync or Skype for Business account
// that will be used to send the Instant Message.
var skype_username = "your@emailaddress.com";
var skype_password = "password123";
// this is the recipient to whom we'll send a message
var recipient = "whotosend@themessageto.com";
// and this is the actual message :-)
var the_message = "Hello World!";

function pause(howlongfor){
    log("Pausing for " + howlongfor + "ms");
    var currentTime = new Date().getTime();
    while (currentTime + howlongfor >= new Date().getTime()) {      }
}

function nicetime() {
    var d = new Date();
    return padLeft(d.getHours(), 2) + ":" + padLeft(d.getMinutes(), 2) + ":" + padLeft(d.getSeconds(), 2) + ":" + padLeft(d.getMilliseconds(), 3);
}

function log(texttolog) {    
    $('#logging_box').prepend(nicetime() + ": " + texttolog + "<br>");
}
function padLeft(nr, n, str) { return Array(n - String(nr).length + 1).join(str || '0') + nr; }

$(function () {
    'use strict';

    var Application
    var client;
    var conversation;

    Skype.initialize({
        apiKey: 'SWX-BUILD-SDK',
    }, function (api) {
        Application = api.application;
        client = new Application();
        log("Client Created");
        
        log('Signing in ' + $('#address').text());
        client.signInManager.signIn({
            username: skype_username,skype_password
        }).then(function () {
            log('Logged In Successfully');
          
            //create a new conversation
            log("Creating a new Conversation");
            conversation = client.conversationsManager.createConversation();

            log("Starting chatService");
            conversation.chatService.start().then(function () {
                log('chatService started!');

                conversation.addParticipant("sip:" + recipient).then(function () {
                    log(recipient + "added!");

                    pause(1000);
                    log('Sending message: ' + the_message);
                    conversation.chatService.sendMessage(the_message).then(function () {
                        log('Message sent.');

                        pause(1000);

                        conversation.chatService.stop().then(function () {
                            log('chatService stopped.');
                        }).then(null, function (error) {
                            log('Error Stopping chatService:' + error);
                        });

                        log("Signing Out");
                        client.signInManager.signOut().then(
                            function () {
                                log('Signed out');
                            },
                        function (error) {
                            log('Error signing out:' + error);
                        });

                    }).then(null, function (error) {
                        log('Error Sending Message:' + error);
                    });                   
                    

                }).then(null, function (error) {
                    log('Error adding participant:' + error);
                });

            }).then(null, function (error) {
                log('Error starting chatService' + error);
            });                       
            
        }).then(null, function (error) {
            // if either of the operations above fails, tell the user about the problem
            log("Error signing in: "+error );
        });

    }, function (err) {
        log('some error occurred: ' + err);
    });

});
