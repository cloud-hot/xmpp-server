var xmpp = require('node-xmpp');

// XEP-0030: Service Discovery
// http://xmpp.org/extensions/xep-0030.html

function S2S() {
}

exports.configure = function(server, config) {
    if(config) {
        console.log(config);
        
        var s2s = new xmpp.Router(config.port, server.options.bindAddress); // We only use 5269 has the default S2S port.
        // Load TLS key material
        if (config.tls) {
            console.log(config.tls);
            s2s.loadCredentials(server.options.domain, config.tls.keyPath, config.tls.certPath);
        }

        // S2S plugged to C2S.
        s2s.register(server.options.domain, function(stanza) {
            server.router.route(stanza); 
        });
        server.s2s = s2s;
        
        server.router.on("externalUser", function(stanza) {
            s2s.send(stanza); // this is for S2S.
        });
    }
}

