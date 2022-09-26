<template>
  <el-form ref="form" :model="form" style="padding:0 16px">
    <el-row class="main-row">
      <el-col :span="8">
        <el-card class="box-card">
          <el-form-item label="Service Name:">
            <el-select
              v-model="form.service_name"
              placeholder="Please select service"
              style="width: 300px"
              @change="serviceOnChange"
            >
              <el-option
                v-for="item in serviceOptions"
                :key="item.service_name"
                :label="item.service_name"
                :value="item.service_name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Method Name:">
            <el-select
              v-model="form.method"
              placeholder="Please select method"
              @change="methodOnChange"
              style="width: 300px"
              filterable
            >
              <el-option
                v-for="item in methodOptions"
                :key="item.method"
                :label="item.method"
                :value="item.method"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-divider></el-divider>

          <el-table
            :data="historyData"
            :row-class-name="tableRowClassName"
            :show-header="false"
            height="600"
            v-loading="loading"
            scrollbar-always-on
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template #default="scope">
                <div style="width: 800px; margin: auto">
                  <div style="text-align: left; margin-top: 10px">Request:</div>
                  <json-viewer :value="scope.row.request"> </json-viewer>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="description"> </el-table-column>

            <el-table-column prop="interval"> </el-table-column>

            <el-table-column>
              <template #default="scope">
                <el-button
                  size="small"
                  @click="handleLoad(scope.$index, scope.row)"
                  type="primary"
                  >Load</el-button
                >
                <!-- <el-button
          size="small"
          @click="handleEdit(scope.$index, scope.row)" type="danger">Delete</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card class="box-card">
          <el-row>
            <el-form-item style="width: 100%">
              <el-col :span="8" style="text-align: left">
                <el-form-item
                  label="Timeout"
                  prop="request_timeout"
                  :rules="[
                    {
                      type: 'number',
                      message: 'request timeout must be a number',
                    },
                  ]"
                >
                  <el-input
                    v-model.number="form.request_timeout"
                    style="width: 180px"
                    placeholder="Please enter millis"
                    type="text"
                    @blur="timeoutBlur"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8" style="text-align: left">
                <el-form-item
                  label="Times"
                  style="margin-left: 15px"
                  prop="request_times"
                >
                  <el-input-number
                    v-model="form.request_times"
                    :min="1"
                    :max="1000000"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8" style="text-align: left">
                <el-form-item
                  label="Concurrent"
                  style="margin-left: 0px"
                  prop="request_concurrent"
                >
                  <el-input-number
                    v-model="form.request_concurrent"
                    :min="1"
                    :max="10"
                  />
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="6" style="text-align: center">
              <label>Failed Count </label>
              <el-tag type="warning">{{ response.metrics.failed }}</el-tag>
            </el-col>
            <el-col :span="6" style="text-align: center">
              <label>Success Rate </label>
              <el-tag>{{ response.metrics.success_rate }}</el-tag>
            </el-col>
            <el-col :span="6" style="text-align: center">
              <label>Elapsed Time </label>
              <el-tag>{{ response.metrics.elapsed_time }}</el-tag>
            </el-col>
            <el-col :span="6" style="text-align: center">
              <label>Average Time </label>
              <el-tag>{{ response.metrics.average_time }}</el-tag>
            </el-col>
          </el-row>
          <el-row>
            <h1>Request Metadata</h1>
          </el-row>

          <el-row>
            <el-form-item style="width: 100%">
              <el-input
                v-model="form.headers"
                class="json-text json-class-textarea-header"
                type="textarea"
                style="width: 100%"
              />
            </el-form-item>
          </el-row>

          <el-row>
            <el-col :span="12" style="text-align: left">
              <h1>Request Data</h1></el-col
            >

            <el-col
              :span="12"
              style="
                display: flex;
                align-items: center;
                justify-content: flex-end;
              "
            >
              <el-button
                type="text"
                @click="webFormClickHandler"
                >WebForm</el-button
              ></el-col
            >
          </el-row>

          <el-row>
            <el-form-item style="width: 100%">
              <el-input
                v-model="form.request_data"
                class="json-text json-class-textarea-request"
                type="textarea"
                style="width: 100%"
              />
            </el-form-item>
          </el-row>
          <el-button
            type="primary"
            id="invoke"
            size="medium"
            @click="handleInvoke"
            >Invoke</el-button
          >
          <el-button
            type="primary"
            id="invoke"
            size="medium"
            @click="handleReset"
            >Reset</el-button
          >
        </el-card>
      </el-col>
      <el-col :span="6" class="response-col">
        <el-card class="box-card">
          <el-scrollbar height="800px">
            <!-- <el-row>
    <h2>Response Trailers</h2>
    <el-col :span="24">
      <div  style=" text-align: left;" >
        {{response.trailers}}
      </div>
  </el-col>
   </el-row> -->

            <el-row>
              <h2>Response Headers</h2>
              <el-col :span="24">
                <json-viewer
                  :value="response.headers"
                  copyable
                  style="text-align: left"
                >
                </json-viewer>
              </el-col>
            </el-row>

            <el-row>
              <h2>Response Data</h2>
              <el-col :span="24">
                <json-viewer
                  :value="response.data"
                  copyable
                  style="text-align: left"
                >
                </json-viewer>
              </el-col>
            </el-row>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>
  </el-form>

  <el-dialog
    title="Request Form"
    v-model="dialogVisible"
    align-center
  >
      <div id="grpc-form">
      <div id="grpc-request-form"></div>
    </div>
  </el-dialog>
</template>
<style>
.json-class-textarea-header .el-textarea__inner {
  height: 180px;
}
.json-class-textarea-request .el-textarea__inner {
  height: 300px;
}
.el-table .warning-row {
  background: oldlace;
}
.box-card {
  height: 800px;
}

.el-table .success-row {
  background: #f0f9eb;
}
#invoke {
  margin-top: 0px;
}
.header-field-name {
  background-color: gray;
}
.main-row {
  margin-left: -20px;
  margin-right: -20px;
}
</style>
<script>
  import { getServices,getMethodNames,getHistoriesData,invoke,getMetadata } from "../../http";
  import{ initGRPCForm } from "../../utils/webform.js"
  import { ElMessage } from 'element-plus';
  export default {
    data() {
      return {
        dialogVisible: false,
        form: {
         service_name:'',
         method:'',
         headers:'{}',
         request_data:'{}',
         request_times:1,
         request_timeout:3000,
         request_concurrent:1
        },
        loading: false,
        metadata:{},
        response:{
          data:"{}",
          headers:"{}",
          trailers:"",
          metrics:{
            success: 1,
            failed: 0,
            success_rate: '100%',
            elapsed_time:'0ms',
            average_time:'0ms'
          }
        },
        methodOptions:[],
        serviceOptions: [],
        historyData: []
      }
      },
      created() {
      getServices().then(res => { 
       this.serviceOptions=res.data;
      });
      },
      methods: {
        handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
        },
        handleDataInsert(value){
          this.form.request_data=value
        },
        webFormClickHandler(){
          if(this.form.service_name==''||this.form.method==''){
            return
          }
          this.dialogVisible=true
          this.$nextTick(() => {
            initGRPCForm(this.metadata,this.handleDataInsert);
            rebuildRequestForm(JSON.parse(this.form.request_data),false)
          })
        },
        serviceOnChange(){
        getMethodNames(this.form.service_name).then(res => { 
          this.form.method='';
          this.methodOptions=res.data;
        });
        },
        methodOnChange(){
          this.loading=true
          getHistoriesData(this.form.service_name,this.form.method).then(res => { 
          this.historyData={};
          this.historyData=res.data;
          this.loading=false
        });
        getMetadata(this.form.service_name,this.form.method).then(res => { 
          if(res.data.request==''){
            this.form.request_data='{}'
          }else{
            this.metadata=res.data.request
          }
       
        });
        },
      handleLoad(index, row) {
        this.form.request_data=row.request==''?'{}':row.request
        this.form.headers=row.request_headers==''?'{}':row.request_headers
        this.response.data=row.response
        this.response.headers=row.response_headers
      },
      timeoutBlur(){
        if(this.form.request_timeout==''|| this.form.request_timeout==0){
          this.form.request_timeout=3000
        }
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      handleReset(){
        getMetadata(this.form.service_name,this.form.method).then(res => { 
            this.metadata=res.data.request
            this.form.headers='{}'
            this.response.data=''
            this.response.headers=''
            this.form.request_data='{}'
        });
      },
      handleInvoke(){
        this.$refs['form'].validate((valid) => {
        if (valid) {
        if(this.form.service_name==''||this.form.method==''){
           ElMessage({
             message: 'Please select service name and method',
            type: 'warning',
          });
          return
        }
        if(!this.isJSON(this.form.request_data)){
          ElMessage({
             message: 'Request Data must be json string',
            type: 'warning',
          });
          return
        }
        if(!this.isJSON(this.form.headers)){
          ElMessage({
             message: 'Request metadata must be json string',
            type: 'warning',
          });
          return
        }
      invoke(this.form).then(res => { 
          this.response=res.data;
          ElMessage({
             message: 'api invoke success',
            type: 'success',
          });
          this.methodOnChange()
        });
        }
        })

      },
      isJSON(str) {
        if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }

        } catch(e) {
            console.log('error：'+str+'!!!'+e);
            return false;
        }
        }
    },
      tableRowClassName({row, rowIndex}) {
        console.log(row.status);
        if (row.status == 0){
          return 'success-row';
        } else {
          return 'warning-row';
        }
     },
  }
  }
  
</script>

