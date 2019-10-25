# Set nginx base image
FROM nginx

# Copy wait file 
ADD  wait-for-it.sh /wait-for-it.sh
RUN chmod +x wait-for-it.sh

# Copy custom configuration file from the current directory
COPY nginx.conf /etc/nginx/nginx.conf

# Wait and run nginx as demon
CMD ["/wait-for-it.sh","node:${PORT}","--","nginx", "-g", "daemon off;"]