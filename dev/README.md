# Local Development

1. Run the app in a docker-based development environment from the project root:
  `./dev/dockdev.sh`

2. Run a command within the container (e.g. npm commands)
  `docker exec -it $DOCKER_CONTAINER <command>`
  e.g.
  `docker exec -it $DOCKER_CONTAINER npm install package`

#TODO: add start / cmd / stop to dockdev.sh
