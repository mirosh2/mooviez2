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
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import TopVotes from './components/TopVotes';
import TopComments from './components/TopComments';
import NewComments from './components/NewComments';

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
                <Route exact path='/signup' component={SignUp} />
                <Route exact path='/profile' component={Profile} />
                <Route exact path='/topvotes' component={TopVotes} />
                <Route exact path='/topcomments' component={TopComments} />
                <Route exact path='/newcomments' component={NewComments} />

        	 	<Route path='*' component={Login}/>

        </Switch>
		  
    	</BrowserRouter>
	</Provider>,
	document.getElementById('root'));

registerServiceWorker();
