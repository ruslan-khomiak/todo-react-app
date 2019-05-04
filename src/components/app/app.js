import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import ToDoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component {

    createToDoItem = (label) => {
        return {
            label,
            important: false,
            id: this.maxId++,
            done: false
        }
    };

    maxId = 0;

    state = {
        todoData: [
            this.createToDoItem('Drink Coffee'),
            this.createToDoItem('Make Awesome App'),
            this.createToDoItem('Have a lunch')
        ],
        term: '',
        filter: 'all',
    };

    deleteItem = (id) => {
      this.setState(({ todoData } ) => {
          return { todoData: todoData.filter((item) => item.id !== id) };
      });
    };

    addItem = (label) => {
        const newItem = this.createToDoItem(label);
        this.setState(({ todoData }) => {
            return { todoData: [ ...todoData, newItem ]  }
        })
    };

    toggleProperty = (arr, id, propName) => {
        const index = arr.findIndex((item) => item.id === id);
        const oldItem = arr[index];
        const newItem = { ...oldItem, [propName]: !oldItem[propName] };

        return [...arr.slice(0, index), newItem, ...arr.slice(index + 1)];
    };

    onToggleImportant = (id) => {
        this.setState(({ todoData }) => {
            return { todoData: this.toggleProperty(todoData, id, 'important') };
        });
    };

    onToggleDone = (id) => {
        this.setState(({ todoData }) => {
            return { todoData: this.toggleProperty(todoData, id, 'done') };
        });
    };

    onSearchChange = (term) => {
        this.setState({ term });
    };

    onFilterChange = (filter) => {
        this.setState({ filter });
    };

    search = (items, term) => {
        if (!items.length) return items;
        return items.filter((item) => item.label.toLowerCase().indexOf(term.toLowerCase()) > -1);
    };

    filter = (items, filter) => {
        switch (filter) {
            case 'all':
                return items;
            case 'active':
                return items.filter((item) => !item.done);
            case 'done':
                return items.filter((item) => item.done);
            default:
                return items;
        }
    };

    render() {
        const { todoData, term, filter } = this.state;
        const visibleItems = this.filter(this.search(todoData, term), filter);
        const doneCount = todoData.filter((item) => item.done).length;
        const toDoCount = todoData.length - doneCount;
        return (
            <div className='todo-app'>
                <AppHeader toDo={ toDoCount } done={ doneCount } />
                <div className='top-panel d-flex'>
                    <SearchPanel onSearchChange={ this.onSearchChange } />
                    <ItemStatusFilter
                        filter={ filter }
                        onFilterChange={ this.onFilterChange }
                    />
                </div>
                <ToDoList
                    todos={ visibleItems }
                    onDeleted={ this.deleteItem }
                    onToggleImportant={ this.onToggleImportant }
                    onToggleDone={ this.onToggleDone }
                />
                <ItemAddForm onItemAdded={ this.addItem } />
            </div>
        );
    }
};