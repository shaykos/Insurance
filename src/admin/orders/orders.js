import { HttpClient, json } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';

@inject(HttpClient, EventAggregator)
export class Orders {
  constructor(HttpClient, EventAggregator) {
    this.httpClient = HttpClient;
    this.ea = EventAggregator;
    this.searchData = {
      id: 0,
      clientId: '',
      claimNumber: '',
      policyNumber: '',
      address:'',
      dateCreated:'',
      type: 0,
      status: 0,
      businessId: 0
    }
    this.handymen = [];
    this.showSearch = false;

  }

  attached() {
    this.searchOrders();
    this.getMetaData();
    //$('#date').dateDropper();
  }

  getMetaData() {
    this.metadata = JSON.parse(sessionStorage.getItem('metadata'));
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  searchOrders() {
    this.httpClient.fetch('order/get', {
      method: 'post',
      body: json(this.searchData)
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1)
          this.orders = res.Orders;
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  findHandyman(id){
    this.handymen = [];
    this.httpClient.fetch('order/getAvaliableHandymen', {
      method: 'post',
      body: json({id})
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1)
          this.handymen = res.Handymen;
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  setHandyman(id, handymanId){
    this.httpClient.fetch('order/SetHandymanToOrder', {
      method: 'post',
      body: json({id, handymanId})
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1){
          let handyman = this.handymen.find(elem => {
            if(elem.id == handymanId) return elem;
          });
          let title = `${handyman.name} שוייך בהצלחה לקריאה מס' ${id}`;
          swal(title,"","success", { button: false, timer:3000});
          this.searchOrders();
        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }
}
