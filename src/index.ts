import { Server } from './server';

// create http server
const server = Server.bootstrap().app;
server.listen(server.get('port'), () => {
    // tslint:disable-next-line:no-console
    console.log('Express server listening on port ' + server.get('port'));
});
