/**
 * This class reacts to the reception of a webhook call from dockerhub
 * related to a build that has been completed.
 * Used only for Toto Microservices
 */
var exec = require('child_process').exec;

exports.do = function(data) {

  return new Promise(function(success, failure) {

    console.log("Dockerhub hook : received build notification");

    // Extract the name of the Microservice
    var containerName = data.repository.name;
    var image = data.repository.repo_name;

    // Create the sequence of commands that will have to be executed
    var command = '';

    // Stop the docker container, if any
    command += 'docker stop ' + containerName + ' || true; ';

    // Remove the docker container, if any
    command += 'docker rm ' + containerName + ' || true; ';

    // Remove the old image
    command += 'docker rmi ' + image + '; ';

    // Pull the new image
    command += 'docker pull ' + image + '; ';

    // Deploy the new container
    command += 'docker run -d --network totonet --name ' + containerName + ' --restart always ' + image;

    // 1. Execute the rm of the previous container if any and the start of the new container
    console.log("About to release " + containerName);

    exec(command, function(err, stdout, stderr) {

      if (err != null) console.log(err);

      console.log(containerName + " successfully released");

      success();

    });

  });

}
