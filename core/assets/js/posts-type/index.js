import PageBuilder from "@be/page-builder";

document.querySelectorAll('[data-pb]').forEach(e => {
    window.instance = new PageBuilder(e);
});