export class ClassColorValueConverter {
  toView(value) {
    switch (value) {
      case 10: return 'badge-info';
      case 40: return 'badge-warning';
      case 50: return 'badge-success';
      default: return '';
    }
  }

  fromView(value) {

  }
}

