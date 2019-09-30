import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  /*******Subject -A special type of Observable which shares a single execution path among observers */
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title, content };
    this.http
      .post<{ name: string }>(
        'https://rxjs-a3a23.firebaseio.com/posts.json',
        postData
      )
      .subscribe(
        responseData => {
          console.log(responseData);
        },
        error => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts() {
    /*******Httpparams to pass the value in the params */
    let searchParams = new HttpParams();
    searchParams = searchParams.append('Name', 'Shubham Mehta');
    searchParams = searchParams.append('Profile', 'Software Engineer');
    return this.http
      .get<{ [key: string]: Post }>(
        'https://rxjs-a3a23.firebaseio.com//posts.json',
        {
          headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
          params: searchParams
        }
      )
      .pipe(
        /**Map -Applies a given project function to each value emitted by the source Observable,
        and emits the resulting values as an Observable */
        map(responseData => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        /******Catches errors on the observable to be handled by returning a new observable or throwing an error. */
        catchError(errorRes => {
          // Send to analytics server
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
    return this.http.delete(
      'https://rxjs-a3a23.firebaseio.com//posts.json'
    );
  }
}
