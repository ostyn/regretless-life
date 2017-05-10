import {PostListBase} from 'routes/post-list-base';
export class PostListDraft extends PostListBase {
    getData(){
        return this.blogDao.getNDraftPosts(this.start, this.num)
            .then((postsData) => {
                if(postsData) {
                    this.posts = postsData.posts;
                    this.remainingPosts = postsData.remainingPosts;
                }
            });
    }
}