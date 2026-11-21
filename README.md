# Opefitoo Personal Website

This is the source code for Mehdi Benammar's personal website, built with Jekyll and hosted on GitHub Pages.

## Features

- Responsive design
- Blog functionality with Jekyll
- GitHub Pages deployment
- SEO optimization

## Local Development

### Prerequisites

- Ruby version 2.5.0 or higher
- Bundler
- Jekyll

### Setup

1. Clone this repository
```bash
git clone https://github.com/opefitoo/opefitoo.github.io.git
cd opefitoo.github.io
```

2. Install dependencies
```bash
bundle install
```

3. Run the site locally
```bash
bundle exec jekyll serve
```

4. Visit `http://localhost:4000` in your browser

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment is handled by the GitHub Actions workflow defined in `.github/workflows/github-pages.yml`.

## Directory Structure

- `_includes/`: Reusable components like headers and footers
- `_layouts/`: Templates for different page types
- `_posts/`: Blog post files
- `_sass/`: SCSS partials
- `assets/`: Static assets like images, CSS, and JS
- `_config.yml`: Jekyll configuration
- `Gemfile`: Ruby gem dependencies

## Adding Content

### Blog Posts

To add a new blog post, create a new file in the `_posts` directory with the format `YYYY-MM-DD-title.md`. For example:

```markdown
---
layout: post
title: "My New Post"
date: 2025-06-03 12:00:00 +0200
categories: blog
---

Post content goes here...
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
