import { HttpClient, json } from 'aurelia-fetch-client';
import { Router } from "aurelia-router";
import { inject } from 'aurelia-framework';

@inject(HttpClient, Router)
export class AddHandyman {
  constructor(HttpClient,Router) {
    this.httpClient = HttpClient;
    this.router = Router;
    this.handyman = {
      id: 0,
      name: "",
      color: "",
      backgroundColor: "",
      email: "",
      password: "",
      isEmployee: true,
      areas: [],
      businesses: [],
      categories: []
    }
  }

  attached() {
    this.getMetaData();
  }

  getMetaData() {
    this.metadata = JSON.parse(sessionStorage.getItem('metadata'));
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  changeBG() {
    $('#handymanNameExample').css({ backgroundColor: this.handyman.backgroundColor });
  }

  changeColor() {
    $('#handymanNameExample').css({ color: this.handyman.color });
  }

  updateMetaData() {
    this.httpClient.fetch('metadata/get', {
      method: 'post',
      body: null
    })
      .then(response => response.json())
      .then(res => {
        sessionStorage.setItem('metadata', json(res));
        this.router.navigateToRoute('handymen');
      })
      .catch(() => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  AddHandyman() {
    this.httpClient.fetch('handyman/Create', {
      method: 'post',
      body: json(this.handyman)
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1 && res.Save == true) {
          swal("הנתונים נשמרו בהצלחה", "", "success", { button: false, timer: 3000 });
          this.updateMetaData();
        }
        else if (res.state == 0)
          swal(res.error[0].title, res.error[0].note, "warning");
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

}