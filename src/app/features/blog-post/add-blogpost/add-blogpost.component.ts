import { Component, OnDestroy } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { Router } from '@angular/router';
import { BlogPostService } from '../services/blog-post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnDestroy {
  model: AddBlogPost;
  createBlogPostSubscription?: Subscription;

  constructor(private blogPostService: BlogPostService, private router: Router) {
    this.model = {
      title: '',
      shortDescription: '',
      urlHandle: '',
      content: '',
      featuredImageUrl: '',
      author: '',
      isVisible: true,
      publishedDate: new Date()
    }
  }

  onFormSubmit(): void {
    this.createBlogPostSubscription = this.blogPostService.createBlogPost(this.model)
    .subscribe({
      next: (response) => {
        this.router.navigateByUrl('/admin/blogposts');
      }
    });
  }

  ngOnDestroy(): void {
    this.createBlogPostSubscription?.unsubscribe();
  }

}
