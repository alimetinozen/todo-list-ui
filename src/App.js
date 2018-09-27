import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import TodoList from './components/TodoList'


class App extends Component {
    constructor(props) {
        super(props);
        this.Callback = this.Callback.bind(this);
        this.state = {};
    }

    Callback(param) {
        this.setState({});
    }

    render() {

        return (<Router>
            <div className="navbar">
                <nav className="navbar navbar-inverse">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <Link to="/" className="navbar-brand">Todo List App</Link>
                        </div>
                        <ul className="nav navbar-nav">
                        </ul>
                        <ul className="nav navbar-nav navbar-right">

                        </ul>
                    </div>
                </nav>
                <Route path="/" component={() => <TodoList />} />
            </div>
        </Router>)

    }
}

export default App;
