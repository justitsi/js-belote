import { HashRouter, Route } from 'react-router-dom'
// import styles from './App.module.scss'
import './App.scss';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';
import MainPage from './content/MainPage';
import BelotePage from './content/BelotePage';
import Navbar from './components/SiteComponents/Navbar'


function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Navbar />
      <HashRouter>
        <Route exact path='/' component={MainPage} />
        <Route exact path='/belote/:roomID' component={BelotePage} />
      </HashRouter>
    </I18nextProvider>
  );
}

export default App;
