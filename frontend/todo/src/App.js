import React, {Component} from 'react'
import './App.css'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/it'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import CustomTodo from './Components/CustomTodo'
import {fetchTodos, addTodo, toggleTodo} from './Utils/API'
import TodoModal from "./Components/TodoModal"

import {unregister} from './registerServiceWorker';

unregister();

const events = [{
    "id": 50,
    "title": "asdas",
    "isCompleted": true,
    "end": "2018-04-04T23:30:59+00:00",
    "modify_date": "2018-04-08T21:06:35+00:00",
    "start": "2018-04-04T00:00:00+00:00"
},
    {
        "id": 51,
        "title": "asdone",
        "isCompleted": true,
        "end": "2018-04-04T02:30:00+00:00",
        "modify_date": "2018-04-08T21:06:59+00:00",
        "start": "2018-04-04T02:00:00+00:00"
    },
    {
        "id": 52,
        "title": "piu giorni",
        "isCompleted": false,
        "end": "2018-04-08T00:00:00+00:00",
        "modify_date": "2018-04-08T21:08:14+00:00",
        "start": "2018-04-06T00:00:00+00:00"
    },
    {
        "id": 53,
        "title": "",
        "isCompleted": false,
        "end": "2018-04-03T00:00:00+00:00",
        "modify_date": "2018-04-08T21:12:20+00:00",
        "start": "2018-04-02T00:00:00+00:00"
    },
    {
        "id": 54,
        "title": "ggg",
        "isCompleted": false,
        "end": "2018-04-05T07:00:00+00:00",
        "modify_date": "2018-04-08T21:15:22+00:00",
        "start": "2018-04-05T02:00:00+00:00"
    },
    {
        "id": 55,
        "title": "asd",
        "isCompleted": false,
        "end": "2018-04-06T06:00:00+00:00",
        "modify_date": "2018-04-08T21:15:43+00:00",
        "start": "2018-04-06T01:00:00+00:00"
    },
    {
        "id": 56,
        "title": "dalle 2 alle 6",
        "isCompleted": false,
        "end": "2018-04-07T06:00",
        "modify_date": "2018-04-08T21:18:13+00:00",
        "start": "2018-04-07T02:00"
    }]

class App extends Component {

    state = {
        selectedDate: null,
        selectedTitle: "",
        events: events,
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
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            console.log('Development');
            let _that = this;
            let events = this.state.events.map(function (e) {
                e.onToggleTodo = _that.onToggleTodo.bind(_that);
                return e;
            });

        } else {
            console.log('Production');
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
        //Todo, add a loading gif that is not rewrited every time we deploy! :-/
        if (this.state.loading) {
            return <img src="/images/loading.gif"/>
        }
        return (
            <div>

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
                    formats={{eventTimeRangeFormat:" "}}
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
