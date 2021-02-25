import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { routes } from './configs/routes';
import { playerStore } from './store/player';
import { StoreProvider } from 'easy-peasy';

const App: React.FC = () => {
  return (
    <Router>
      <StoreProvider store={playerStore}>
        <div className="App">
          {/* <div className="app-main-nav">
            {visibleRoutes.map((route, i) => (
              <NavLink
                key={i}
                to={route.path}
                exact={route.exact}
                activeClassName="is-active"
                className="menu-item"
              >
                {route.label}
              </NavLink>
            ))}
          </div> */}

          <div className="page-container">
            <Switch>
              {Object.values(routes).map((route, i) => (
                <Route
                  key={i}
                  path={route.path}
                  exact={route.exact}
                  render={(props): React.ReactNode => {
                    return React.createElement(route.component, {
                      ...props,
                      key: i,
                    });
                  }}
                />
              ))}
              <Route path="*">
                <Redirect to={routes.home.path} />
              </Route>
            </Switch>
          </div>
        </div>
      </StoreProvider>
    </Router>
  );
};

export default App;
