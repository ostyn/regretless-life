import {PostListBase} from 'routes/post-list-base';
export class PostListSearch extends PostListBase {
    getData(params){
        this.query = params.query;
        return this.blogDao.findNPosts(params.query, this.start, this.num)
            .then((postsData) => {
                if(postsData) {
                    this.posts = postsData.posts;
                    this.remainingPosts = postsData.remainingPosts;
                }
            });
    }
    nextLinkParams(){
        let params = super.nextLinkParams();
        params["query"] = this.query;
        return params;
    }
    prevLinkParams(){
        let params = super.prevLinkParams();
        params["query"] = this.query;
        return params;
    }
}