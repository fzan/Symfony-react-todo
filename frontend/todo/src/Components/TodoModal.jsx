import React, {Component} from 'react'
import Modal from 'simple-react-modal';

class TodoModal extends Component {

    constructor(props) {
        super(props);
        this.textInput = React.createRef();
    }

    onConfirmTitle(){
        if (this.textInput.current.value.length<3) {
            alert('Inserire almeno 3 caratteri');
            return;
        }
        this.props.onConfirmTitle(this.textInput.current.value);
        this.textInput.current.value=""; // :]
    }

    render() {
        return (
            <Modal
                className={this.props.show ? "react-modal" : "hidden"}
                closeOnOuterClick={true}
                show={this.props.show}
                onClose={this.props.close}>

                <div className="react-modal-content">
                    <span>Titolo del todo:</span> <input type="text" ref={this.textInput}/>
                    <br/>
                    <input type="button" value="Conferma" onClick={()=>this.onConfirmTitle()}/>
                    <div className="close"><a onClick={()=>this.props.close()}>X</a></div>
                    {this.props.startDate?
                        <small><i> Inserisci il todo per il periodo: {this.props.startDate} - {this.props.endDate}</i></small>
                        :
                        null}
                </div>

            </Modal>)
    }
}

export default TodoModal;
