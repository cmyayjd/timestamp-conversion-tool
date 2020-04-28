<template>
  <div id="app" ref="app">
    <header class="header">
      <div class="logo">
        <img alt="logo" src="./images/author.png" />
      </div>
      <div class="loader">
        <svg width="60px" height="60px" viewBox="0 0 80 80">
          <path class="loader-bg" d="M40,10C57.351,10,71,23.649,71,40.5S57.351,71,40.5,71 S10,57.351,10,40.5S23.649,10,40.5,10z"/>
          <path id="loader-circle" ref="loader" d="M40,10C57.351,10,71,23.649,71,40.5S57.351,71,40.5,71 S10,57.351,10,40.5S23.649,10,40.5,10z"/>
        </svg>
			</div>
    </header>
    <div class="main">
      <div class="logo">
        <img alt="author logo" src="./images/author.png" />
      </div>
      <h1>时间戳批量转换小工具</h1>
      <div class="text-container">
        <div class="text" ref="drag">
          <textarea
            @focus="textareaFocus('left')"
            @blur="textareaBlur('left')"
            v-model="left.content"
          ></textarea>
          <p
            class="centHid"
            :class="{ show: !left.isFocus && left.content == '' }"
          >
            请把需要转换的文件拖进这里
          </p>
        </div>
        <div class="text">
          <textarea
            @focus="textareaFocus('right')"
            @blur="textareaBlur('right')"
            v-model="right.content"
          ></textarea>
          <p
            class="centHid"
            :class="{ show: !right.isFocus && right.content == '' }"
          >
            转化后的结果
          </p>
        </div>
      </div>
      <div class="action-btns">
        <div class="loadFile">
          <label for="loadFileBtn">
            <input
              type="file"
              accept=".txt"
              id="loadFileBtn"
              ref="fileInput"
              @change="readFile"
            />
            <div class="button">选择文件</div>
          </label>
        </div>
        <div class="button" @click="batchConvert">批量转换</div>
        <div class="button" @click="clear">清空</div>
      </div>
    </div>
    <div class="cursor cursor-point" ref="cursorPoint">
      <img alt="cursor img" src="./images/author.png" />
    </div>
    <div class="cursor cursor-round" ref="cursorRound">
      <div class="inner"></div>
    </div>
  </div>
</template>

<script>
const lerp = (x, y, diff) => {
  return (1 - diff) * x + diff * y;
};

import Path from './util/util'

export default {
  name: "App",
  data() {
    return {
      left: {
        content: "",
        isFocus: false,
      },
      right: {
        content: "",
        isFocus: false,
      },
    };
  },
  mounted() {
    this.initLoad()
    this.initCursor()
    this.initDrag()
  },
  methods: {
    textareaFocus(id) {
      this[id].isFocus = true;
    },
    textareaBlur(id) {
      this[id].isFocus = false;
    },
    batchConvert() {
      let leftContent = this.left.content;
      if (leftContent != "") {
        let rightContent = leftContent.split("\n").map((timestap) => {
          return this.transTimestampToDate(timestap);
        });
        this.right.content = rightContent.join("\n");
      }
    },
    transTimestampToDate(timestap) {
      let data = new Date(timestap * 1000);
      return (
        data.toLocaleDateString().replace(/\//g, "-") +
        " " +
        data.toTimeString().substr(0, 8)
      );
    },
    readFile() {
      let files = this.$refs.fileInput.files;
      if (files && files[0]) {
        this.readFromText(files[0]).then((result) => {
          this.left.content = result;
        });
      }
    },
    readFromText(file) {
      let reader = new FileReader();
      return new Promise((resolve, inject) => {
        reader.readAsText(file);
        reader.onload = function() {
          resolve(this.result);
        };
      });
    },
    clear() {
      this.left.content = "";
      this.right.content = "";
    },
    initLoad(){
      const app = this.$refs.app
      app.classList.add('loading')
      const loader = new Path(this.$refs.loader)
      let progress = 0
      let interval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 0.1, 1)
        loader.progress(progress)

        if(progress == 1){
          app.classList.remove('loading')
          app.classList.add('loaded')
          clearInterval(interval)
        }
      }, 100)
    },
    initDrag(){
      let drag = this.$refs.drag;
      drag.addEventListener("drop", (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
          this.readFromText(file).then((result) => {
            this.left.content = result;
          });
        }
      });
    },
    initCursor() {
      let clientX = -100;
      let clientY = -100;
      let lastX = 0;
      let lastY = 0;
      const cursorPoint = this.$refs.cursorPoint;
      const cursorRound = this.$refs.cursorRound;
      document.addEventListener("mousemove", (e) => {
        clientX = e.clientX;
        clientY = e.clientY;
      });
      const render = () => {
        cursorPoint.style.transform = `translate(${clientX}px, ${clientY}px)`;
        lastX = lerp(lastX, clientX - 16, 0.2);
        lastY = lerp(lastY, clientY - 16, 0.2);
        cursorRound.style.transform = `translate(${lastX}px, ${lastY}px)`;
        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
    },
  },
};
</script>

<style lang="less">
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
  cursor: none;
  input,
  textarea {
    outline: none;
  }
}

html, body, #app{
  height: 100%;
}

.header{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1800;
  background: #ffffff;
  .logo, .loader{
    position: absolute;
    left: 0;
    width: 100%;
    opacity: 0;
  }
  .logo{
    top: 100px;
    left: calc(50% - 120px);
    width: 240px;
    height: 240px;
    border-radius: 50%;
    overflow: hidden;
    img{
      display: block;
      width: 100%;
      margin: 0 auto;
    }
  }
  .loader{
    bottom: 20%;
    svg{
      display: block;
      margin: 0 auto;
      path{
        fill: none;
        stroke-width: 6;
        &.loader-bg{
          stroke: #ddd;
        }
        &#loader-circle{
          transition: stroke-dashoffset 0.2s;
          stroke: #4e3845;
        }
      }
    }
  }
}

.loaded .header{
  animation: animLoadedHeader 1s cubic-bezier(0.7,0,0.3,1) forwards;
}

@keyframes animLoadedHeader {
  to { 
    transform: translate3d(0,-100%,0); 
  }
}

.loading{
  .header{
    .logo, .loader{
      opacity: 1;
      -webkit-animation: animInitialHeader 1s cubic-bezier(0.7,0,0.3,1) both;
      animation: animInitialHeader 1s cubic-bezier(0.7,0,0.3,1) both;
    }
    .loader{
      -webkit-animation-delay: 0.2s;
      animation-delay: 0.2s;
    }
  }
}
.loaded{
  .header{
    .logo, .loader{
      opacity: 1;
    }
    .logo{
      transform-origin: 50% 0;
      animation: animLoadedLogo 1s cubic-bezier(0.7,0,0.3,1) forwards;
    }
    .loader{
      animation: animLoadedLoader 0.5s cubic-bezier(0.7,0,0.3,1) forwards;
    }
  }
}

@keyframes animInitialHeader {
	from { 
    opacity: 0; 
    transform: translate3d(0,800px,0); 
  }
}

@keyframes animLoadedLogo {
	to { 
    transform: translate3d(0,100%,0) translate3d(0,50px,0) scale3d(0.65,0.65,1); 
  }
}

@keyframes animLoadedLoader {
	to { 
    opacity: 0; 
    transform: translate3d(0,-100%,0) scale3d(0.3,0.3,1); 
  }
}

.main {
  .logo {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    margin: 40px auto 0;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
    }
  }

  h1 {
    font-size: 24px;
    text-align: center;
    line-height: 80px;
    letter-spacing: 2px;
  }

  .text-container {
    display: flex;
    width: 720px;
    margin: 18px auto 0;
    justify-content: space-between;
    .text {
      position: relative;
      width: 340px;
      textarea {
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
      .centHid {
        font-size: 14px;
        color: #c0c1c4;
        position: absolute;
        left: 13px;
        top: 10px;
        opacity: 0;
        transition: opacity 0.3s;
        &.show {
          opacity: 1;
        }
      }
    }
  }

  .action-btns {
    width: 720px;
    display: flex;
    justify-content: flex-end;
    margin: 40px auto 0;
    .button {
      background: #409eff;
      width: 100px;
      height: 40px;
      border-radius: 4px;
      color: #ffffff;
      text-align: center;
      line-height: 38px;
      font-size: 14px;
      margin-left: 12px;
    }
    .loadFile {
      position: relative;
      input {
        position: absolute;
        width: 1px;
        height: 1px;
      }
    }
  }
}

.loaded .main{
  .logo, h1, .text-container, .action-btns{
    animation: animLoadedContent 1s cubic-bezier(0.7,0,0.3,1) both;
  }
  .logo{
    animation-delay: 0.1s;
  }
  h1{
    animation-delay: 0.15s;
  }
  .text-container{
    animation-delay: 0.2s;
  }
  .action-btns{
    animation-delay: 0.25s;
  }
}

@keyframes animLoadedContent {
	from { 
    opacity: 0; 
    transform: translate3d(0,200px,0); 
  }
}

.cursor {
  position: fixed;
  left: 0;
  top: 0;
  pointer-events: none;
  &.cursor-point {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    z-index: 1200;
    img {
      display: block;
      width: 100%;
    }
  }
  &.cursor-round {
    position: fixed;
    width: 60px;
    height: 60px;
    z-index: 1000;
    background: #4e3845;
    opacity: 0.7;
    border-radius: 50%;
    .inner {
      position: absolute;
      top: 8px;
      left: 8px;
      width: 50px;
      height: 50px;
      background: #ffffff;
      border-radius: 50%;
    }
  }
}
</style>
