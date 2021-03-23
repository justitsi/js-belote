import { HashRouter, Route } from 'react-router-dom'
import styles from './App.module.scss'
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';
import MainPage from './Content/MainPage';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <HashRouter>
        <Route path="/">
          <MainPage />
        </Route>
      </HashRouter>
    </I18nextProvider>
  );
}

export default App;
