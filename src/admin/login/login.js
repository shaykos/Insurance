import { Router } from "aurelia-router";
import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import swal from 'sweetalert';

@inject(Router, HttpClient)
export class Login {
  constructor(Router, HttpClient) {
    this.message = 'Hello world';
    this.router = Router;
    this.httpClient = HttpClient;
    this.user = {
      userName: '',
      password: ''
    }
  }

  attached() {
    if (sessionStorage.getItem('user') != null) {
      this.router.navigateToRoute('dashboard');
    }
  }

  login() {
    this.httpClient.fetch('user/login', {
      method: 'post',
      body: json(this.user)
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1) {
          this.user = res.UserDetails[0];
          swal("התחברת בהצלחה", "מיד תעבור לדף הבא", "success", { button: false});
          setTimeout(() => {
            sessionStorage.setItem('user', JSON.stringify(this.user));
            this.router.navigateToRoute('dashboard');
            swal.close();
          }, 1000 * 1);
        }
        else if (res.state == 0)
          swal(res.error[0].title, res.error[0].note, "warning");
      })
      .catch(res => {
        if (res.state == 0)
          wal(res.error[0].title, res.error[0].note, "warning");
      });
  }
}
