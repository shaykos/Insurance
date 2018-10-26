import { Router } from "aurelia-router";
import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import swal from 'sweetalert';

@inject(Router, HttpClient)
export class OrderDetails {     
  constructor(Router, HttpClient) {
    this.message = 'Hello world';
    this.router = Router;
    this.httpClient = HttpClient;
  }
  
  activate(params) {
    this.message = params.id;
  }
}
