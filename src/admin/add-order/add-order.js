import { HttpClient, json } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import {notify} from '../../services/notification';

@inject(HttpClient)
export class AddOrder {
  constructor(HttpClient) {
    this.httpClient = HttpClient;
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.currentOrder = {
      clientId: "",
      claimNumber: "",
      policyNumber: "",
      type: 1,
      status: 10,
      name: "",
      deductible: 0,
      isSameAddress: true,
      cityName: "",
      city: 0,
      street: "",
      streetNumber: 1,
      appartment: 0,
      entrance: "",
      phone: "",
      cellPhone: "",
      problemId: 1,
      etaDate: "",
      etaTime: 1,
      businessId: 1,
      note: ""
    }
  }


  attached() {
    this.getMetaData();
    this.currentOrder.createdBy = JSON.parse(sessionStorage.getItem('user')).id;
    //$('#etaDate').dateDropper();
  }

  getMetaData() {
    this.metadata = JSON.parse(sessionStorage.getItem('metadata'));
    console.log(this.metadata);
  }

  createOrder() {
    this.metadata.Cities.map(city => {
      if (city.name == this.currentOrder.cityName)
        this.currentOrder.city = city.id;
    });

    this.httpClient.fetch('order/create', {
      method: 'post',
      body: json(this.currentOrder)
    })
      .then(response => response.json())
      .then(res => {
        if(res.state == 1)
        swal("הזמנה מספר " + res.Orders[0].orderId + " נוצרה בהצלחה", "ניתן לראות את הפרטים בדף ההזמנות", "success");
        notify('title','message');
      })
      .catch(res => { console.log('e', res) })
  }

  getClientDetails() {
    this.httpClient.fetch('client/GetClientDetails', {
      method: 'post',
      body: json({ id: this.currentOrder.clientId })
    })
      .then(response => response.json())
      .then(res => {
        console.log('res', res)
        if (res.state == 1) {
          let client = res.ClientDetails[0];
          this.currentOrder.city = client.cityId;
          this.currentOrder.cityName = client.cityName;
          this.currentOrder.appartment = client.appartment;
          this.currentOrder.cellPhone = client.cellPhone;
          this.currentOrder.entrance = client.entrance;
          this.currentOrder.name = client.name;
          this.currentOrder.phone = client.phone;
          this.currentOrder.street = client.street;
          this.currentOrder.streetNumber = client.streetNumber;
        }
      })
      .catch(res => { console.log('e', res) })
  }

  toggleClientDetails(event) {
    if (!event.target.checked)
      this.clearClientDetails()
    else {
      this.getClientDetails();
    }
  }

  clearClientDetails() {
    this.currentOrder.city = "";
    this.currentOrder.cityName = "";
    this.currentOrder.appartment = "";
    this.currentOrder.cellPhone = "";
    this.currentOrder.entrance = "";
    this.currentOrder.name = "";
    this.currentOrder.phone = "";
    this.currentOrder.street = "";
    this.currentOrder.streetNumber = "";
  }

}
