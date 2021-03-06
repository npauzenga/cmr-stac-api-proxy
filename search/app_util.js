const _ = require('lodash');
const fs = require('fs');
const util = require('util');
const buildUrl = require('build-url');

const firstIfArray = (v) => {
  if (_.isArray(v) && v.length === 1) {
    return _.first(v);
  }
  return v;
};

const extractParam = (queryStringParams, param, defaultVal = null) => {
  if (queryStringParams && _.has(queryStringParams, param)) {
    return firstIfArray(queryStringParams[param]);
  }
  return defaultVal;
};

const generateAppUrl = (event, path, queryParams = null) => {
  const host = event.headers.Host;
  const protocol = event.headers['X-Forwarded-Proto'];
  let stageUrlPart = '';
  if (host.includes('amazonaws.com')) {
    // Only include stage when hitting a AWS generated URL.
    stageUrlPart = `${event.requestContext.stage}`;
  }
  return buildUrl(`${protocol}://${host}`, {
    path: `${stageUrlPart}${path}`,
    queryParams
  });
};

const generateSelfUrl = (event) => generateAppUrl(event, event.path, event.queryStringParameters);

const createLink = (rel, href, title, type = 'application/json') => ({
  href, rel, type, title
});

module.exports = {
  firstIfArray,
  extractParam,
  generateAppUrl,
  generateSelfUrl,
  wfs: {
    createLink
  },
  fsAsync: {
    readFile: util.promisify(fs.readFile)
  }
};
