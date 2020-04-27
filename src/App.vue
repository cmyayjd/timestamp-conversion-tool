<template>
  <div id="app">
    <div class="logo">
      <img alt="author logo" src="./images/author.png">
    </div>
    <h1>时间戳批量转换小工具</h1>
    <div class="text-container">
      <div class="text" ref="drag">
        <textarea @focus="textareaFocus('left')" @blur="textareaBlur('left')" v-model="left.content"></textarea>
        <p class="centHid" :class="{ show: !left.isFocus && left.content == ''}">请把需要转换的文件拖进这里</p>
      </div>
      <div class="text">
        <textarea @focus="textareaFocus('right')" @blur="textareaBlur('right')" v-model="right.content"></textarea>
        <p class="centHid" :class="{ show: !right.isFocus && right.content == ''}">转化后的结果</p>
      </div>
    </div>
    <div class="action-btns">
      <div class="loadFile">
        <label for="loadFileBtn">
          <input type="file" accept=".txt" id="loadFileBtn" ref="fileInput" @change="readFile"/>
          <div class="button">上传文件</div>
        </label>
      </div>
      <div class="button" @click="batchConvert">批量转换</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      left: {
        content: '',
        isFocus: false
      },
      right: {
        content: '',
        isFocus: false
      }
    }
  },
  mounted(){
    let drag = this.$refs.drag
    drag.addEventListener('dragover', e => {
      e.preventDefault()
    })
    drag.addEventListener('dragleave', e => {
      e.preventDefault()
    })
    drag.addEventListener('drop', e => {
      e.preventDefault()
      console.log(e.dataTransfer.files)
      const file = e.dataTransfer.files[0]
      if(file){
        this.readFromText(file)
          .then(result => {
            this.left.content = result
          })
      }
    })
  },
  methods: {
    // 获取焦点
    textareaFocus(id){
      this[id].isFocus = true
    },
    // 失去焦点
    textareaBlur(id){
       this[id].isFocus = false
    },
    // 批量转换
    batchConvert(){
      let leftContent = this.left.content
      if(leftContent != ''){
        let rightContent = leftContent.split('\n').map(timestap => {
          return this.transTimestampToDate(timestap)
        })
        this.right.content = rightContent.join('\n')
      }
    },
    // 将时间戳转为日期
    transTimestampToDate(timestap){
      let data = new Date(timestap * 1000)
      return data.toLocaleDateString().replace(/\//g, '-') + ' ' + data.toTimeString().substr(0,8)
    },
    // 读文件
    readFile(){
      let files = this.$refs.fileInput.files
      if(files && files[0]){
        this.readFromText(files[0])
          .then(result => {
            this.left.content = result
          })
      }
    },
    //从文本文件中读取内容
    readFromText(file){
      let reader = new FileReader()
      return new Promise((resolve, inject) => {
        reader.readAsText(file)
        reader.onload = function(){
          resolve(this.result)
        }
      })
    }
  }
}
</script>

<style lang="less">
*{
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
  input, textarea{
    outline: none;
  }
}

.logo{
  width: 140px;
  height: 140px;
  border-radius: 50%;
  margin: 40px auto 0;
  overflow: hidden;
  img{
    display: block;
    width: 100%;
  }
}

h1{
  font-size: 24px;
  text-align: center;
  line-height: 80px;
  letter-spacing: 2px;
}

.text-container{
  display: flex;
  width: 720px;
  margin: 18px auto 0;
  justify-content: space-between;
  .text{
    position: relative;
    width: 340px;
    textarea{
      width: 100%;
      height: 200px;
      padding: 10px;
      border-radius: 2px;
      overflow: auto;
      vertical-align: top;
      resize: none;
      background: #ffffff;
      border: 1px solid #c6cede !important;
    }
    .centHid{
      font-size: 14px;
      color: #c0c1c4;
      position: absolute;
      left: 13px;
      top: 10px;
      opacity: 0;
      transition: opacity 0.3s; 
      &.show{
        opacity: 1;
      }
    }
  }
}

.action-btns{
  width: 720px;
  display: flex;
  justify-content: flex-end;
  margin: 40px auto 0;
  .button{
    background: #409eff;
    width: 100px;
    height: 40px;
    border-radius: 4px;
    color: #ffffff;
    text-align: center;
    line-height: 38px;
    font-size: 14px;
    margin-left: 12px;
    cursor: pointer;
  }
  .loadFile{
    position: relative;
    input{
      position: absolute;
      width: 1px;
      height: 1px;
    }
  }
}
</style>
