import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import TodoItems from "./TodoItems";
import moment from 'moment';
import axios from "axios"
import ServiceConfig from "../ServiceConfig";

class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todoItems: [],
            filteredItems: [],
            todoList: [],
            selectedListId: 1
        };


        this.deleteTodoList = this.deleteTodoList.bind(this);
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.setItemCompleted = this.setItemCompleted.bind(this);
        this.createTodoList = this.createTodoList.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.searchItem = this.searchItem.bind(this);
        this.filterItem = this.filterItem.bind(this);
    }

    createTodoList(e) {
        if (this._inputTodoListName.value !== "") {
            axios.post(ServiceConfig.API_URL + "/lists", {
                name: this._inputTodoListName.value
            })
                .then((response) => {
                    console.log(response);
                    this.getTodoLists();
                })
                .catch(function (error) {
                    console.log(error);
                });
            this._inputTodoListName.value = "";
        }
        else
            alert('Name cannot be empty');
        e.preventDefault();
    }

    setItemCompleted(id) {
        axios
            .get(ServiceConfig.API_URL + "/items/setCompleted/" + id)
            .then(response => {
                this.getTodoItems(this.state.selectedListId);
            })
            .catch(error => console.log(error));
    }

    getTodoLists() {
        axios
            .get(ServiceConfig.API_URL + "/lists/")
            .then(response => {

                const newLists = response.data.map(c => {
                    return {
                        id: c.id,
                        name: c.name
                    };
                });

                const newState = Object.assign({}, this.state, {
                    todoList: newLists,
                    selectedListId: newLists[newLists.length - 1].id
                });

                this.setState(newState);
                this.getTodoItems(this.state.selectedListId);
            })
            .catch(error => console.log(error));

    }

    getTodoItems(id) {
        axios
            .get(ServiceConfig.API_URL + "/lists/" + this.state.selectedListId + "/items/")
            .then(response => {

                const newItems = response.data.map(c => {
                    return {
                        id: c.id,
                        name: c.name,
                        description: c.description,
                        status: c.status,
                        deadline: c.deadline
                    };
                });

                const newState = Object.assign({}, this.state, {
                    todoItems: newItems
                });

                this.setState(newState);
                this.searchItem();
            })
            .catch(error => console.log(error));
    }

    componentDidMount() {
        this.getTodoLists();
    }

    addItem(e) {
        if (this._inputName.value !== "" && this._inputDescription.value !== "" && this._inputDeadline.value !== "") {
            let newItem = {
                name: this._inputName.value,
                description: this._inputDescription.value,
                status: 0,
                deadline: this._inputDeadline.value
            };
            axios.post(ServiceConfig.API_URL + "/lists/" + this.state.selectedListId + "/items", {
                name: newItem.name,
                description: newItem.description,
                status: newItem.status,
                deadline: new Date(newItem.deadline)
            })
                .then((response) => {
                    console.log(response);
                    this.getTodoItems(this.state.selectedListId);
                })
                .catch(function (error) {
                    console.log(error);
                });
            this._inputName.value = this._inputDescription.value = this._inputDeadline.value = "";
        }
        else
            alert('Please fill the blanks');
        e.preventDefault();
    }

    deleteItem(id) {
        let filteredItems = this.state.todoItems.filter(function (item) {
            return (item.id !== id);
        });
        axios
            .delete(ServiceConfig.API_URL + "/lists/" + this.state.selectedListId + "/items/" + id)
            .then(response => {
            })
            .catch(error => console.log(error));
        this.setState({
            todoItems: filteredItems,
            filteredItems: filteredItems
        });
    }

    deleteTodoList(e) {
        axios
            .delete(ServiceConfig.API_URL + "/lists/" + this.state.selectedListId)
            .then(response => {
                this.getTodoLists();
            })
            .catch(error => console.log(error));
        e.preventDefault();
    }

    handleChange(event) {
        this.getTodoItems(event.target.value);
        this.setState({ selectedListId: event.target.value });
    }

    searchItem(event) {
        if (event === undefined) {
            this.setState({ filteredItems: this.state.todoItems });
        }
        else {
            let updatedList = this.state.todoItems;
            updatedList = updatedList.filter((item) => {
                if (item.name.toLowerCase().search(event.target.value.toLowerCase()) !== -1 || item.description.toLowerCase().search(event.target.value.toLowerCase()) !== -1) {
                    return item;
                }
            });
            this.setState({ filteredItems: updatedList });
        }
    }

    filterItem(event) {
        if (event.target.value === "0")
            this.setState({ filteredItems: this.state.todoItems });
        else {
            let updatedList = this.state.todoItems;
            updatedList = updatedList.filter((item) => {
                switch (event.target.value) {
                    case "1":
                        if (item.status === true) {
                            return item;
                        }
                        else
                            break;
                    case "2":
                        if (item.status === false)
                            return item;
                        else
                            break;
                    case "3":
                        if (moment().isAfter(moment(item.deadline)))
                            return item;
                        else
                            break;
                    case "4":
                        if (moment().isBefore(moment(item.deadline)))
                            return item;
                        else
                            break;
                }
            });
            this.setState({ filteredItems: updatedList });
        }
    }

    render() {

        return (
            <div>
                <div className="container col-sm-3">
                    <h4 className="row"> Todo List </h4>
                    <div className="form-group row" >
                        <select className="form-control" value={this.state.selectedListId} onChange={this.handleChange}>
                            {this.state.todoList.map((item) => {
                                return <option key={item.id} value={item.id}>{item.name}</option>;
                            })}
                        </select>
                        <form onSubmit={this.deleteTodoList}>
                            <button className="btn btn-danger col-xs-6 pull-right" type="submit">Delete <span class="glyphicon glyphicon-trash"></span>
                            </button>
                        </form>
                    </div>
                    <h4 className="row">Create new Todo List </h4>
                    <form className="row" onSubmit={this.createTodoList}>
                        <input className="form-control"
                            ref={(a) => this._inputTodoListName = a} placeholder="create a new todo list"></input>
                        <button className="btn btn-primary col-xs-6 pull-right" type=" submit">Add <span class="glyphicon glyphicon-floppy-disk"></span></button>
                    </form>
                    <h4 className="row"> Create Todo Item to TodoList </h4>
                    <div className="form group">
                        <form className="row" onSubmit={this.addItem}>
                            <input className="form-control" ref={(a) => this._inputName = a}
                                placeholder="name"></input>
                            <input className="form-control" ref={(a) => this._inputDescription = a}
                                placeholder="description"></input>
                            <input className="form-control" type="date"
                                min={moment().add(1, 'days').format('YYYY-MM-DD')}
                                ref={(a) => this._inputDeadline = a}></input>
                            <button className=" btn btn-primary col-xs-6 pull-right" type=" submit">Add <span class="glyphicon glyphicon-floppy-disk"></span></button>
                        </form>
                    </div>
                </div>
                <div className="container col-sm-6">
                </div>
                <div className="container col-sm-6">

                    <h4 className="row"> Todo Items </h4>
                    <div className="filter-list">
                        <form>
                            <fieldset className="form-group row">
                                <input type="text" className="form-control form-control-lg" placeholder="Search"
                                    onChange={this.searchItem} />
                                <select className="form-control"
                                    onChange={this.filterItem}>
                                    <option key="0" value="0">Filters</option>
                                    <option key="1" value="1">Completed</option>
                                    <option key="2" value="2">Not Completed</option>
                                    <option key="3" value="3">Expired</option>
                                    <option key="4" value="4">Not Expired</option>
                                </select>
                            </fieldset>
                        </form>
                        <TodoItems entries={this.state.filteredItems}
                            delete={this.deleteItem} setCompleted={this.setItemCompleted} />
                    </div>
                </div>
            </div>
        );

    }
}

export default TodoList;