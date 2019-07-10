<template>
    <div id="post">
        <!--贴子详情页面-->
        <score-post :data="dynamic_id"></score-post>
        <!--<lfl-footer></lfl-footer>-->
    </div>
</template>

<script>
  export default {
    name:'post',
    data() {
      return {
        dynamic_id: '',
      }
    },
    computed: {},
    watch: {
      '$route.params.id'(data) {
        this.dynamic_id = data;
      }
    },
    created() {
      this.dynamic_id = this.$route.params.id;
    },
    mounted() {

    },
    methods: {}
  }
</script>

<style lang="stylus">
    #post {
        padding-top 70px
    }
</style>
