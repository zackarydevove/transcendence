# set the base image to Debian
FROM debian:latest

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# update the repository sources list
# and install dependencies
RUN apt-get update \
    && apt-get install -y curl postgresql-client \
    && apt-get -y autoclean

# nvm environment variables
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 18.17.0

# install nvm
RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash

# install node and npm
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default \
    && npm install -g pnpm \
    && pnpm config set store-dir ~/.pnpm-store

# add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN mkdir -p /root/app
WORKDIR /root/app

COPY . /root/app/
COPY docker/nest/start.sh /app/start.sh
# # the avatar storage folder needs to be created if not already present
COPY apps/backend/src/public/default.png /public/default.png

# # only for clean up, this image is only for backend
RUN rm -rf /app/apps/frontend

RUN chmod +x /app/start.sh

# # Prevents "cross-device link not permitted" error from pnpm when using volumes
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store pnpm install


CMD ["bash", "/app/start.sh"]
