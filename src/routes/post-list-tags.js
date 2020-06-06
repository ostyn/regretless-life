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
        return this.blogDao.getNTaggedPosts(params.tag, this.num)
            .then((postsData) => {
                if(postsData) {
                    this.posts = postsData;
                }
            });
    }
    loadMore() {
        if(this.posts && this.posts.length > 1)
            return this.blogDao.getNTaggedPosts(this.tag, this.num, this.posts[this.posts.length-1].date);
        else
            return Promise.resolve([]);
    }
}