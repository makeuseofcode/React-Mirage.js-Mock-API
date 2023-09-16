import { createServer, Model } from 'miragejs';

const DEFAULT_CONFIG = {
  environment: "development",
  namespace: "api",
};

export function makeServer({ environment, namespace } = DEFAULT_CONFIG) {
  let server = createServer({
    environment,
    namespace,
    models: {
      Todo: Model, 
    },
    // API seed data
    seeds(server) {
      server.create('Todo', {
        title: 'item no 1',
        body:
          'Do something nice for someone I care about',
      });
      server.create('Todo', {
        title: 'item no 2',
        body:
          'Memorize the fifty states and their capitals.',
      });
      server.create('Todo', {
        title: 'item no 3',
        body:
          'Watch a classic movie.',
      });
    },
    // API routes
    routes() {
      this.namespace = 'api/todos'; 
      
      this.get('/', (schema, request) => {
        return schema.all('Todo'); 
      });

      this.post('/', (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        return schema.create('Todo', attrs); 
      });

      this.delete('/:id', (schema, request) => {
        let id = request.params.id;
        return schema.find('Todo', id).destroy(); 
      });
    }
    
  });

  return server;
}
