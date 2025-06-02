# Opefitoo Website

Modern website for Opefitoo (Open Financial Tools), providing software solutions for healthcare professionals and consulting services.

## Features

- Responsive modern design
- Mobile-friendly interface
- Beautiful animations and transitions
- Dark mode support

## Docker Deployment

The website can be easily deployed using Docker with the included `docker-compose.yml` file.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Deployment Steps

1. Clone this repository:
   ```bash
   git clone https://github.com/opefitoo/opefitoo.github.io.git
   cd opefitoo.github.io
   ```

2. Start the web server using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the website at http://localhost:8080

4. To stop the server:
   ```bash
   docker-compose down
   ```

### Production Deployment

For production deployment:

1. Update the `NGINX_HOST` in the `docker-compose.yml` file to match your domain name.

2. If you need HTTPS, uncomment the certbot service in the docker-compose file and run:
   ```bash
   docker-compose up -d
   ```

3. Set up a reverse proxy like Nginx or use a service like Cloudflare for SSL/TLS.

## Development

To make changes to the website:

1. Modify the HTML/CSS/JS files directly
2. The changes will be immediately reflected when you refresh the browser

## Custom CSS

The website uses a custom CSS file (`assets/css/custom.css`) that adds modern design elements:

- Modern color scheme
- Card-based design
- Smooth animations and transitions
- Improved typography using Inter font
- Dark mode support

## License

See the `LICENSE.txt` file for details.

## Contact

For any questions or inquiries, please contact:
- Email: info@opefitoo.com
- Phone: (+352) 691-308-072
