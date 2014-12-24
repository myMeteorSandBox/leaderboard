

Meteor.startup(function(){
    Players.find().observe(
        {
            'changed': function (oldDocument,newDocument) {
                console.log("player changed!!");
                Meteor.call("sendAppleNotifications");
            }
        }
    );

});

(function(){
    "use strict";
    var apn = Meteor.npmRequire("apn"),
        path = Npm.require('path'),
        apnOptions = Meteor.settings.apnOptions || {},
        alertSound = apnOptions.sound || "alert.aiff",
        apnConnection;

    // default apn connection options
    apnOptions = _.extend({
        cert: Assets.getText("cert.pem"), //Meteor独自 private/下のcert.pem
        key: Assets.getText("key.pem"),   //Meteor独自 private/下のkey.pem
        production:false
    }, apnOptions);
    apnConnection = new apn.Connection(apnOptions);


    var pushIds = ["0ccf880dfda2214560d1c3d3f0df67db11605fc27df1b1500fe07d25aad60da7"];
    var url = "testURL";
    var alertMessage = "alert";

    Meteor.methods({
        'sendAppleNotifications': function() {
            console.log("run sendAppleNotifications");
            var note = new apn.Notification();

            // expires 1 hour from now
            note.expiry = Math.floor(Date.now() / 1000) + 3600;
            note.sound = alertSound;
            note.alert = alertMessage;
            note.payload = {'url': url};
            note.badge=10;

            _.each(pushIds, function (token) {
                var device = new apn.Device(token);
                apnConnection.pushNotification(note, device);
                console.log("send notification!!!");
            });

            return {success: 'ok'}
        }
    });

})();
