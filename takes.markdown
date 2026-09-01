---
layout: page
title: Takes
permalink: /takes/
intro: Short opinions, quick notes, and rough ideas.
sidebar_sections:
  - label: All takes
    url: "#all-takes"
---

## All takes

<div class="content-list">
  {% assign take_items = site.posts | where: "content_type", "take" %}
  {% for item in take_items %}
  <article class="content-list-item">
    <p class="post-meta">Take{% if item.categories %} · {{ item.categories | join: ', ' }}{% endif %}</p>
    <h2><a href="{{ item.url | relative_url }}">{{ item.title }}</a></h2>
    {% if item.excerpt %}
    <p>{{ item.excerpt | strip_html | truncatewords: 28 }}</p>
    {% endif %}
  </article>
  {% endfor %}
</div>
