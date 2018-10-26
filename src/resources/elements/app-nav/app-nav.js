import { bindable } from 'aurelia-framework';
import { Router } from "aurelia-router";
import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';

@inject(Router, HttpClient)
export class AppNav {
  @bindable logo;
  @bindable name;

  constructor(Router, HttpClient) {
    this.router = Router;
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.httpClient = HttpClient;
  }

  valueChanged(newValue, oldValue) {

  }

  logout() {
    this.httpClient.fetch('user/logout', {
      method: 'post',
      body: json({id:this.user.id})
    })
      .then(response => response.json())
      .then(res => {
        console.log('s', res);
        sessionStorage.clear();
        this.router.navigateToRoute('login');
      })
      .catch(res => { console.log('e', res) })
  }

}

