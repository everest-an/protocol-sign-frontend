<template>
  <div class="pdf-content" :class="{ 'pdf-center': showMenu == false }" :style="cursor">
    <div class="modal" v-if="showModal" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <div class="part-1">
          <span class="input-label">Type</span>
          <input class="text-signature-input" type="text" placeholder="Type Signature" v-model="userName">
        </div>
        <div class="text-signature-container">
          <span class="eth-signed-by-text">Dsigned By:</span>
          <span class="sign-text">{{ userName || address }}</span>
          <span class="address-text">{{ address }}</span>
        </div>
        <div class="add-btn" @click="insertSign()">Insert</div>
      </div>
    </div>
    <div style="position: relative;" id="pdfContainer">
      <!-- 加载原生pdf -->
      <!-- <canvas id="pdf-canvas" class="canvas-location"></canvas> -->
      <!-- 删除按钮 -->
      <span class="delete" style="position: absolute;z-index: 1;color: red;cursor: pointer;" @click="deleteRect(index)"
        :style="'left:' + item.x + 'px;' + 'top:' + (item.y + item.index * (canvasHeight + item.index * 10) - 20) + 'px'"
        v-for="(item, index) in rectangles" :key="index">
        x
      </span>
      <!-- 待签名区域 -->
      <div v-if="placeMarkCopy && isRender">
        <div class="sign" @click="userSign(index)"
          :style="'left:' + item.x + 'px;' + 'top:' + (item.y + item.index * (canvasHeight + item.index * 10) - 20) + 'px;' + 'width:' + item.width + 'px;' + 'height:' + item.height + 'px'"
          v-for="(item, index) in placeMarkCopy" :key="index">
          Click to Sign
        </div>
      </div>

      <!-- 已签名区域 -->
      <div v-if="placeMarkSign.length > 0 && isRender">
        <div class="signed" :id="'signed' + item.signedIndex"
          :style="'left:' + item.x + 'px;' + 'top:' + (item.y - 20) + 'px;' + 'width:' + item.width + 'px;' + 'height:' + item.height + 'px'"
          v-for="(item, index) in placeMarkSign" :key="index">
          <div class="text-signature-container" style="border: none;">
            <span class="eth-signed-by-text">Dsigned By:</span>
            <span class="sign-text">{{ item.userName || address }}</span>
            <span class="address-text">{{ address }}</span>
          </div>
        </div>
      </div>

    </div>

    <div class="menu-bar" v-if="showMenu">
      <div class="item-bar">
        <div class="item-button">Signature Fields</div>
        <div class="nav-item" @click="signHandle(0)">
          <span>0xC50557…a579C7's</span>
          <div>Signature</div>
        </div>
      </div>
      <div class="item-bar">
        <div class="item-button">Date Signed</div>
        <div class="nav-item" @click="signHandle(1)">
          <span>0xC50557…a579C7's</span>
          <div>Date Signed</div>
        </div>
      </div>
      <div class="item-bar">
        <div class="item-button">Wallet Address</div>
        <div class="nav-item" @click="signHandle(2)">
          <span>0xC50557…a579C7's</span>
          <div>Wallet Address</div>
        </div>
      </div>
      <div class="item-bar">
        <div class="item-button">Text Field</div>
        <div class="nav-item" @click="signHandle(3)">
          <div>
            <span>0xC50557…a579C7's</span>
            <div>Text Field</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as PDF from "pdfjs-dist";
import signImg from "@/assets/sign_here.svg";
import clickImg from "@/assets/click_to_place.svg";
import entry from "pdfjs-dist/build/pdf.worker.entry";
import { baseURL } from '@/http'
let rectangles = [];
export default {
  name: "PDF",
  props: {
    showMenu: Boolean,
    placeMark: Array
  },
  data() {
    return {
      currentType: '',
      pdfDoc: null,
      pdfPages: null,
      divContent: '',
      cursor: 'default',
      isMenuClick: false,
      numPages: 1,
      canvasHeight: 0,
      canvasWidth: 0,
      canvasIndex: 0,
      rectangles: [],
      rect: { width: 200, height: 100, isResize: false },
      deleteStyle: '',
      ctxs: [],
      sizeDrag: 5,
      isRender: false,
      placeMarkCopy: null,
      placeMarkSign: [],
      showModal: false,
      userName: '',
      address: '',
      signIndex: null,
      signedIndex: 0
    }
  },
  mounted() {
    rectangles = [];
    PDF.GlobalWorkerOptions.workerSrc = entry;
    let address = localStorage.getItem('address');
    let str1 = address.substring(0, 10);
    let str2 = address.substring(address.length - 5);
    this.address = str1 + '...' + str2;
  },
  methods: {
    saveRectangles() {
      console.log(rectangles)
      this.$store.commit('SET_MARK', rectangles);
      this.rectangles = rectangles
    },
    deleteRect(index) {
      rectangles.splice(index, 1);
      this.redraw();
      this.rectangles = []
      this.rectangles = rectangles
    },
    redraw() {
      let that = this;
      let ctxs = this.ctxs;
      for (let i = 0; i < ctxs.length; i++) {
        ctxs[i].clearRect(0, 0, that.canvasWidth, that.canvasHeight);
      }
      for (const rect of rectangles) {
        // ctxs[0].fillStyle = 'red';
        // 设置线条样式为虚线
        ctxs[rect.index].setLineDash([5, 3]);
        //绘制签名区域
        ctxs[rect.index].fillStyle = 'rgba(0,0,0,0.1)';
        ctxs[rect.index].fillRect(rect.x, rect.y, rect.width, rect.height);
        //绘制矩形拖拽缩放区域
        ctxs[rect.index].fillStyle = "gray";
        ctxs[rect.index].fillRect(rect.x + rect.width - that.sizeDrag, rect.y + rect.height - that.sizeDrag, that.sizeDrag * 2, that.sizeDrag * 2);

        // 绘制路径的描边（即矩形边框）
        ctxs[rect.index].strokeStyle = "red";
        ctxs[rect.index].stroke();


        // 添加描述
        let text = "This is a Signature Area!";
        ctxs[rect.index].font = "bold 16px Arial";
        let textWidth = ctxs[rect.index].measureText(text).width;
        let textHeight = 16;
        ctxs[rect.index].fillStyle = "black";
        let centerX = rect.x + rect.width / 2 - textWidth / 2;
        let centerY = rect.y + rect.height / 2 + textHeight / 2;
        ctxs[rect.index].fillText(text, centerX, centerY);
      }
      that.rectangles = [];
      that.rectangles = rectangles

      //生成PDF并下载
      // const pdf = new JSPDF({
      //   orientation: "l",
      //   unit: "pt",
      //   format: [960, 540]
      // });
      // pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, 960, 540);
      // pdf.save('newPdf.pdf');
    },
    loadCanvas() {
      let that = this;
      // 获取所有的 绘制矩形的canvas 元素
      const pageContainer = document.querySelectorAll('.pageContainer');
      // console.log('pageContainer', pageContainer)
      // 循环遍历每个 div 元素
      let ctxs = [];
      pageContainer.forEach((item, index) => {
        // 添加点击事件监听器
        item.addEventListener('mousedown', (event) => {
          handleMouseDown(event, index)
        });
        item.addEventListener('mousemove', handleMouseMove);
        item.addEventListener('mouseup', handleMouseUp);
        item.addEventListener('click', (event) => {
          handleCanvasClick(event, index)
        });
        ctxs[index] = item.getContext('2d');
      });
      this.ctxs = ctxs;

      function handleMouseDown(event, index) {
        that.canvasIndex = index;
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        for (let i = rectangles.length - 1; i >= 0; i--) {
          const rect = rectangles[i];
          if (that.canvasIndex == rect.index) {
            // if (mouseX > rect.x && mouseX < rect.x + rect.width && mouseY > rect.y && mouseY < rect.y + rect.height) {
            if (mouseX > rect.x - that.sizeDrag && mouseX < rect.x + that.sizeDrag + rect.width && mouseY > rect.y - that.sizeDrag && mouseY < rect.y + rect.height + that.sizeDrag) {
              rect.isDragging = true;
              rect.offsetX = mouseX - rect.x;
              rect.offsetY = mouseY - rect.y;
              break;
            }
          }
        }
      }

      function handleMouseMove(event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        for (const rect of rectangles) {
          if (rect.isDragging) {
            let size = 10;//拖拽区域大小
            // 检查鼠标是否在调整大小的定位区域内 右下角

            if (
              rect.isResize == true ||
              mouseX > rect.x + rect.width - size &&
              mouseX < rect.x + rect.width + size &&
              mouseY > rect.y + rect.height - size &&
              mouseY < rect.y + rect.height + size
            ) {//在右下角 放大或者缩小矩形
              rect.isResize = true;
              if (mouseX - rect.x > 10 && mouseY - rect.y > 10) {
                rect.width = mouseX - rect.x;
                rect.height = mouseY - rect.y;
              }
              console.log('rect.width====', rect.width)
            } else {
              if (rect.isResize == true) {
                return
              }
              rect.x = mouseX - rect.offsetX;
              rect.y = mouseY - rect.offsetY;
            }
            // rect.x = mouseX - rect.offsetX;
            // rect.y = mouseY - rect.offsetY;
            // console.log('move', rectangles)
          }
        }
        that.redraw();
      }

      function handleMouseUp(event) {
        for (const rect of rectangles) {
          rect.isDragging = false;
          rect.isResize = false;
        }
        console.log(rectangles)
      }



      // canvas.addEventListener('click', handleCanvasClick);

      function handleCanvasClick(event, index) {
        that.canvasIndex = index;
        if (!that.isMenuClick) {
          return
        }
        that.cursor = 'cursor:default';

        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        // 检查是否点击在一个已存在的矩形内部
        for (let i = rectangles.length - 1; i >= 0; i--) {
          let rect = rectangles[i];
          if (that.canvasIndex == rect.index) {
            if (mouseX > rect.x && mouseX < rect.x + rect.width && mouseY > rect.y && mouseY < rect.y + rect.height) {
              // 如果是，将其设置为选中的矩形并返回
              console.log('矩形内点击')
              // selectedRectangle = rect;
              return;
            }
          }
        }
        const rect = { index, x: mouseX, y: mouseY, isDragging: false, ...that.rect };
        rectangles.push(rect);
        that.redraw();
        that.isMenuClick = false;
      }
    },

    loadFile(fileCode) {
      // console.log('pdfUrl===',this.pdfUrl)
      if (!fileCode) {
        // 加载PDF文档 本地文件
        let file = this.$store.state.pdfFile;
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (event) => {
          const data = new Uint8Array(event.target.result);
          let loadingTask = PDF.getDocument(data);
          loadingTask.promise.then((pdf) => {
            this.pdfDoc = pdf // 保存加载的pdf文件流
            this.pdfPages = this.pdfDoc.numPages // 获取pdf文件的总页数
            this.$nextTick(() => {
              this.renderPage(pdf);
            });
          });
        };
      } else {

        // this.$axios.post('/web/contract/loadContract', {
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        //   data: {
        //     'fileCode': fileCode
        //   }
        // }).then((res) => {
        //   let url = window.URL.createObjectURL(new Blob([res], { type: 'application/pdf' }));
        //   // FileSaver.saveAs(new Blob([res], { type: 'application/pdf' }), '1.pdf');
        //   let loadingTask = PDF.getDocument(url);
        //   loadingTask.promise.then((pdf) => {
        //     this.pdfDoc = pdf // 保存加载的pdf文件流
        //     this.pdfPages = this.pdfDoc.numPages // 获取pdf文件的总页数
        //     this.$nextTick(() => {
        //       this.renderPage(pdf);
        //     });
        //   });
        // }).catch(function (error) {
        //   console.log(error);
        // });

        this.$axios({
          url: baseURL + '/web/contract/loadContract',
          method: 'post',
          responseType: 'blob',
          header: { "Content-Type": "multipart/form-data" },
          data: {
            'fileCode': fileCode
          }
        }).then(res => {
          let url = window.URL.createObjectURL(new Blob([res], { type: 'application/pdf' }));
          let loadingTask = PDF.getDocument(url);
          loadingTask.promise.then((pdf) => {
            this.pdfDoc = pdf // 保存加载的pdf文件流
            this.pdfPages = this.pdfDoc.numPages // 获取pdf文件的总页数
            this.$nextTick(() => {
              this.renderPage(pdf);
            });
          });
          // resolve(res)
        }).catch(() => {
          // resolve(false);
        });

      }
    },

    async renderPage(pdf) {

      // //绘制矩形的画布
      // const canvasRect = document.getElementById('canvas');

      // 获取 PDF 的总页数
      const numPages = pdf.numPages;
      this.numPages = numPages;

      // 获取容器元素
      const container = document.getElementById('pdfContainer');

      // 清空容器
      // container.innerHTML = '';

      for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
        //创建一个包裹canvans的容器
        const pageContainer = document.createElement('div');
        pageContainer.id = 'pageContainer' + pageNumber;
        pageContainer.classList.add('page-container');
        // 创建一个新的 Canvas 元素
        const canvas = document.createElement('canvas');
        const canvasRect = document.createElement('canvas');
        canvas.id = 'page' + pageNumber;

        canvasRect.classList.add('pageContainer');
        canvasRect.id = 'pageRect' + pageNumber;
        canvasRect.style.position = 'absolute';
        canvasRect.style.left = '0';
        pageContainer.style.marginBottom = '10px';
        pageContainer.style.position = 'relative';

        // 将 Canvas 添加到容器中
        // container.appendChild(canvas);
        // container.appendChild(canvasRect);
        container.appendChild(pageContainer);

        pageContainer.appendChild(canvas);
        pageContainer.appendChild(canvasRect);

        // 获取当前页的数据
        const page = await pdf.getPage(pageNumber);

        // 获取页面的原始大小
        const viewport = page.getViewport({ scale: 1 });

        // 设置 Canvas 的大小以适应页面
        let width = viewport.width;
        let height = viewport.height;;
        canvas.width = width;
        canvas.height = height;
        canvasRect.width = width;
        canvasRect.height = height;
        this.canvasWidth = width;
        this.canvasHeight = height;
        pageContainer.style.width = width + 'px';
        pageContainer.style.height = height + 'px';
        // this.divContent = `width:${canvas.width}px;height:${canvas.height}px`
        // 获取 Canvas 的上下文
        const context = canvas.getContext('2d');
        // 将页面渲染到 Canvas 上
        await page.render({ canvasContext: context, viewport });
        this.isRender = true
      }
      this.loadCanvas();
      this.placeMarkCopy = this.placeMark

      // const page = await pdf.getPage(1);
      // const viewport = page.getViewport({ scale: 1 });
      // canvas.width = viewport.width;
      // canvas.height = viewport.height;
      // canvasRect.width = canvas.width;
      // canvasRect.height = canvas.height;
      // this.divContent = `width:${canvas.width}px;height:${canvas.height}px`
      // const renderContext = {
      //   canvasContext: context,
      //   viewport: viewport,
      // };
      // await page.render(renderContext);

    },
    //点击工具栏签名插件
    signHandle(index) {
      if (index == 0) {
        this.cursor = `cursor:url(${signImg}),pointer`;
      } else {
        this.cursor = `cursor:url(${clickImg}),pointer`;
      }
      this.isMenuClick = true;
    },
    //待签名用户点击签名区域
    userSign(index) {
      console.log(index)
      this.userName = '';
      this.signIndex = index;
      this.showModal = true
    },
    //添加签名
    insertSign() {
      let str = JSON.stringify(this.placeMarkCopy[this.signIndex]);
      this.placeMarkCopy.splice(this.signIndex, 1);
      this.showModal = false;
      let obj = JSON.parse(str);
      obj.userName = this.userName;
      obj.signedIndex = this.signedIndex;
      this.signedIndex++;
      this.placeMarkSign.push(obj);

      this.$nextTick(() => {
        // 获取要移动的节点和目标父节点的引用
        const nodeToMove = document.getElementById('signed' + obj.signedIndex);
        let j = obj.index + 1;
        const targetParent = document.getElementById('pageContainer' + j);
        // console.log(nodeToMove)
        // console.log(targetParent)
        // 将节点移动到新的父节点下
        targetParent.appendChild(nodeToMove);
      })


    }
  },
}
</script>
<style scoped lang="scss">
.pdf-content {
  background: #eee;
  padding: 5px;
  // margin-top: 20px;
  position: relative;
  // cursor: url('@/assets/sign_here.svg'),pointer;
  cursor: default;
}

.text-signature-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  background: #fff;
  border: 1.31868px solid rgba(0, 0, 0, .1);
  box-sizing: border-box;
  border-radius: 15px;
  margin-top: 15px;
  padding: 12px 30px;

  .eth-signed-by-text {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: #e27019;
  }

  .sign-text {
    font-weight: 700;
    font-size: 26px;
    line-height: 39px;
    color: #373b46;
  }

  .address-text {
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    color: #6e7179;
  }
}

.modal {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999;
  margin: -5px;
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 600px;
    height: 400px;
    padding: 30px 51px;
    border-radius: 20px;
    box-shadow: 0 0 3px #868e96;
    background: #f9fbfc;
    box-sizing: border-box;

    .part-1 {
      display: flex;
      align-items: center;
    }


    .add-btn {
      position: absolute;
      right: 52px;
      bottom: 50px;
      background: black;
      border-radius: 8px;
      padding: 8px 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 450;
      font-size: 16px;
      border: 2px solid transparent;
      cursor: pointer;
    }

    .input-label {
      font-weight: 700;
      font-size: 20px;
      line-height: 24px;
      color: #373b46;
    }

    .text-signature-input {
      width: 100%;
      background: #fff;
      border: 1px solid #b5b9c6;
      box-sizing: border-box;
      border-radius: 11px;
      font-weight: 400;
      font-size: 20px;
      line-height: 24px;
      margin-left: 10px;
      padding: 12px 30px;
    }
  }
}

.move {
  background-color: red;
  width: 20px;
  height: 20px;
}

.pdf-center {
  display: flex;
  justify-content: center;
}

.canvas-location {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
}

.menu-bar {
  position: absolute;
  width: 250px;
  height: 100%;
  right: 0;
  top: 0;
  background: lightgray;
  padding: 10px;
  box-sizing: border-box;
}

.item-button {
  width: 100%;
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: gray;
}

.nav-item {
  text-align: left;
  margin-left: 30px;
  cursor: pointer;
}

.sign {
  position: absolute;
  z-index: 1;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.signed {
  position: absolute;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>