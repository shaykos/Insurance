import 'fullcalendar';
import 'fullcalendar-scheduler';
import moment from 'moment';
import { HttpClient, json } from 'aurelia-fetch-client';
import { Router } from "aurelia-router";
import { inject } from 'aurelia-framework';

@inject(HttpClient, Router)
export class Calendar {
  constructor(HttpClient, Router) {
    this.events = [];
    this.router = Router;
    this.httpClient = HttpClient;
    this.handymanId = 0;
    this.allHandymen = [];
    this.handymen = [];
    this.eventInfo = {
      id: 0,
      problemName: '',
      address: '',
      businessName: '',
      handymanName: '',
      clientName: '',
      phone: '',
      cellphone: '',
      etaDate: '',
      eta: ''
    };
  }

  attached() {
    this.getHandymen();
    this.setCalendar();
  }

  getHandymen() {
    this.httpClient.fetch('calendar/getHandymen', {
      method: 'post',
      body: json({ handymanId: this.handymanId })
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1) {
          this.allHandymen = res.Handymen;
          setTimeout(() => {
            this.getEvents();
          }, 1000 * 2);
        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  getEvents() {
    this.httpClient.fetch('calendar/get', {
      method: 'post',
      body: json({ handymanId: this.handymanId })
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1) {
          this.events = res.Events;
          this.events.map(ev => {
            ev.start = moment(ev.start);
            ev.end = moment(ev.end);
          });
          console.log(this.events);
          $('#calendar').fullCalendar('removeEvents');
          $('#calendar').fullCalendar('addEventSource', this.events);
        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  setCalendar() {
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listWeek'
      },
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      navLinks: true,
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      isRTL: true,
      locale: 'he',
      timeFormat: 'H(:mm)',
      buttonText: {
        today: 'היום',
        month: 'חודש',
        week: 'שבוע',
        day: 'יום',
        listWeek: 'רשימה שבועית'
      },
      allDayText: 'כל היום',
      businessHours: {
        dow: [0, 1, 2, 3, 4],
        start: '09:00',
        end: '20:00',
      },
      eventClick: (event) => this.eventClick(event)
    });
  }

  eventClick(calEvent) {
    this.httpClient.fetch('order/get', {
      method: 'post',
      body: json({ id: calEvent.id })
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1) {
          this.eventInfo = res.Orders[0];
          $('#fullCalModal').modal();
        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  goToEdit(id) {
    this.router.navigateToRoute('edit-order', { id });
  }

  findHandyman(id) {
    this.handymen = [];
    this.httpClient.fetch('order/getAvaliableHandymen', {
      method: 'post',
      body: json({ id })
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1)
          this.handymen = res.Handymen;
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  setHandyman(id, handymanId) {
    this.httpClient.fetch('order/SetHandymanToOrder', {
      method: 'post',
      body: json({ id, handymanId })
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1) {
          let handyman = this.handymen.find(elem => {
            if (elem.id == handymanId) return elem;
          });
          let title = `${handyman.name} שוייך בהצלחה לקריאה מס' ${id}`;
          swal(title, "", "success", { button: false, timer: 3000 });
          this.getEvents();
          $('#fullCalModal').modal('hide')
        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }
}
