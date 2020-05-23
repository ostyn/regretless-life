import * as nprogress from 'nprogress';
import { bindable, noView } from 'aurelia-framework';

@noView()//TODO by removing //@noView(['nprogress/nprogress.css']) I may have broken this
export class LoadingIndicator {
  @bindable loading = false;

  loadingChanged(newValue) {
    if (newValue) {
      nprogress.start();
    } else {
      nprogress.done();
    }
  }
}