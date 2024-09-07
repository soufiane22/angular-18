import { Component, OnInit, inject,signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from './todo.model';
import { TodoService } from './todo.service';
import { NgClass } from '@angular/common';
import { errorMonitor } from 'node:events';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [FormsModule,NgClass],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss'
})
export class TodosComponent implements OnInit {

  todo = signal<Todo>({
    title : "",
    completed : false
  });

  todos = signal<Todo []>([]);
  editable = signal<boolean>(false);
  openForm = signal<boolean>(false);
  todoService = inject(TodoService);

  ngOnInit(): void {
    this.getAllTodos();
  }

  persistTodo(){
    this.todoService.persistTodo(this.todo()).subscribe({
      next : (data) => {console.log("data => ",data);
        this.todos.set([data,...this.todos()]) ;
        this.todo().title = "";
        this.openForm.set(false);
        this.sortTodos();
      },
      error : (error) => { console.log("error ", error)},
      complete : () => {}
      
    })
  }

  onEditTodo(todo:Todo){
    this.openForm.set(true);
    this.todo.set({id:todo.id , title: todo.title , completed:todo.completed })  ;
    this.editable.set(true);

  }
  editTodo(){
    this.todoService.updateTodo(this.todo()).subscribe({
      next : (data) => { 
        this.todos.set(this.todos().map(item => {
        if(data.id == item.id ) return data ; return item
      })) ;
      this.openForm.set(false);
    },
      error : (error) => {},
      complete : () => { this.initTodo()}
    })
  }

  getAllTodos(){
    this.todoService.getTodos().subscribe({
      next : (data) => {
        this.todos.set(data)  ;
        this.sortTodos();
      },
      error : (error) => { console.log("error ",error);

      }
    })
  }

  initTodo(){
    this.todo.set({
      title: "",
      completed: false
    });
    this.editable.set(false);
  }

  completeTodo(todo:Todo){
    todo.completed = !todo.completed;
    this.todoService.updateTodo(todo).subscribe({
      next : (data) => { 
        this.todos.set(this.todos().map(item => {
        if(data.id == item.id ) return data ; return item
      }));
      this.sortTodos();
     },
      error : (error) => {},
      complete : () => { this.initTodo()}


    })
  }

  cancel(){
    this.openForm.set(!this.openForm()) ;
    this.initTodo();
  }

  sortTodos(){
    this.todos.set(this.todos().sort((a,b) => a.completed ? 1 : -1 )) ;
  }

  deleteTodo(todo:Todo){
    if(!confirm("Are you sure to delete this todo : "+todo.title + " ?")){
       return
    }
    if(todo.id && !todo.completed)
   this.todoService.destroyTodo(todo.id).subscribe({
    next: (data) => {
      this.getAllTodos();

    },
    error : (err) => { 
      console.log("error ", err);
      
    }
   })
  }

}
