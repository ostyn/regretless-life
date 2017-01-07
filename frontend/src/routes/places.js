import {inject} from 'aurelia-framework';
import {BlogDao} from 'dao/BlogDao';
import {FormatLib} from 'util/FormatLib';
import {VectorMap} from 'widgets/vector-map';
@inject(BlogDao, FormatLib)
export class Places {
    places = []
    values = undefined
    constructor(blogDao, formatLib) {
        this.blogDao = blogDao;
        this.formatLib = formatLib;
    }
    activate() {
        this.blogDao.getAllPostsByLocation()
            .then((locations) =>
                {
                    this.places = locations;
                    this.values = {};
                    for(var place of this.places) {
                        this.values[place["_id"]["countryCode"]] = 1;
                    }
                }
            )
    }
}