import moment from 'moment';

export class HtmlDateValueConverter {
  toView(value) {
    return moment(value).format('YYYY-MM-DD');
  }

  fromView(value) {

  }
}

