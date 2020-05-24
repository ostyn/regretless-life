import { bindable, inject } from 'aurelia-framework';
import "jvectormap/tests/assets/jquery-jvectormap-world-mill-en.js";
import "jvectormap/jquery-jvectormap.css";

@inject(Element)
export class VectorMap {
  @bindable values = {};
  @bindable clickCallback;
  constructor(el) {
    this.id = el.id;
  }
  attached() {
    $(`#${this.id}`).vectorMap(
      {
        backgroundColor: 'none',
        regionStyle: {
          initial: {
            fill: '#888D91'
          },
          hover: {
            fill: "#A0D1DC"
          }
        },
        series: {
          regions: [{
            scale: {
              '1': '#128da7'
            },
            attribute: 'fill',
            values: this.values
          }]
        },
        onRegionClick: (e, code)=>{
          this.clickCallback(code);
        }
      }
    );
    //Hack of the week. We need to redraw once the Element
    //has been properly sized. 
    setTimeout(() => {
      var $container = $(`#${this.id}`);
      $container.fadeIn().resize();
    }, 100);
  }
}