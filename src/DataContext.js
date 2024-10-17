import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DataAppContext = React.createContext();

const DataApp = props => {
  const initialValues = {
    loginstatus: false,
    username: 'User 1',
    showmenu: false,
    bgColor: 'white',
  };
  const [appstate, setAppState] = useState(initialValues);
  const navigate = useNavigate();

  const checkLogin = () => {
    let token = localStorage.getItem('jwttoken');
    if (token) {
      setAppState({ ...appstate, loginstatus: true });
    } else {
      setAppState({ ...appstate, loginstatus: false });
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const login = () => {
    setAppState({ ...appstate, loginstatus: !appstate.loginstatus });
  };
  const login_user = () => {
    //console.log('logging in context...')
    setAppState({ ...appstate, loginstatus: true });
  };
  const logout_user = () => {
    // console.log('logging out');
    localStorage.removeItem('jwttoken');
    localStorage.removeItem('userid');
    localStorage.removeItem('usertype');
    // localStorage.removeItem('cart');
    setAppState({ ...appstate, loginstatus: false });
    navigate('/login');
  };

  const showhidemenu = () => {
    // console.log('showhidemenu');
    setAppState({ ...appstate, showmenu: !appstate.showmenu });
  };

  return (
    <DataAppContext.Provider
      value={{ appstate, login, login_user, logout_user, showhidemenu }}
    >
      <div className='app-wrapper'>{props.children}</div>
    </DataAppContext.Provider>
  );
};

export default DataApp;

export { DataAppContext };
