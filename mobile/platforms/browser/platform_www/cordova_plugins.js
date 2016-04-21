cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/co.realtime.plugins.CordovaPush/www/OrtcPlugin.js",
        "id": "co.realtime.plugins.CordovaPush.OrtcPushPlugin",
        "pluginId": "co.realtime.plugins.CordovaPush",
        "clobbers": [
            "OrtcPushPlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.1",
    "co.realtime.plugins.CordovaPush": "0.1.12"
}
// BOTTOM OF METADATA
});