import { HttpClient, json } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';

@inject(HttpClient, EventAggregator)
export class Categories {
  constructor(HttpClient, EventAggregator) {
    this.httpClient = HttpClient;
    this.ea = EventAggregator;
    this.showSearch = false;
    this.categorySearch = '';
    this.problemName = '';
    this.selectedCategory = {
      id: 0,
      name: ''
    };
    this.problems = [];
  }

  attached() {
    this.getMetaData();
  }

  getMetaData() {
    this.metadata = JSON.parse(sessionStorage.getItem('metadata'));
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  showEditModal(id) {
    this.metadata.Categories.map(category => {
      if (category.id == id) {
        this.selectedCategory = category;
        this.getProblemsInCategory();
      }
    })
  }

  getProblemsInCategory() {
    this.problems = [];
    this.metadata.Problems.map(problem => {
      if (problem.categoryId == this.selectedCategory.id)
        this.problems.push(problem);
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
        this.getProblemsInCategory();
      })
      .catch(() => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

  addProblem() {
    debugger
    this.httpClient.fetch('category/AddProblem', {
      method: 'post',
      body: json({ name: this.problemName, categoryId: this.selectedCategory.id })
    })
      .then(response => response.json())
      .then(res => {
        swal("הנתונים נשמרו בהצלחה", "", "success", { button: false, timer: 3000 });
        this.updateMetaData();
      })
      .catch(() => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }

}