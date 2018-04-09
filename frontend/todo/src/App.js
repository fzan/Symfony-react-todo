import React, {Component} from 'react'
import './App.css'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/it'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import CustomTodo from './Components/CustomTodo'
import {getDummyTodos, fetchTodos, addTodo, toggleTodo} from './Utils/API'
import TodoModal from "./Components/TodoModal"

import {unregister} from './registerServiceWorker';

unregister();
class App extends Component {

    state = {
        selectedDate: null,
        selectedTitle: "",
        events: [],
        loading: false,
        show: false
    };

    show() {
        this.setState({show: true})
    }

    close() {
        this.setState({show: false})
    }

    reloadTodo() {
        let _that = this;
        return fetchTodos().then(res => {
            if (res) {

                /* This is a very hacky workaround due to limitations to
                 * React-big-calendar. It's not possible to add a callback to an event component that receive
                 * actions inside itself! 3:-/
                 */
                let events = res.map(function (e) {
                    e.onToggleTodo = _that.onToggleTodo.bind(_that);
                    return e;
                });
                //console.error(events);
                this.setState({
                    selectedStartDate: null,
                    selectedEndDate: null,
                    selectedTitle: "",
                    events: events,
                    loading: false
                });
            }
        });
    }

    componentWillMount() {

        /* Note: this section is unnecessary and it's only purpose is to allow some testing :[ */
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            console.log('Development');
            let _that = this;
            let events = getDummyTodos();
            events.map(function (e) {
                e.onToggleTodo = _that.onToggleTodo.bind(_that);
                return e;
            });
            this.setState({events:events});

        } else if (!process.env.NODE_ENV || process.env.NODE_ENV ==='test'){
            //as stated at the beginning:
            //do not call reloadTodo() due to axios bug
            //See https://github.com/node-nock/nock/issues/699
        }else{
            //console.log('Production');
            //initial loading phase
            this.setState({loading: true});
            this.reloadTodo();
        }
        BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
    }

    onSelectDate(slotInfo) {
        this.setState(
            {
                selectedStartDate: moment(slotInfo.start).format('Y-MM-DD HH:mm'),
                selectedEndDate: moment(slotInfo.end).format('Y-MM-DD HH:mm')
            });
        this.show();
    }

    onConfirmTitle(value) {
        let _that = this;
        this.close();
        this.setState({loading: true}, function (state) {
            addTodo(value, _that.state.selectedStartDate, _that.state.selectedEndDate).then(
                res => {
                    _that.reloadTodo().then(() => _that.setState({loading: false}));
                }
            )
        });
    }

    onToggleTodo(id) {
        let _that = this;
        this.setState({loading: true}, function (state) {
            toggleTodo(id).then(
                res => {
                    _that.reloadTodo().then(() => _that.setState({loading: false}));
                }
            )
        });
    }

    render() {

        if (this.state.loading) {
            //return a loading spinner
            return <img src="/images/loading.gif" alt={"loading"}/>
        }
        return (
            <div>
                {/* This is the modal for the info title and action*/}
                <TodoModal
                    show={this.state.show}
                    close={() => this.close()}
                    onConfirmTitle={(value) => this.onConfirmTitle(value)}
                    startDate={moment(this.state.selectedStartDate).format('DD/MM/Y HH:mm')}
                    endDate={moment(this.state.selectedEndDate).format('DD/MM/Y HH:mm')}
                />

                <BigCalendar
                    selectable
                    events={this.state.events}
                    formats={{eventTimeRangeFormat:()=>{}}}
                    defaultView="week"
                    components={{event: CustomTodo}}
                    views={['week']}
                    step={120}
                    timeslots={2}
                    startAccessor={(event) => {
                        return event ? new Date(moment(event.start)) : null
                    }}
                    endAccessor={(event) => {
                        return event ? new Date(moment(event.end)) : null
                    }}
                    scrollToTime={new Date(2018, 1, 1, 6)}
                    defaultDate={new Date()}
                    onSelectEvent={null}//event => alert(event.title + " " + event.start + " - "+ event.end)}
                    onSelectSlot={slotInfo => this.onSelectDate(slotInfo)}
                />
            </div>
        )
    }
}

export default App;
