class Error {
  constructor(error) {
    this.name = error.name || 'Error';
    this.message = error.message || 'Uncaught exception';
  }
}

module.exports = {
  Error,
};
