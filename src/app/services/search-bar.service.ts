import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchBarService {

  searchBarSubject$: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor() { }

}
