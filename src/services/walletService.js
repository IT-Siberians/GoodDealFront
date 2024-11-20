import axios from "axios";

export default class Service {
  constructor() {
    this.url = "https://localhost:7142/api/v1/Owner/";
    axios.defaults.timeout = 1000;
  }

  getWalletBalance(ownerId) {
    return axios.get(this.url + "GetWalletBalance/" + ownerId);
  }

  getWalletTransactions(ownerId) {
    return axios.get(this.url + "GetWalletTransactions/" + ownerId);
  }

  putMoneyInWallet(request) {
    return axios.post(this.url + "PutMoneyInWallet", request);
  }

  withdrawMoneyFromWallet(request) {
    return axios.post(this.url + "WithdrawMoneyFromWallet", request);
  }
}
