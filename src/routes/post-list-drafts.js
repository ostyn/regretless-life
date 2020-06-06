import {PostListBase} from 'routes/post-list-base';
export class PostListDraft extends PostListBase {
    getData(){
        return this.blogDao.getNPosts(true, this.num, this.start)
            .then((postsData) => {
                if(postsData) {
                    this.posts = postsData;
                }
            });
    }
    loadMore() {
        return this.blogDao.getNPosts(true, this.num, this.posts[this.posts.length-1].date);
    }
}