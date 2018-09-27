import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import App from './App'
import Login from './components/Login'
import Register from './components/Register'
import TodoList from './components/TodoList'

export let NonLoggedRoutes = () => (
    <Router>
        <div className="navbar">
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <Link to="/" className="navbar-brand">Todo List App</Link>
                    </div>
                    <ul className="nav navbar-nav">
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        <li><Link className="glyphicon glyphicon-user" to="/register"> Register</Link></li>
                        <li><Link className="glyphicon glyphicon-log-in" to="/login"> Login</Link></li>
                    </ul>
                </div>
            </nav>
            <Route path="/myTodos" component={TodoList}/>
            <Route path="/login" component={() => <Login Callback={this.Callback}/>}/>
            <Route path="/register" component={Register}/>
        </div>
    </Router>
);
export let LoggedRoutes = () => (
    <Router>
        <div className="navbar">
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <Link to="/" className="navbar-brand">Todo List App</Link>
                    </div>
                    <ul className="nav navbar-nav">
                        <li><Link to="/myTodos" className="nav navbar-nav">My Todos</Link></li>
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        <li><Link className="glyphicon glyphicon-log-out" to="/logout"> Logout</Link></li>
                    </ul>
                </div>
            </nav>
            <Route path="/myTodos" component={TodoList}/>
            <Route path="/logout" component={App.isAuthenticated = false}/>
        </div>
    </Router>
);
