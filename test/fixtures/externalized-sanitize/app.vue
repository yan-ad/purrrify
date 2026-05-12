<template>
  <div id="sanitized" v-sanitize-html="dirtyHtml" />
</template>

<script setup>
const dirtyHtml = '<p>Hello</p>' + '<script>alert(1)<' + '/script>'
</script>
