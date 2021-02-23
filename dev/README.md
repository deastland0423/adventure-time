# Local Development

You can run the front-end app in a docker container by building and running the Dockerfile here.

1. Create a symlink for the node_modules directory. This keeps them inside the container and improves performance.
`ln -s /tmp/node_modules`

2. Build the docker image
`docker build dev -t nodedev`

3. Start up the app in the local container.
`docker run --rm -it --name mynode -v `pwd`:/app -p 3000:3000 nodedev`

You can access the app locally now at http://localhost:3000/

* To get a shell inside the container, run: `docker exec -it mynode bash`
