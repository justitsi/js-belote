#################################################
# Container to build application code
#################################################
FROM node:20 as node-build
WORKDIR /app

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

# Build frontend
COPY . ./
RUN npm run build
LABEL stage=builder

#################################################
# Container to host application code in
# production
#################################################
FROM nginx as frontend-production

EXPOSE 80
COPY ./nginx_config/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=node-build /app/build /usr/share/nginx/html/

ENTRYPOINT ["nginx", "-g", "daemon off;"]