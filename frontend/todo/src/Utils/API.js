import axios from 'axios';

const api = axios.create({
    baseURL: window.location.origin,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export function fetchTodos() {
    return api.get('/api/todo/get')
        .then(res => res.data)
        .catch(err => {console.error(err); throw "Get REST Connection Error"});
}

export function addTodo(title, startDate, endDate) {
    return api.post('/api/todo/add', {
        title: title,
        startDate: startDate,
        endDate: endDate,
        completed: false
    })
        .then(res => res.data)
        .catch(err => {console.error(err); throw "Add REST Connection Error"});
}

export function toggleTodo(id) {
    return api.patch(`/api/todo/toggle/${id}`)
        .then(res => res.data)
        .catch(err => {console.error(err); throw "Toggle REST Connection Error"});
}

// ****** testing ******
export function getDummyTodos() {
    return [
        {
            "id": 55,
            "title": "Test5",
            "isCompleted": false,
            "end": "2018-04-06T06:00:00+00:00",
            "modify_date": "2018-04-08T21:15:43+00:00",
            "start": "2018-04-06T01:00:00+00:00"
        },
        {
            "id": 56,
            "title": "Test6",
            "isCompleted": true,
            "end": "2018-04-07T06:00",
            "modify_date": "2018-04-08T21:18:13+00:00",
            "start": "2018-04-07T02:00"
        }];
}