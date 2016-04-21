cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/co.realtime.plugins.CordovaPush/www/OrtcPlugin.js",
        "id": "co.realtime.plugins.CordovaPush.OrtcPushPlugin",
        "pluginId": "co.realtime.plugins.CordovaPush",
        "clobbers": [
            "OrtcPushPlugin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "pluginId": "cordova-plugin-whitelist",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-android-support-v4": "21.0.1",
    "cordova-plugin-googleplayservices": "19.0.3",
    "co.realtime.plugins.CordovaPush": "0.1.12",
    "cordova-plugin-whitelist": "1.2.1"
}
// BOTTOM OF METADATA
});