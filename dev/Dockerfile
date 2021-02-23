FROM node:14

WORKDIR /app

# customize dev environment
RUN sed -i.orig -e "s/# alias ll=/alias ll=/" ~/.bashrc

# keep node_modules directory inside container
RUN mkdir -p /tmp/node_modules

EXPOSE 3000

CMD dev/startup.sh
