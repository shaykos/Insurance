import { HttpClient, json } from 'aurelia-fetch-client';
import { Router } from "aurelia-router";
import { inject } from 'aurelia-framework';

@inject(HttpClient, Router)
export class EditHandyman {
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

  activate(params) {
    this.handyman.id = params.id;
    this.getMetaData();
  }

  attached() {
    this.getHandymen();
  }

  getHandymen() {
    this.httpClient.fetch('handyman/Get', {
      method: 'post',
      body: json(this.handyman)
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1) {
          this.handyman = res.Handyman[0];
          this.changeBG();
          this.changeColor();
          this.handyman.areas= [];
          this.handyman.businesses= [];
          this.handyman.categories= [];
          
          res.Areas.map(area=>{
            this.handyman.areas.push(area.id);
          });
          res.Businesses.map(business=>{
            this.handyman.businesses.push(business.id);
          });
          res.Categories.map(category=>{
            this.handyman.categories.push(category.id);
          });
        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
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

  EditHandyman() {
    this.httpClient.fetch('handyman/Update', {
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