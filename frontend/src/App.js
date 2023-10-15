import { BrowserRouter, Routes, Route } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';
import MainPage from './content/MainPage';
import BelotePage from './content/BelotePage';
import Navbar from './components/SiteComponents/Navbar';
import Footer from './components/SiteComponents/Footer';
import { SocketContext, GameContext } from './modules/socketContexts';
import styles from './App.module.scss'
import './App.scss';

// imports for handling server connection
import {
  connectToServerSocket
} from './modules/socketActions';


const App = () => {
  // generate socket IDs once and then reuse them during user's stay on the website
  const serverClientID = uuidv4();
  const gameClientID = uuidv4();
  // only connect to server socket once and (try to) keep the connection alive
  const serverSocket = connectToServerSocket(serverClientID);


  return (
    <div className={styles.App}>
      <I18nextProvider i18n={i18n}>
        <div className={styles.content}>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route exact
                path='/'
                element={
                  <SocketContext.Provider value={[serverClientID, serverSocket]}>
                    <MainPage />
                  </SocketContext.Provider>
                }
              />
              <Route exact
                path='/belote/room/:roomID'
                element={
                  <GameContext.Provider value={[gameClientID]}>
                    <BelotePage />
                  </GameContext.Provider>
                }
              />

            </Routes>
          </BrowserRouter>
        </div>
        <Footer />
      </I18nextProvider >
    </div >
  );
}

export default App;
