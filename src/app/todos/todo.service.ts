import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from './todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
   private readonly apiUrl = "http://localhost:3000/todos"
  constructor(private http: HttpClient ) { }

  getTodos() : Observable<Todo[]>{
    return this.http.get<Todo[]>(this.apiUrl);
  }

  persistTodo(data : Todo):Observable<Todo> {
   return this.http.post<Todo>(this.apiUrl,data);
  }

  getTodo(id : string) : Observable<Todo>{
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  updateTodo(data : Todo) : Observable<Todo>{
    return this.http.put<Todo>(`${this.apiUrl}/${data.id}`,data);
  }

  destroyTodo(id : string) : Observable<Object>{
    return this.http.delete<Object>(`${this.apiUrl}/${id}`);
  }


}
