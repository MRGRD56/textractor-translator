import '../../../node_modules/antd/dist/antd.min.css'
import '../../../node_modules/material-symbols/index.css';
import '../../style/basic.scss';
import './styles/settings.scss';
import Settings from './Settings';
import {createRoot} from 'react-dom/client';

createRoot(document.getElementById('app')!).render(<Settings/>);