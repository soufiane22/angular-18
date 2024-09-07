import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from './todo.model';
import { TodoService } from './todo.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [FormsModule,NgClass],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss'
})
export class TodosComponent implements OnInit {

  todo: Todo  = {
    title : "",
    completed : false
  };
  todos: Todo [] = [];
  editable:boolean = false;
  todoService = inject(TodoService);

  ngOnInit(): void {
    this.getAllTodos();
  }

  persistTodo(){
    this.todoService.persistTodo(this.todo).subscribe({
      next : (data) => {console.log("data => ",data);
        this.todos = [data,...this.todos];
        this.todo.title = "";
      },
      error : (error) => { console.log("error ", error)},
      complete : () => {}
      
    })
  }

  onEditTodo(todo:Todo){
    this.todo = {id:todo.id , title: todo.title , completed:todo.completed } ;
    
    this.editable=true;

  }
  editTodo(){
    this.todoService.updateTodo(this.todo).subscribe({
      next : (data) => { this.todos = this.todos.map(item => {
        if(data.id == item.id ) return data ; return item
      }) },
      error : (error) => {},
      complete : () => { this.initTodo()}
    })
  }

  getAllTodos(){
    this.todoService.getTodos().subscribe({
      next : (data) => {this.todos = data },
      error : (error) => { console.log("error ",error);

      }
    })
  }

  initTodo(){
    this.todo = {
      title: "",
      completed: false
    };
    this.editable = false;
  }

  completeTodo(todo:Todo){
    todo.completed = !todo.completed;
    this.todoService.updateTodo(todo).subscribe({
      next : (data) => { this.todos = this.todos.map(item => {
        if(data.id == item.id ) return data ; return item
      }) },
      error : (error) => {},
      complete : () => { this.initTodo()}
    })
  }

}
