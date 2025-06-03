---
layout: default
title: Blog
permalink: /blog/
---

# Blog

<div class="blog-posts">
  {% if site.posts.size > 0 %}
    <ul class="post-list">
      {% for post in site.posts %}
      <li>
        <h2>
          <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </h2>
        <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
        <p>{{ post.excerpt | strip_html | truncatewords: 50 }}</p>
        <a href="{{ post.url | relative_url }}" class="read-more">Read more &rarr;</a>
      </li>
      {% endfor %}
    </ul>
  {% else %}
    <p>No posts yet. Check back soon!</p>
  {% endif %}
</div>
