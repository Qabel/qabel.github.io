---
title: Pages
permalink: /pages/
---
<ul class="foo">
{% assign docs = site.docs | sort: 'title' %}
{% for doc in docs %}
  <li><a href="{{doc.url}}">{{doc.title}}</a></li>
{% endfor %}
</ul>