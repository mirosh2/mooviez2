import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route,  } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from 'redux-thunk';


import Login from './components/Login';
import Main from './components/Main';
import NewMovies from './containers/NewMovies';
import Votes from './components/Votes';
import Comments from './components/Comments';
import Movie from './components/Movie';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

import reducer  from './reducers';

let store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
	<Provider store={store}>
    	
    	<BrowserRouter>
    		<Switch>
          
	         	<Route exact path='/' component={Login} />
                <Route exact path='/movies' component={Main} />
                <Route exact path='/new' component={NewMovies} />
                <Route exact path='/votes' component={Votes} />
                <Route exact path='/comments' component={Comments} />
                <Route exact path='/movie/:id' component={Movie} />

        	 	<Route path='*' component={Login}/>

        </Switch>
		  
    	</BrowserRouter>
	</Provider>,
	document.getElementById('root'));

registerServiceWorker();
