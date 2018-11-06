import { HttpClient, json } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import { notify } from '../../services/notification';

@inject(HttpClient)
export class EditOrder {
  base = this;
  constructor(HttpClient) {
    this.httpClient = HttpClient;
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.currentOrder = new Object();
    this.OrderDetails = new Object();
    this.orderNotes = new Object();
    this.continueOrder = {
      toContinue: false,
      categoryId: 1
    }
  }


  activate(params) {
    this.OrderDetails.id = params.id;
    this.getMetaData();

    $(document).on('click', '.removeImage', function () {
      base.removeImage($(this));
      //$(this).parent().remove();
    })
  }

  attached() {
    this.getOrderDetails(this.OrderDetails.id);
    //this.currentOrder.createdBy = JSON.parse(sessionStorage.getItem('user')).id;
  }

  getOrderDetails(id) {
    this.httpClient.fetch('order/get', {
      method: 'post',
      body: json({ id })
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1) {
          this.currentOrder = res.Orders[0];
          if (res.OrderNotes.length > 0) {
            this.orderNotes = res.OrderNotes[0];
            tinymce.get('testResults').setContent(this.orderNotes.results);
            tinymce.get('actions').setContent(this.orderNotes.actions);
            tinymce.get('notes').setContent(this.orderNotes.summary);
          }
          this.orderFiles = res.Files;
          if (this.orderFiles.length > 0) {
            for (let index = 0; index < this.orderFiles.length; index++) {
              this.appendImageToDiv(this.orderFiles[index]);
            }
          }

          if (this.currentOrder.status == 40) {
            this.continueOrder.toContinue = true;
            this.continueOrder.categoryId = this.currentOrder.categoryId;
          }

        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  getMetaData() {
    this.metadata = JSON.parse(sessionStorage.getItem('metadata'));
    console.log(this.metadata);
  }

  updateOrderDetails() {
    this.currentOrder.price = 0.0;
    this.httpClient.fetch('order/update', {
      method: 'post',
      body: json(this.currentOrder)
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1 && res.Updated == 1) {
          swal("העדכון בוצע בהצלחה", "", "success", { button: false, timer: 3000 });
        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  appendImageToDiv(src) {
    var html = `<div class="card col-md-4">
                  <button type="button" class="btn btn-danger bmd-btn-fab bmd-btn-fab-sm removeImage">
                    <i class="material-icons">delete</i>
                  </button>
                  <img class="card-img-top" src="${src}"/>
                </div>`;
    $('#images-upload').append(html);
  }

  showImage(e) {
    let base = this;
    if (e.target.files && e.target.files[0]) {
      for (let i = 0; i < e.target.files.length; i++) {
        var reader = new FileReader();
        reader.onload = function (ev) {
          let n = (base.orderFiles.length > 0) ? base.orderFiles.length : 0;
          let name = `${base.currentOrder.id}_${n + i + 1}`;
          let path = `/uploads/orders/${base.currentOrder.id}/`; //Split(";")[0].Split("/")[1]
          let type = ev.target.result.split(';')[0].split('/')[1];
          let fullPath = `${path}${name}.${type}`;
          base.uploadImage(ev.target.result, name, fullPath);
          base.appendImageToDiv(fullPath);
        }

        reader.readAsDataURL(e.target.files[i]);
      }
      $("#imageUPloader").val("");

    }
  }

  removeImage(elem) {
    let path = elem.next().attr('src');
    this.httpClient.fetch('order/RemoveFile', {
      method: 'post',
      body: json({ orderId: this.currentOrder.id, src: path })
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1 && res.Removed == true) {
          elem.parent().remove();
        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  saveHandymanUpdate() {
    this.httpClient.fetch('order/saveHandymanUpdate', {
      method: 'post',
      body: json(this.currentOrder)
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1 && res.Updated == 1) {
          if (this.continueOrder.toContinue)
            this.addToContinueOrder();
          this.saveOrderNotes();
        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  addToContinueOrder() {
    this.currentOrder.status = 40;
    this.httpClient.fetch('order/UpdateOrderStatus', {
      method: 'post',
      body: json(this.currentOrder)
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1 && res.Updated == 1) {

        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  saveOrderNotes() {
    this.orderNotes.results = tinyMCE.get('testResults').getContent();
    this.orderNotes.actions = tinyMCE.get('actions').getContent();
    this.orderNotes.summary = tinyMCE.get('notes').getContent();
    this.orderNotes.dateCreated = new Date();
    this.orderNotes.orderId = this.currentOrder.id;
    this.httpClient.fetch('order/saveNotes', {
      method: 'post',
      body: json(this.orderNotes)
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1 && res.Inserted == 1) {
          swal("הנתונים נשמרו בהצלחה", "", "success", { button: false, timer: 3000 });
        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  uploadImage(src, name, fullPath) {
    this.httpClient.fetch('order/SaveFiles', {
      method: 'post',
      body: json({ orderId: this.currentOrder.id, src: src, name: name })
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1 && res.Saved == true) {
          this.orderFiles.push(fullPath);
          swal("הנתונים נשמרו בהצלחה", "", "success", { button: false, timer: 3000 });
        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  updateClientAddress() {
    this.httpClient.fetch('client/UpdateClientAddress', {
      method: 'post',
      body: json({
        id: this.currentOrder.clientId,
        orderId:this.currentOrder.id,
        isSameAddress:this.currentOrder.isSameAddress,
        city:this.currentOrder.city,
        street:this.currentOrder.street,
        streetNumber:this.currentOrder.streetNumber,
        appartment:this.currentOrder.appartment,
        entrance:this.currentOrder.entrance
      })
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1 && res.Updated > 1) {
          swal("העדכון בוצע בהצלחה", "", "success", { button: false, timer: 3000 });
        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  setCityCode(){
    this.metadata.Cities.map(city=>{
      if(city.name == this.currentOrder.cityName)
      this.currentOrder.city = city.id;
    })
  }

}
