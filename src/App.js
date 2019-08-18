import React from 'react';
import { Provider } from 'react-redux';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

// import redux store
import store from './store';

// import components
import CalenderComp from './components/CalenderComp';

function App() {
  return (
    <Provider store={store}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className='App'>
          <CalenderComp />
        </div>
      </MuiPickersUtilsProvider>
    </Provider>
  );
}

export default App;
