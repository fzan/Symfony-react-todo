import React, {Component} from 'react';
import 'moment/locale/it';
import 'font-awesome/css/font-awesome.min.css';
import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";

/*
* This component define the view for a single todo,
* It's dinamically created via props and do not have an inner state
*/
class CustomTodo extends Component {

    handleClick(e, data) {
        if (data.action === "toggle") {
            this.props.event.onToggleTodo(data.id);
        }
        //todo other actions
    };

    render() {
        const type = this.props.event.isCompleted ? <i className="fa fa-check-square"/> : <i className="fa fa-ban"/>;
        const color = this.props.event.isCompleted ? "white" : "red";
        return (
            <div style={{"width": "100%", "height": "100%"}}>
                <ContextMenuTrigger id={"item-top" + this.props.event.id}>
                    <div style={{'color': color}}>
                        {this.props.event.isCompleted ? this.props.event.title : <s>{this.props.event.title}</s>}
                        <span className="pull-right">
                    {type}
                            <div>{this.props.event.isCompleted ? null : this.props.event.dueDate}</div>
                </span>
                    </div>
                </ContextMenuTrigger>
                <ContextMenu id={"item-top" + this.props.event.id}>
                    <MenuItem id={"item-1" + this.props.event.id} data={{action: "toggle", id: this.props.event.id}}
                              onClick={(e, data) => this.handleClick(e, data)}>
                        {this.props.event.isCompleted ? "Segna come da completare" : "Segna come completato"}
                    </MenuItem>
                    <MenuItem id={"item-divider" + this.props.event.id} divider/>
                    <MenuItem id={"item-2" + this.props.event.id} data={{action: 'Todo', id: this.props.event.id}}
                              onClick={(e, data) => this.handleClick(e, data)}>
                        Elimina (TODO)
                    </MenuItem>
                    <MenuItem id={"item-3" + this.props.event.id} data={{action: 'Todo', id: this.props.event.id}}
                              onClick={(e, data) => this.handleClick(e, data)}>
                        Modifica (TODO)
                    </MenuItem>
                </ContextMenu>
            </div>
        );
    }

}

export default CustomTodo;