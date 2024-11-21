import axios from "axios";

export default class Service {
  constructor() {
    this.url = "http://195.133.77.113:9001/api/v1/";
    axios.defaults.timeout = 5000;
  }

  login(request) {
    return axios.post(this.url + "Auth/Login", request);
  }

  logout(request) {
    return axios.post(this.url + "Auth/Logout", request);
  }

  registerUser(request) {
    return axios.post(this.url + "Users", request);
  }

  confirmEmail(request) {
    return axios.post(this.url + "Confirms/ConfirmEmail", request);
  }
}
