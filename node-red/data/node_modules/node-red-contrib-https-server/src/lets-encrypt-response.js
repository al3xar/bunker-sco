'use strict';

module.exports = function (RED) {
    function NodeRedHttpsResponse(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.status({ fill: "red", shape: "dot", text: "Waiting" });

        this.on('input', function(msg) {
            node.status({ fill: "green", shape: "dot", text: "Receiving" });
            msg.res.writeHead(200, { 'Content-Type': 'application/json' });
            msg.res.write(JSON.stringify(msg.payload, null, 2));
            msg.res.end();
        });
    }

    // Register this node
    RED.nodes.registerType("https-response", NodeRedHttpsResponse);
}