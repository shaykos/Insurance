import 'popper.js';
import moment from 'moment';
import 'moment/locale/he';
import 'jquery';
import 'bootstrap-material-design';
import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import swal from 'sweetalert';
import { Redirect } from 'aurelia-router';

@inject(HttpClient, EventAggregator)
export class App {
  constructor(HttpClient, EventAggregator) {
    moment.locale('he');
    this.httpClient = HttpClient;
    this.ea = EventAggregator;
  }

  applyNotification() {
    if (!Notification) {
      alert('Desktop notifications not available in your browser. Try Chromium.');
      return;
    }

    if (Notification.permission !== "granted") {
      Notification.requestPermission(function (status) {
        console.log('status', status);
      });
    }
  }

  attached() {
    tinymce.init({
      selector: '.tinyMCE',
      rtl_ui: true,
      language: 'he_IL',
      directionality: 'rtl',
      plugins: [
        "advlist autolink lists link image charmap print preview hr anchor pagebreak",
        "searchreplace wordcount visualblocks visualchars code fullscreen",
        "insertdatetime media nonbreaking save table contextmenu directionality",
        "emoticons template paste textcolor colorpicker textpattern"
      ],
      toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
      toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help',
    });
    this.applyNotification();
    $(document).ready(function () {
      $('body').bootstrapMaterialDesign();
    });

    // $(document).on('click','.picker-input',function(){
    //   $('#'+$(this).attr('data-id')).slideToggle();
    // });
  }

  configureRouter(config, router) {
    config.title = 'אב הבית';
    config.addAuthorizeStep(AuthorizeStep);

    const handleUnknownRoutes = () => {
      return { route: 'not-found', redirect: '404' };
    }

    config.mapUnknownRoutes(handleUnknownRoutes);

    config.map([
      { route: '', redirect: 'login' },
      { route: 'login', name: 'login', moduleId: './admin/login/login', title: 'התחבר' },
      { route: 'dashboard', name: 'dashboard', moduleId: './admin/dashboard/dashboard', title: 'ראשי', settings: { auth: true } },
      { route: 'orders', name: 'orders', moduleId: './admin/orders/orders', title: 'קריאות', settings: { auth: true } },
      { route: 'order/new', name: 'add-order', moduleId: './admin/add-order/add-order', title: 'יצירת קריאה חדשה', settings: { auth: true } },
      { route: 'order/edit/:id', name: 'edit-order', moduleId: './admin/edit-order/edit-order', title: 'עדכון קריאה', settings: { auth: true } },
      { route: 'order/details/:id', name: 'order-details', moduleId: './admin/order-details/order-details', title: 'פרטי קריאה', settings: { auth: true } },
      { route: 'calendar', name: 'calendar', moduleId: './admin/calendar/calendar', title: 'יומנים', settings: { auth: true } },
      { route: 'companies', name: 'companies', moduleId: './admin/companies/companies', title: 'חברות ביטוח', settings: { auth: true, forRole: 1 } },
      { route: 'company/new', name: 'add-company', moduleId: './admin/add-company/add-company', title: 'הוספת חברת ביטוח', settings: { auth: true, forRole: 1 } },
      { route: 'handymen', name: 'handymen', moduleId: './admin/handymen/handymen', title: 'בעלי מקצוע', settings: { auth: true, forRole: 1 } },
      { route: 'handyman/new', name: 'add-handyman', moduleId: './admin/add-handyman/add-handyman', title: 'הוספת בעל מקצוע', settings: { auth: true, forRole: 1 } },
      { route: 'handyman/edit/:id', name: 'edit-handyman', moduleId: './admin/edit-handyman/edit-handyman', title: 'עדכון פרטי בעל מקצוע', settings: { auth: true, forRole: 1 } },
      { route: 'categories', name: 'categories', moduleId: './admin/categories/categories', title: 'ניהול קטגוריות ותקלות', settings: { auth: true, forRole: 1 } },
      { route: '404', name: '404', moduleId: './admin/not-found/not-found', title: '404' }
    ]);

    this.router = router;
  }
}

class AuthorizeStep {
  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
      var isLoggedIn = (sessionStorage.getItem('user') != null);
      if (!isLoggedIn) {
        return next.cancel(new Redirect('login'));
      }
    }

    if(navigationInstruction.getAllInstructions().some(i => i.config.settings.forRole)){
      let user = JSON.parse(sessionStorage.getItem('user'));
      if(navigationInstruction.config.settings.forRole != user.roleId)
      return next.cancel(new Redirect('dashboard'));
    }

    return next();
  }
}

