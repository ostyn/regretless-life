import {inject} from 'aurelia-framework';
import {SkyScannerApi} from 'SkyScannerApi.js';
@inject(SkyScannerApi)
export class Welcome {
    heading = 'Welcome to the Aurelia Navigation App!';
    firstName = 'John';
    lastName = 'Doe';
    previousValue = this.fullName;
    longitude = 0;
    latitude = 0;
    zoom = 0;
    counter = 0;
    borderColor = 'red';
    postsClass = "posts";
    sidebarOpen = 0;
    mymarkdowntext = `# Header This is rendered 
  \n**markdown**. 
  * test
  * test 2
  ![Alt text](./src/images/Untitled.png)`;
    lorem = `Lorem ipsum dolor sit amet, no copiosae reprehendunt mea. His nobis volumus electram te, in vis odio posse invenire. Et qui wisi iudico tacimates, has ei iriure malorum. Ne amet aliquando duo. Sea no ignota appellantur delicatissimi, at primis nostrum blandit has. Altera primis propriae ius cu, adhuc dicta ut mea, duo cibo civibus necessitatibus no. 
					Ut habemus elaboraret eam, sumo hendrerit neglegentur at vim. Soluta vidisse perfecto te mea. Sea error pertinax complectitur ea, nam putent voluptaria te, id mea nulla novum concludaturque. Quo unum case deserunt ut, nec rebum dicit ei. Usu an dicant torquatos disputationi, at sit illud iusto. 
					Quo assentior persecuti ea, vis cu nobis soluta dolorem, ius munere honestatis ei. Pri munere mnesarchum an. Nec reque aeterno aperiam an, vim aliquam rationibus ne. Dicat nulla periculis ut has, quis simul prompta per et. Eos ne natum offendit periculis, ad impetus prompta est. Cum cetero vocibus id, vim hinc autem vulputate id, erat aliquid qui et.
					Sit eu suas liber, ad sed summo aliquid. Cum et stet salutatus gloriatur, his at graecis pertinacia. Et homero admodum legendos duo. Nec id laudem accumsan mediocritatem, ne mentitum electram cum. Hinc nusquam ea pri, at vis dicta incorrupte, et pri elitr oblique dignissim.
					No has dolorum ancillae. Elitr impetus definiebas eam ea, vix veri nostrum urbanitas no. Ut nam agam molestiae, iuvaret quaeque epicuri duo ad, an quando eruditi vim. Ei solet splendide adolescens per, mei et dicam labitur, dictas menandri iracundia an duo. Malis voluptaria et has, id eos feugiat denique quaerendum. Te sumo vidisse qui, malis simul vel te.`;
    activate() {
        return this.skyApi.getAllPosts();
    }
    constructor(skyApi) {
        this.skyApi = skyApi;
    }

    canDeactivate() {
        if (this.fullName !== this.previousValue) {
            return confirm('Are you sure you want to leave?');
        }
    }
    setLocation(long, lat) {
        setInterval(() => {
            this.counter++
            //if(this.counter%100 === 0)
            this.zoom = (this.zoom + .2) % 12;
            this.longitude += .01;

        }, 10);
    }
    toggleSidebar() {
        if (this.sidebarOpen) {
            this.postsClass = "postsFull";
        }
        else {
            this.postsClass = "posts";
        }
        this.sidebarOpen = !this.sidebarOpen;
    }
}
