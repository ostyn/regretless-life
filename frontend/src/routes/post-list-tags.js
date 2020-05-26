import {PostListBase} from 'routes/post-list-base';
export class PostListTags extends PostListBase {
    showTagLinks = true;
    widgetCssRule = "tagsFeedPostWidget";
    previewLength = 0;
    showTagLinks = false;
    showCommentsLink = false;
    showAuthorDate = false;
    expandPostTitle = true;
    num = 9;
    getData(params){
        this.tag = params.tag;
        return this.blogDao.getNTaggedPosts(params.tag, this.start, this.num)
            .then((postsData) => {
                if(postsData) {
                    this.posts = postsData.posts;
                    this.remainingPosts = postsData.remainingPosts;
                }
            });
    }
    showMore(){
        let params = super.showMore();
        params["tag"] = this.tag;
        return params;
    }
}