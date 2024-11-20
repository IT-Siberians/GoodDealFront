import axios from "axios";

export default class Service {
  constructor() {
    this.url = "https://localhost:7117/api/v1/UserProfile/";
    //this.url = "http://195.133.77.113:8080/api/v1/UserProfile/";
    axios.defaults.timeout = 1000;
  }

  getProfileById(id) {
    return axios.get(this.url + id);
  }

  getProfileByUsername(username) {
    return axios.get(this.url + username);
  }

  updateProfile(id, request) {
    return axios.put(this.url + id, request);
  }

  deleteProfile(id) {
    return axios.delete(this.url + id);
  }
}
