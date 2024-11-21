import axios from "axios";

export default class Service {
  constructor() {
    this.url = "https://localhost:7100/api/v1/";
    axios.defaults.timeout = 5000;
  }

  getBoughtLots(buyerId, params) {
    return axios.get(this.url + "Buyer/GetBoughtLots/" + buyerId, { params: params });
  }

  getSoldLots(sellerId, params) {
    return axios.get(this.url + "Seller/GetSoldLots/" + sellerId, { params: params });
  }

  getUnpurchasedLots(sellerId, params) {
    return axios.get(this.url + "Seller/GetUnpurchasedLots/" + sellerId, { params: params });
  }

  getWithdrawnLots(sellerId, params) {
    return axios.get(this.url + "Seller/GetWithdrawnLots/" + sellerId, { params: params });
  }
}
