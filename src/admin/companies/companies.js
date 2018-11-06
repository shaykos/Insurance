import { HttpClient, json } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';

@inject(HttpClient, EventAggregator)
export class Companies {     
  constructor(HttpClient, EventAggregator) {
    this.httpClient = HttpClient;
    this.ea = EventAggregator;
    this.showSearch = false;
    this.companySearch = '';
    this.selectedCompany = {
      id:0,
      name:'',
      logo:''
    };
  }

  attached() {
    //this.searchOrders();
    this.getMetaData();
  }

  getMetaData() {
    this.metadata = JSON.parse(sessionStorage.getItem('metadata'));
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  showEditModal(id){
    this.metadata.InsuranceCompanies.map(company =>{
      if(company.id == id){
        this.selectedCompany = company;
      }
    })
  }

  showImage(e) {
    let base = this;
    if (e.target.files && e.target.files[0]) {
      for (let i = 0; i < e.target.files.length; i++) {
        var reader = new FileReader();
        reader.onload = function (ev) {
          let name = `${base.selectedCompany.id}`;
          let path = `/uploads/companies/${base.selectedCompany.id}/`; //Split(";")[0].Split("/")[1]
          let type = ev.target.result.split(';')[0].split('/')[1];
          let fullPath = `${path}${name}.${type}`;
          base.uploadImage(ev.target.result, name, fullPath);
          $("#companyLogoPreview").attr('src',fullPath);
        }

        reader.readAsDataURL(e.target.files[i]);
      }
      $("#companyLogoPreview").attr('src','');

    }
  }

  uploadImage(src, name, fullPath) {
    this.httpClient.fetch('company/UpdateCompanyLogo', {
      method: 'post',
      body: json({ companyId: this.selectedCompany.id, src: src, name: name, fullPath:fullPath })
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1 && res.Updated == 1) {
          swal("הנתונים נשמרו בהצלחה", "", "success", { button: false, timer: 3000 });
          this.updateMetaData();
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
        this.getMetaData();
      })
      .catch(() => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }


}