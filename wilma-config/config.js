#!/usr/bin/env node
const config = {};

// Used only if https is disabled
config.pep_port = 3003;

// Set this var to undefined if you don't want the server to listen on HTTPS
config.https = {
  enabled: true,
  cert_file: './certs/cert.crt',
  key_file: './certs/key.key',
  port: 443
};

config.idm = {
  host: 'localhost',
  port: 3000,
  ssl: false
};

config.app = {
  host: 'localhost',
  port: '3002',
  ssl: false // Use true if the app server listens in https
};

config.organizations = {
  enabled: false,
  header: 'fiware-service'
};

// Credentials obtained when registering PEP Proxy in app_id in Account Portal
config.pep = {
  app_id: 'd6ef7f8c-7c70-4b59-8e3d-121bcd316d47',
  username: 'pep_proxy_f196e6c7-4584-4918-88d3-d5ea0aeac36c',
  password: 'pep_proxy_114a7dfc-f694-4800-bd42-a350600e629c',
  token: {
    secret: '' // Secret must be configured in order validate a jwt
  },
  trusted_apps: []
};

// in seconds
config.cache_time = 300;

// if enabled PEP checks permissions in two ways:
//  - With IdM: only allow basic authorization
//  - With Authzforce: allow basic and advanced authorization.
//    For advanced authorization, you can use custom policy checks by including programatic scripts
//    in policies folder. An script template is included there
//
//  This is only compatible with oauth2 tokens engine

config.authorization = {
  enabled: true,
  pdp: 'idm', // idm|iShare|xacml|authzforce
  header: undefined, // NGSILD-Tenant|fiware-service
  location: {
    protocol: 'http',
    host: 'localhost',
    port: 8080,
    path: ''
  },
  azf: {
    custom_policy: undefined // use undefined to default policy checks (HTTP verb + path).
  }
};

config.cors = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
};

config.cluster = {
  type: 'manual', // manual|allCPUCores
  number: 1
};

// list of paths that will not check authentication/authorization
// example: ['/public/*', '/static/css/']
config.public_paths = [];

config.magic_key = undefined;
config.auth_for_nginx = false;

config.error_template = `{
    "type": "{{type}}",
    "title": "{{title}}",
    "detail": "{{message}}"
  }`;
config.error_content_type = 'application/json';

module.exports = config;
