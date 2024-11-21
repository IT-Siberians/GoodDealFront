import axios from "axios";

export default class Service {
  constructor() {
    this.url = "https://localhost:7057/api/v1/";
    axios.defaults.timeout = 5000;
  }

  getTradedLots() {
    return axios.get(this.url + "AuctionLots");
  }

  getTradedLotById(id) {
    return axios.get(this.url + "AuctionLots/" + id);
  }

  createTradedLot(request) {
    return axios.post(this.url + "AuctionLots", request);
  }

  createBid(request) {
    return axios.post(this.url + "Customers/Add bid", request);
  }

  cancelTradedLot(request) {
    return axios.post(this.url + "Sellers/cancel auction lot", request);
  }
}
