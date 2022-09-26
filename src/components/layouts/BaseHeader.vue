<template>
<el-row class="full-width-heading"> 
      <div class="heading">
        <h1><img class="grpc-logo" src="../../assets/grpc-logo.png" alt="GRPC"> Web UI</h1>
          <h2>Connected to <span class="target">{{target}}</span></h2>
      </div>
</el-row>
</template>
<style scoped>
    .full-width-heading {
      width: 100%;
      background-color: #186064;
    }
    .heading {
      max-width: 2560px;
      margin: 0;
      padding: 32px 24px;
      color: white;
      background: #186064 no-repeat center/cover;
      /* url("../../assets/grpc-bg.svg") */
    }
     .heading h1 {
      font-weight: normal;
      font-size: 35px;
      margin: 0 0 12px 0;
      padding: 0;
    }

    .heading h2 {
      font-weight: normal;
      font-size: 24px;
      color: #c0f0ff;
      margin: 0;
      padding: 0;
    }
   .target {
      font-style: italic;
      color: #9ff;
      padding-left: 4px;
    }
    img.grpc-logo {
      width: 100px;
      margin-bottom: -8px;
      margin-right: 8px;
      margin-left: -70px;
      margin-top: 0px;
    }
</style>
<script lang="js">
  import { getTarget } from "../../http";

  export default {
    data() {
      return {
        target:'127.0.0.1:8080'
      }
    },
    created() {
      getTarget().then(res => { 
       this.target=res.data.target;
      });
    }
  }

</script>