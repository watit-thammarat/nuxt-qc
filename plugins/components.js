import Vue from 'vue';

import Preloader from '../components/UI/Preloader';
import Pagination from '../components/UI/Pagintion';
import Search from '../components/UI/Search';
import FileInput from '../components/UI/FileInput';
import PopupImage from '../components/UI/PopupImage';
import PopupPDF from '../components/UI/PopupPDF';
import QRReader from '../components/UI/QRReader';
import Pdf from '../components/UI/Pdf';

Vue.component('preloader', Preloader);
Vue.component('pagination', Pagination);
Vue.component('search', Search);
Vue.component('file-input', FileInput);
Vue.component('popup-image', PopupImage);
Vue.component('popup-pdf', PopupPDF);
Vue.component('qr-reader', QRReader);
Vue.component('pdf', Pdf);
