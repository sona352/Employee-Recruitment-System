import express from 'express';
import Post from '../interfaces/test.interface';
import Controller from "../interfaces/controller.interface";

class PostsController implements Controller {
    public path = '/posts';
    public router = express.Router();

    private posts: Post[] = [
        {
            author: 'Marcin',
            content: 'Dolor sit amet',
            title: 'Lorem Ipsum',
        }
    ];

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes(): void {
        this.router.get(this.path, this.getAllPosts);
        this.router.post(this.path, this.createAPost);
    }

    private getAllPosts = (request: express.Request, response: express.Response) => {
        response.send(this.posts);
    }

    private createAPost = (request: express.Request, response: express.Response) => {
        const post: Post = request.body;
        this.posts.push(post);
        response.send(post);
    }
}

export default PostsController;