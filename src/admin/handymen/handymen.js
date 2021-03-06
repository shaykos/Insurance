import { HttpClient, json } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';

@inject(HttpClient, EventAggregator)
export class Handymen {
  constructor(HttpClient, EventAggregator) {
    this.httpClient = HttpClient;
    this.ea = EventAggregator;
    this.showSearch = false;
    this.searchHandyman = '';
    this.handymen = [];

  }

  attached() {
    this.getHandymen();
    this.getMetaData();
  }

  getMetaData() {
    this.metadata = JSON.parse(sessionStorage.getItem('metadata'));
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  getHandymen() {
    this.httpClient.fetch('handyman/Get', {
      method: 'post',
      body: json(this.company)
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1) {
          this.handymen = res.Handymen;
        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  updateMetaData() {
    this.httpClient.fetch('metadata/get', {
      method: 'post',
      body: null
    })
      .then(response => response.json())
      .then(res => {
        sessionStorage.setItem('metadata', json(res));
        this.getHandymen();
      })
      .catch(() => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  deleteHandyman(id) {
    this.httpClient.fetch('handyman/Delete', {
      method: 'post',
      body: json({id})
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1 && res.Deleted > 0) {
          swal("בעל המקצוע הוסר מהמאגר", "", "success", { button: false, timer: 3000 });
          this.updateMetaData();
        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });

  }


}