import { bindable, inject } from 'aurelia-framework';
import { vectorMap } from 'jvectormap';

@inject(Element)
export class VectorMap {
  @bindable values = {};
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