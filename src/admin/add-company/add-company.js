import { HttpClient, json } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';

@inject(HttpClient)
export class AddCompany {
  constructor(HttpClient) {
    this.httpClient = HttpClient;
    this.company = {
      name: '',
      logo: ''
    };
  }


  showImage(e) {
    let base = this;
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();
      reader.onload = function (ev) {
        base.company.logo = ev.target.result;
        let type = ev.target.result.split(';')[0].split('/')[1];
        $("#addCompanyLogoPreview").attr('src', ev.target.result);
      }

      reader.readAsDataURL(e.target.files[0]);
    }
  }

  AddCompany() {
    this.httpClient.fetch('company/Create', {
      method: 'post',
      body: json(this.company)
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1 && res.Save == 1) {
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

  updateMetaData() {
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

  clearForm() {
    this.company.logo = '';
    this.company.name = '';
    $("#addCompanyLogoPreview").attr('src', '');
    $("#imageUPloader").val('');
  }
}