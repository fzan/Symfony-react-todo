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
        .catch(err => console.error(err));
}

export function addTodo(title, startDate, endDate) {
    return api.post('/api/todo/add', {
        title: title,
        startDate: startDate,
        endDate: endDate,
        completed: false
    })
        .then(res => res.data)
        .catch(err => console.error(err));
}

export function toggleTodo(id) {
    return api.patch(`/api/todo/toggle/${id}`)
        .then(res => res.data)
        .catch(err => console.error(err));
}