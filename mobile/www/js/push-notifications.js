/**
 * Created by Oleksiy on 4/20/2016.
 */
//Establish connection with ORTC server and subscribe the channel entered in the input text box on the HTML interface.

function subscribe()
{
    if(window.plugins && window.plugins.OrtcPushPlugin){
        var OrtcPushPlugin = window.plugins.OrtcPushPlugin;
        OrtcPushPlugin.log("Connecting");

        OrtcPushPlugin.connect({'appkey':'AIzaSyCiPiVCqnDRUn-ShfZng09z6PYaeJnufiI', 'token':'myToken', 'metadata':'myMetadata', 'url':'https://ortc-developers.realtime.co/server/ssl/2.1/','projectId':'602455482954'}, function (){
            OrtcPushPlugin.log("Connected: ");
            var channel = document.getElementById('channel');
            OrtcPushPlugin.log("Trying to subscribe: " + channel.value);
            OrtcPushPlugin.subscribe({'channel':channel.value}, function (){
                //var subcribed = document.getElementById('subscribed');
                //subcribed.innerHTML = "subscribed: " + channel.value;
                alert("subscribed: " + channel.value);
                OrtcPushPlugin.log("subscribed: " + channel.value);
                //OrtcPushPlugin.disconnect();
            });
        });
    }
};

//Catch the push-notification event when a new notification is received (or tapped by the user)
//Shows the extra property of push notification payload (can be customized using the Realtime Custom Push REST endpoint)

document.addEventListener("push-notification",
    function(notification)
    {
        window.plugins.OrtcPushPlugin.log("Push-Received  channel: " + notification.channel + " payload: " + notification.payload);
        /*
        var payload = document.getElementById('payload');
        payload.innerHTML = "payload: " + notification.payload.name;
        payload.value = "payload: " + notification.payload.name;
        */
        alert("payload: " + notification.payload.name);
    }, false);