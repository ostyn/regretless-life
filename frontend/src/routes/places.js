import {inject} from 'aurelia-framework';
import {BlogDao} from 'dao/BlogDao';
import {FormatLib} from 'util/FormatLib';
import {VectorMap} from 'widgets/vector-map';
@inject(BlogDao, FormatLib)
export class Places {
    show = {};
    places = []
    values = undefined
    constructor(blogDao, formatLib) {
        this.blogDao = blogDao;
        this.formatLib = formatLib;
    }
    activate() {
        this.blogDao.getAllPostsByLocation()
            .then((years) =>
                {
                    this.years = years;
                    this.values = {};
                    for(var year of this.years) {
                        for(var location of year.locations) {
                            this.values[location["countryCode"]] = 1;
                        }
                    }
                }
            )
    }
    toggleList = (name)=>{
        this.show[name] = !this.show[name];
    }
}