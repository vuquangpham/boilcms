import '../styles/index.scss';

// vendors
import '@global/theme/theme.min.js';
import '@global/accordion/Accordion.min.js';
import '@global/easy-select/easy-select.min.js';

// posts-type
import './posts-type/posts';
import './posts-type/media';
import './posts-type/user';
import './posts-type/account'

// init easy select
EasySelect.init();