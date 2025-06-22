import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8081', // Replace with your Keycloak server URL
  realm: 'task-b2b', // Replace with your realm
  clientId: 'hahn-task-management', // Replace with your clientId
});

export default keycloak; 