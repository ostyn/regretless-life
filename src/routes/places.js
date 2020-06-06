import {inject} from 'aurelia-framework';
import {BlogDao} from 'dao/BlogDao';
import {FormatLib} from 'util/FormatLib';
import 'flag-icon-css/css/flag-icon.min.css';

@inject(BlogDao, FormatLib)
export class Places {
    show = {};
    values = undefined;
    years = new Map();
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
                    for(var year of years.values()) {
                        for(var countryCode of year.keys()) {
                            this.values[countryCode] = 1;
                        }
                    }
                }
            )
    }
    toggleList = (name)=>{
        this.show[name] = !this.show[name];
    }
    getCssFlag(countryCode){
        if(countryCode)
            return `flag-icon flag-icon-${countryCode.toLowerCase()}`;
        else
            return "";
    }
}