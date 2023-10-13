import MediaPost from "./MediaPost";
import MediaPopup from "./MediaPopup";

// media posts
document.querySelectorAll('[data-media-wrapper]').forEach(wrapper => new MediaPost(wrapper));

// media popup
document.querySelectorAll('[data-pb-component-popup]').forEach(wrapper => new MediaPopup(wrapper));