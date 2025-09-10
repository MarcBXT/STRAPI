import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound } from 'strapi-helper-plugin';
// Utils
import pluginId from '../../pluginId';
// Containers
import HomePage from '../HomePage';
import ExportPage from '../ExportPage';

const App = () => {
  return (
    <div>
      <Switch>
        <Route 
          path={`/plugins/${pluginId}`} 
          component={HomePage} exact 
        />
        <Route
          path={`/plugins/${pluginId}/export`}
          component={ExportPage} exact
        />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default App;
