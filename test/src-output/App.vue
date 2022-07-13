<template>
  <div>
    <Head />
    <hr />
    <Body />
    <hr />
    <!-- <Footer /> -->
  </div>
</template>

<script>
import Head from './components/head.vue';
import Body from './components/body.vue';
// import Footer from './components/footer';
export default {
  components: {
    Head,
    Body,
    // Footer,
  },
}
</script>
