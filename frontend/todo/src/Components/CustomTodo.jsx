import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/it';
import 'font-awesome/css/font-awesome.min.css';
import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";

class CustomTodo extends Component {

    handleClick(e, data) {
        if (data.action === "toggle") {
            this.props.event.onToggleTodo(data.id);
        }
    };

    render() {
        const type = this.props.event.isCompleted ? <i className="fa fa-check-square"/> : <i className="fa fa-ban"/>;
        const color = this.props.event.isCompleted ? "white" : "red";
        return (
            <div style={{"width": "100%", "height": "100%"}}>
                <ContextMenuTrigger id={"item-top" + this.props.event.id}>
                    <div style={{'color': color, "width": "100%", "height": "100%"}}>
                        {this.props.event.title}
                        <span className="pull-right">
                    {type}
                            <div>{this.props.event.isCompleted ? null : this.props.event.dueDate}</div>
                </span>
                    </div>
                </ContextMenuTrigger>
                <ContextMenu id={"item-top" + this.props.event.id}>
                    <MenuItem id={"item-1" + this.props.event.id} data={{action: "toggle", id: this.props.event.id}}
                              onClick={(e, data) => this.handleClick(e, data)}>
                        Segna come completato
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