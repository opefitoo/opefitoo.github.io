# Use a lightweight nginx image
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy your website content into nginx web directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 3001
