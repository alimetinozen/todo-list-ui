import React, {Component} from "react";
import FlipMove from "react-flip-move";
import moment from "moment/moment";

class TodoItems extends Component {
    constructor(props) {
        super(props);
        this.createTask = this.createTask.bind(this);
    }

    delete(id) {
        this.props.delete(id);
    }

    setCompleted(id) {
        this.props.setCompleted(id);
    }

    createTask(item) {
        return <li className="list-group-item" style={{backgroundColor: item.status === true ? "#4BB543" : ""}}
                   key={item.id}>{item.name} : {item.description}<span
            className="pull-right"><span
            className="badge badge-primary">Deadline : {moment(item.deadline).fromNow()}</span> | <span
            onClick={() => this.setCompleted(item.id)}
            className="glyphicon glyphicon-ok blue"></span> | <span
            onClick={() => this.delete(item.id)}
            className="glyphicon glyphicon-remove"></span></span>
        </li>
    }

    render() {
        var todoEntries = this.props.entries;
        var listItems = todoEntries.map(this.createTask);

        return (
            <ul className="list-group row">
                <FlipMove duration={250} easing="ease-out">
                    {listItems}
                </FlipMove>
            </ul>
        );
    }
};

export default TodoItems;