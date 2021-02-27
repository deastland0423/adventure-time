# Local Development

You can run the front-end app in a docker container by building and running the Dockerfile here.

1. Create a symlink for the node_modules directory. This keeps them inside the container and improves performance.
`ln -s /tmp/node_modules`

2. Build the docker image
`docker build dev -t nodedev`

3. Start up the app in the local container.

  Starting it for the first time:

  `docker run -it --name mynode -v `pwd`:/app -p 3000:3000 nodedev`

You can access the app locally now at http://localhost:3000/

* If the container has already been started, you may see an error saying the name is in use.
  If you see this, just run:
  `docker start mynode`

  and then you can watch the 'yarn start' output with:
  `docker logs -f mynode`

* To get a shell inside the container (e.g. to run yarn commands), run: `docker exec -it mynode bash`
