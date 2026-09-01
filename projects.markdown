---
layout: page
title: Projects
permalink: /projects/
intro: Standalone project pages live here. For project updates, use regular posts in Blog.
sidebar_sections:
  - label: Standalone project pages
    url: "#standalone-project-pages"
---

## Standalone project pages

{% if site.projects and site.projects.size > 0 %}
<div class="content-list">
  {% assign project_pages = site.projects | sort: "title" %}
  {% for item in project_pages %}
  <article class="content-list-item">
    <p class="post-meta">Project page{% if item.categories %} · {{ item.categories | join: ', ' }}{% endif %}</p>
    <h2><a href="{{ item.url | relative_url }}">{{ item.title }}</a></h2>
    {% if item.excerpt %}
    <p>{{ item.excerpt | strip_html | truncatewords: 28 }}</p>
    {% endif %}
  </article>
  {% endfor %}
</div>
{% else %}
<p>No standalone project pages yet.</p>
{% endif %}
