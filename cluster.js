'use strict';

const cluster = require('cluster');

function startWorker() {
    const worker = cluster.fork();
    console.log('CLUSTER: Core %d is using', worker.id);
}

if (cluster.isMaster) {
    require('os').cpus().forEach(function () {
        startWorker();
    });

    /*Writes a log of all of disconnected performers; 
    If the performer is disabled, 
    it must then complete the work, 
    so we will wait for the completion of 
    the event to generate a new performer to replace it*/
    cluster.on('disconnect', (worker) => {
        console.log('CLUSTER: Core %d switched off from the cluster.', worker.id);
    });
    cluster.on('exit', (worker, code, signal) => {
        console.log('CLUSTER: Core %d is finished working with the code of ending %d (%s)', worker.id, code, signal);
        startWorker();
    });
} else {
    /*We run our app to a performer;
    see server.js*/
    require('./server.js')();
}