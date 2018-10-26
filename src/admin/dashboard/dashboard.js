import { HttpClient, json } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import { LINKS } from '../../services/links';
import { Cities } from '../../services/israel-cities';

@inject(HttpClient)
export class Dashboard {
  constructor(HttpClient) {
    this.message = 'Hello world';
    this.httpClient = HttpClient;
  }

  attached() {
    this.user = JSON.parse(sessionStorage.getItem("user"));
    console.log('LINKS', LINKS);
    console.log('Cities', Cities);

    this.getMetaData()

    // this.httpClient.fetch('https://data.gov.il/api/action/datastore_search?resource_id=12a55b52-19e7-4526-904d-62f7c80f2f28', {
    //   method:'get'
    // })
    //   .then(response => response.json())
    //   .then(res => { 
    //     console.log('s',res)
    //   })
    //   .catch(res => {console.log('e',res)})
  }

  getMetaData() {
    this.httpClient.fetch('metadata/get', {
      method: 'post',
      body: null
    })
      .then(response => response.json())
      .then(res => {
        sessionStorage.setItem('metadata', json(res));
      })
      .catch(() => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

}
