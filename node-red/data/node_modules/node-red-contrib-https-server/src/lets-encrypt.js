'use strict';

module.exports = function (RED) {
    function NodeRedLetsEncrypt(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.status({ fill: "red", shape: "dot", text: "waiting" });

        var err = 0, hit = 0;

        // Secure function
        var apps = function (req, res) {
            // Simple basic auth checking
            var userpass = Buffer.from((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();
            if (userpass !== node.credentials.username + ':' + node.credentials.password) {
                res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="nope"' });
                res.end('HTTP Error 401 Unauthorized: Access is denied');
                node.warn('HTTP Error 401 Unauthorized: Access is denied');
                node.status({ fill: "orange", shape: "dot", text: "Serving on https port " + config.https + " " + (hit) + "/" + (++err) });
                return;
            }

            node.status({ fill: "green", shape: "dot", text: "Serving on https port " + config.https + " " + (++hit) + "/" + (err) });

            req.on('data', function (chunk) {
                try {
                    node.send({
                        payload: JSON.parse(chunk.toString()),
                        res: res,
                        req: req
                    });
                } catch (e) {
                    node.send({
                        payload: chunk.toString(),
                        res: res,
                        req: req
                    });
                }
            });
        };

        // Create greenlock middleware
        var greenlock = require('greenlock').create({
            // Let's Encrypt v2 is ACME draft 11
            // Note: If at first you don't succeed, stop and switch to staging
            // server: 'https://acme-v02.api.letsencrypt.org/directory'
            server: config.staging !== true ? 'https://acme-v02.api.letsencrypt.org/directory' : 'https://acme-staging-v02.api.letsencrypt.org/directory',
            store: require('greenlock-store-fs'),
            version: 'draft-11',
            // You MUST have write access to save certs
            configDir: config.store,

            // The previous 'simple' example set these values statically,
            // but this example uses approveDomains() to set them dynamically
            email: node.credentials.email,
            agreeTos: true,
            // Get notified of important updates and help me make greenlock better
            communityMember: true,
            securityUpdates: true,
            debug: config.debug
        });

        // Log data
        config.staging !== true ? node.log('Using production api') : node.log('Using staging api');

        // http listener
        if (config.http) {
            var listenerHttp = require('http').createServer(greenlock.middleware(require('redirect-https')())).listen(config.http, function () {
                node.log("Handling ACME challenges and redirecting to https on plain port " + config.http);
            });
        }

        // https listener
        if (config.https) {
            var listenerHttps = require('spdy').createServer(greenlock.tlsOptions, apps).listen(config.https, function () {
                node.log("Serving on https port " + config.https);
                node.status({ fill: "green", shape: "dot", text: "Serving on https port " + config.https });
            });
        }

        // Handle node close
        this.on('close', function () {
            if (config.http) {
                node.log("Let's encrypt server http down");
                listenerHttp.close();
            }
            if (config.https) {
                node.log("Let's encrypt server https down");
                listenerHttps.close();
            }
        });
    }

    // Register this node
    RED.nodes.registerType("lets-encrypt", NodeRedLetsEncrypt, {
        credentials: {
            email: { type: "text" },
            username: { type: "text" },
            password: { type: "password" }
        }
    });
}