const fs = require('fs');
const path = require('path')
const yaml = require('js-yaml');
const Promise = require('bluebird');

const isYAML = (name = '') => {
  return name.substr(name.length - 4) === 'yml';
};

const loadStep = (name = '') => {
  const filename = isYAML(name) ? name : `${name}.yml`;
  const pathToFile = path.join(__dirname, '..', 'steps', filename);
  const load = Promise.promisify(fs.readFile.bind(this, pathToFile, 'utf8'));

  return load()
    .then(yamlString => yaml.load(yamlString));
};

module.exports = {
  isYAML,
  loadStep,
};
