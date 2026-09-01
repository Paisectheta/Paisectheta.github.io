---
layout: page
title: Blog
permalink: /blog/
intro: Longer notes, experiments, and write-ups.
sidebar_sections:
  - label: All posts
    url: "#all-posts"
---

## All posts

<div class="content-list">
  {% assign blog_items = site.posts | where_exp: "item", "item.content_type == nil or item.content_type == 'blog'" %}
  {% for item in blog_items %}
  <article class="content-list-item">
    <p class="post-meta">Blog{% if item.categories %} · {{ item.categories | join: ', ' }}{% endif %}</p>
    <h2><a href="{{ item.url | relative_url }}">{{ item.title }}</a></h2>
    {% if item.excerpt %}
    <p>{{ item.excerpt | strip_html | truncatewords: 28 }}</p>
    {% endif %}
  </article>
  {% endfor %}
</div>
