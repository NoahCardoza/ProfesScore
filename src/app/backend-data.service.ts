import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import cheerio from 'cheerio-standalone'

// NOTE: I have never used Angular so maybe this is bad form?
const CORS_PROXY = url => `https://cors-anywhere.herokuapp.com/${ encodeURI(url) }`

@Injectable({
  providedIn: 'root'
})
export class BackendDataService {
  departmentsUrl = 'https://www.deanza.edu/schedule/';
  classesUrl = 'https://us-central1-professcore.cloudfunctions.net/get_classes';
  ratingsUrl = 'https://us-central1-professcore.cloudfunctions.net/get_ratings';

  constructor(private http: HttpClient) { }

  getDepartments() {
    return this.http.get(CORS_PROXY(this.departmentsUrl), {responseType: 'text'}).pipe(
      map(
        data => {
          return cheerio('select#dept-select option', data)
            .get()
            .reduce((elements, el) =>
              elements.concat(el.attribs.value
                ? {
                    name: el.children[0].data,
                    value: el.attribs.value
                  }
                : []),
              []
            )
        }, error => console.error(error)))
  }
  getClasses(dept) {
    return this.http.get(this.classesUrl + '?dept=' + dept);
  }
  getRatings(dept, class_) {
    return this.http.get(this.ratingsUrl + '?dept=' + dept + '&class=' + encodeURIComponent(class_));
  }
}
