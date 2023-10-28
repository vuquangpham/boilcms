import UserPost from "./UserPost";

document.querySelectorAll('[data-user-wrapper]').forEach(wrapper => new UserPost(wrapper))
