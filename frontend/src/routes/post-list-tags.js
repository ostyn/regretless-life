import {PostListBase} from 'routes/post-list-base';
export class PostListTags extends PostListBase {
    showTagLinks = true;
    widgetCssRule = "tagsFeedPostWidget";
    previewLength = 0;
    showTagLinks = false;
    showCommentsLink = false;
    showAuthorDate = false;
    expandPostTitle = true;
    num = 10;
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
    nextLinkParams(){
        let params = super.nextLinkParams();
        params["tag"] = this.tag;
        return params;
    }
    prevLinkParams(){
        let params = super.prevLinkParams();
        params["tag"] = this.tag;
        return params;
    }
}