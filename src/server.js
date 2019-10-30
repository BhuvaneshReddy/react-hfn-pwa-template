import React from 'react';
import ReduxServer from '@pawjs/redux/server';
import createSagaMiddleware from 'redux-saga';
import * as reducers from './common/reducers/';
import mySaga from './common/reducers/saga';
import FavIcon from './resources/img/favicon.ico';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

initializeIcons("https://static2.sharepointonline.com/files/fabric/assets/icons/", { disableWarnings: true });


const appInitialState = {};

export default class Server {
  constructor({ addPlugin }) {
    this.sagaMiddleware = createSagaMiddleware();
    const reduxServer = new ReduxServer({ addPlugin });
    reduxServer.setReducers(reducers);
    reduxServer.addMiddleware(this.sagaMiddleware);
    addPlugin(reduxServer);
  }

  apply(serverHandler) {
    serverHandler
      .hooks
      .reduxInitialState
      .tapPromise('AppInitialState', async ({ getInitialState, setInitialState }) => {
        const initialState = Object.assign({}, {}, appInitialState);
        setInitialState(initialState);
      });

    serverHandler
      .hooks
      .beforeAppRender
      .tapPromise('RunSagaMiddleware', async () => this.sagaMiddleware.run(mySaga));

    // serverHandler.hooks.beforeHtmlRender.tap('AddGoogleAnalytics', (Application) => {
    //   Application.htmlProps.head.push(
    //     <link key="favicon" rel="shortcut icon" type="image/x-icon" href={FavIcon} />,
    //     <script key="addGoogleAnalytics" async src="https://www.google-analytics.com/analytics.js" />,
    //   );
    //   return Application;
    // });
  }
}
