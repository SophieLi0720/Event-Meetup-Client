import axios from 'axios';

const SERVER_URL = "http://localhost:4941/api/v1/" //"http://csse-s365docker1.canterbury.ac.nz:4001/api/v1/";
const instance = axios.create({
    baseURL: SERVER_URL,
    timeout: 5000
});

export default {

    register: (user) => instance.post('users/register', user),
    login: (user) => instance.post('users/login', user),
    logout: (token) => instance.post('users/logout', null, {headers: {'X-Authorization': token}}),
    getUserImage: (id) => {
        return `${SERVER_URL}users/${id}/image`;
    },
    getEventImage: (id) => {
        return `${SERVER_URL}events/${id}/image`;
    },
    listEvents: () => instance.get('/events?sortBy=DATE_ASC'),
    findCategories: () => instance.get('/events/categories'),
    getEventById: (id) => instance.get(`/events/${id}`),
    getEventAttendees: (id, token) => instance.get(`/events/${id}/attendees`, {headers: {'X-Authorization': token}}),
    listSingleUser: (id, token) => instance.get(`/users/${id}`, {headers: {'X-Authorization': token}}),
    changeUserDetail: (id, data, token) => instance.patch(`/users/${id}`, data, {headers: {'X-Authorization': token}}),
    joinAnEvent: (id, token) => instance.post(`/events/${id}/attendees`, null, {headers: {'X-Authorization': token}}),
    leaveAnEvent: (id, token) => instance.delete(`/events/${id}/attendees`, {headers: {'X-Authorization': token}}),
    putUserImage: (id, image, token) => instance.put(`/users/${id}/image`, image, {
        headers: {
            'X-Authorization': token,
            'Content-Type': image.type
        }
    }),
    searchEventWithKeyword: (text) => instance.get('/events' + `?q=${text}`),
    eventFilter: (filter_params) => instance.get('/events' + `${filter_params}`),
    creatEvent: (data, token) => instance.post('/events', data, {headers: {'X-Authorization': token}}),
    putEventImage: (id, image, token) => instance.put(`/events/${id}/image`, image, {
        headers: {
            'X-Authorization': token,
            'Content-Type': image.type
        }
    }),
    deleteEvent: (id, token) => instance.delete(`/events/${id}`, {headers: {'X-Authorization': token}}),
    controlAttendee: (event_id, user_id, data, token) => instance.patch(`/events/${event_id}/attendees/${user_id}`, data, {headers: {'X-Authorization': token}}),
    changeEventDetail: (id, data, token) => instance.patch(`/events/${id}`, data, {headers: {'X-Authorization': token}}),
    deleteUserImage: (id, token) => instance.delete(`/users/${id}/image`, {headers: {'X-Authorization': token}}),


};

