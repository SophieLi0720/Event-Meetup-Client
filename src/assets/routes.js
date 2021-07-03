import Users from "@/components/Users.register";
import Login from "@/components/Users.login";
import Home from "@/components/Event.home";
import EditProfile from "@/components/Users.edit";
import CreatEvent from "@/components/Event.create";
import Mine from "@/components/Event.mine";
import EditEvent from "@/components/Event.edit";

const routes = [
    {path: "/", redirect: '/users/login'},
    {
        path: "/eventsEdit/:id",
        name: "edit-event",
        component: EditEvent
    },
    {
        path: "/users/register",
        name: "Users-register",
        component: Users
    },
    {
        path: "/users/login",
        name: "Users-login",
        component: Login
    },
    {
        path: "/events",
        name: "Event-home",
        component: Home
    },
    {
        path: "/users/profile",
        name: "edit-user",
        component: EditProfile
    },
    {
        path: "/events/create",
        name: "creat-event",
        component: CreatEvent
    },
    {
        path: "/events/mine",
        name: "my-event",
        component: Mine
    },
];

export default routes;
