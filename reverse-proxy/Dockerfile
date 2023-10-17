FROM nginx:bookworm

EXPOSE 80
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]