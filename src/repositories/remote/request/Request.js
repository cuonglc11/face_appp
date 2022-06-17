export default class Request {
  params = {};

  addParam(key, value) {
    this.params[key] = value;
  }

  setParam(params) {
    this.params = params;
  }

  getParams() {
    return this.params;
  }
}
