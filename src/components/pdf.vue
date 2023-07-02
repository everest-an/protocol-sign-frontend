<template>
  <div class="pdf-content" :class="{ 'pdf-center': showMenu == false }" :style="cursor">
    <!-- pdf 点击签名区域的弹窗 -->
    <div class="modal" v-if="showModal" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <div class="tab-list">
          <button :class="{ 'btn-active': btnIndex == 0 }" @click="btnHandle(0)">Type</button>
          <div class="tab-options-divider"></div>
          <button :class="{ 'btn-active': btnIndex == 1 }" @click="btnHandle(1)">Draw</button>
          <div class="tab-options-divider"></div>
          <button :class="{ 'btn-active': btnIndex == 2 }" @click="btnHandle(2)">Upload</button>
        </div>
        <!-- 系统签名 -->
        <div class="sign-part" v-if="btnIndex == 0">
          <div class="part-1">
            <span class="input-label">Type</span>
            <input class="text-signature-input" type="text" placeholder="Type Signature" v-model="userName">
          </div>
          <div class="text-signature-container" style="padding: 12px 30px;">
            <span class="eth-signed-by-text">Protocol Signed By:</span>
            <span class="sign-text">{{ userName || address }}</span>
            <span class="address-text">{{ address }}</span>
          </div>
        </div>
        <!-- 个性签名 -->
        <div class="sign-part" v-if="btnIndex == 1">
          <div class="text-signature-container person-sign" style="padding: 12px 30px;" @mousedown="handleDraw">
            <span class="eth-signed-by-text" v-if="isDrawSign">Protocol Signed By:</span>
            <span class="address-text sign-here" v-if="!isDrawSign">Sign here</span>
            <span class="address-text" v-if="isDrawSign">{{ address }}</span>
            <vue-esign style="position: absolute;left: 0;top: 0;width: 100%;important;" ref="personCanvas"></vue-esign>
          </div>
        </div>
        <!-- 上传图片签名 -->
        <div class="sign-part" v-if="btnIndex == 2">
          <div class="text-signature-container person-sign"
            style="height: 250px;cursor: default;justify-content: center;padding: 12px 30px;">
            <span class="eth-signed-by-text" v-if="isDrawSign">Protocol Signed By:</span>
            <img :src="uploadImageSrc" class="upload-imagesrc">
            <span class="address-text" v-if="isDrawSign">{{ address }}</span>
            <button class="image-signature-upload" @click="uploadFile" v-if="!isDrawSign">Browser File</button>
            <input type="file" ref="fileInput" style="display:none" @change="handleFileInputChange"
              accept='.jpg,.jpeg,.png'>
          </div>
        </div>
        <div class="btn-list">
          <div class="clear-btn" @click="clearSign()">Clear</div>
          <div class="add-btn" @click="insertSign()">Insert</div>
        </div>
      </div>
    </div>

    <div style="position: relative;width: 100%;" id="pdfContainer">
      <!-- 加载原生pdf -->
      <!-- <canvas id="pdf-canvas" class="canvas-location"></canvas> -->
      <!-- 删除按钮 -->
      <span class="delete" style="position: absolute;z-index: 1;color: red;cursor: pointer;" @click="deleteRect(index)"
        :style="'left:' + item.x + 'px;' + 'top:' + (item.y + item.index * canvasHeight + item.index * 10 - 20) + 'px'"
        v-for="(item, index) in rectangles" :key="index">
        x
      </span>
      <!-- 待完成签名区域 -->
      <div v-if="placeMarkCopy && isRender">
        <div v-for="(item, index) in placeMarkCopy" :key="index">
          <!-- 待签名 -->
          <div class="sign" @click="userSign(index)" v-if="item.toolbarType == 0"
            :style="'left:' + item.x + 'px;' + 'top:' + (item.y + item.index * canvasHeight + item.index * 10 - 10) + 'px;' + 'width:' + item.width + 'px;' + 'height:' + item.height + 'px'">
            Click to Sign
          </div>

        </div>

      </div>
      <!-- 已输入文本框 日期 地址-->
      <div v-if="placeMarkCopy && isRender">
        <div v-for="(item, index) in placeMarkCopy" :key="index">
          <!-- 文本框 -->
          <div class="sign" :class="{ 'bg-none': showMenu == false }" v-if="item.toolbarType == 3"
            :id="'textField' + index"
            :style="'left:' + item.x + 'px;' + 'top:' + (item.y + item.index * canvasHeight + item.index * 10 - 10) + 'px;' + 'width:' + item.width + 'px;' + 'height:' + item.height + 'px'">
            <input placeholder="Add text" style="width: 100%;font-size: 16px;" @change="handleChange($event, item, index)"
              @input="handleInput($event, index)" :id="'input' + index">
          </div>
          <!-- 日期 -->
          <div class="sign date-signed" :class="{ 'bg-none': showMenu == false }" v-if="item.toolbarType == 1"
            :id="'dateSigned' + index" :data-index="item.index" :data-y="item.y"
            :style="'left:' + item.x + 'px;' + 'top:' + (item.y + item.index * canvasHeight + item.index * 10 - 10) + 'px;' + 'width:' + item.width + 'px;' + 'height:' + item.height + 'px'">
            <div placeholder="Add text" style="width: 100%;font-size: 16px;">
              {{ dateTime }}</div>
          </div>
          <!-- 地址 -->
          <div class="sign address-signed" :class="{ 'bg-none': showMenu == false }" v-if="item.toolbarType == 2"
            :id="'addressSigned' + index" :data-index="item.index" :data-y="item.y"
            :style="'left:' + item.x + 'px;' + 'top:' + (item.y + item.index * canvasHeight + item.index * 10 - 10) + 'px;' + 'width:' + item.width + 'px;' + 'height:' + item.height + 'px'">
            <div placeholder="Add text" style="width: 100%;text-align: center;" :style="'font-size:' + (16 / scaleSize) + 'px'">
              {{ addressDetails }}</div>
          </div>
        </div>
      </div>


      <!-- 已签名区域 -->
      <div v-if="placeMarkSign.length > 0 && isRender">
        <div class="signed" :id="'signed' + item.signedIndex"
          :style="'left:' + (item.x) + 'px;' + 'top:' + (item.y - 10) + 'px;' + 'width:' + item.width  + 'px;' + 'height:' + item.height + 'px;min-width:150px'"
          v-for="(item, index) in placeMarkSign" :key="index">
          <!-- 系统签名 -->
          <div class="text-signature-container" style="border: none;" v-if="item.btnIndex == 0">
            <span class="eth-signed-by-text" :style="'font-size:' + (20 / scaleSize) + 'px'">Protocol Signed By:</span>
            <span class="sign-text" :style="'font-size:' + (20 / scaleSize) + 'px;padding:10px 0'">{{ item.userName || address }}</span>
            <span class="address-text" :style="'font-size:' + (20 / scaleSize) + 'px'">{{ address }}</span>
          </div>
          <!-- 个性签名 -->
          <div class="text-signature-container" style="border: none;" :style="'height:' + item.height + 'px;'"
            v-if="item.btnIndex == 1">
            <span class="eth-signed-by-text" :style="'font-size:' + (20 / scaleSize) + 'px'">Protocol Signed By:</span>
            <span class="address-text" :style="'font-size:' + (20 / scaleSize) + 'px'">{{ address }}</span>
            <img :src=item.personCanvasImg class="person-canvasimg">
          </div>
          <!-- 图片签名 -->
          <div class="text-signature-container " style="border: none;height: 100%;" v-if="item.btnIndex == 2">
            <span class="eth-signed-by-text" :style="'font-size:' + (20 / scaleSize) + 'px'">Protocol Signed By:</span>
            <img :src="item.uploadImageSrc" class="upload-imagesrc" :style="'height:' + (100 / scaleSize) + 'px'">
            <span class="address-text" :style="'font-size:' + (20 / scaleSize) + 'px'">{{ address }}</span>
          </div>
        </div>
      </div>

    </div>

    <div class="menu-bar" v-if="showMenu">
      <div class="item-bar">
        <div class="item-button">Signature Fields</div>
        <div class="nav-item" @click="signHandle(0)">
          <span>{{ address }}'s</span>
          <div>Signature</div>
        </div>
      </div>
      <div class="item-bar">
        <div class="item-button">Date Signed</div>
        <div class="nav-item" @click="signHandle(1)">
          <span>{{ address }}'s</span>
          <div>Date Signed</div>
        </div>
      </div>
      <div class="item-bar">
        <div class="item-button">Wallet Address</div>
        <div class="nav-item" @click="signHandle(2)">
          <span>{{ address }}'s</span>
          <div>Wallet Address</div>
        </div>
      </div>
      <div class="item-bar">
        <div class="item-button">Text Field</div>
        <div class="nav-item" @click="signHandle(3)">
          <div>
            <span>{{ address }}'s</span>
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
// import jsPDF from "jspdf";
let rectangles = [];
export default {
  name: "PDF",
  props: {
    showMenu: Boolean,
    placeMark: Array,
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
      rect: { width: 250, height: 100, isResize: false, bl: 1 },
      deleteStyle: '',
      ctxs: [],
      sizeDrag: 5,
      isRender: false,
      placeMarkCopy: null,
      placeMarkSign: [],
      showModal: false,
      userName: '',
      address: '',
      addressDetails: '',
      signIndex: null,
      signedIndex: 0,
      toolbarType: 0,
      inputValues: [],
      dateTime: null,
      btnIndex: 0,
      isDrawSign: false,
      personCanvasImg: '',
      uploadImageSrc: '',
      scaleSize: 1
    }
  },
  mounted() {
    rectangles = [];
    PDF.GlobalWorkerOptions.workerSrc = entry;
    let address = localStorage.getItem('address');
    this.addressDetails = address;
    let str1 = address.substring(0, 10);
    let str2 = address.substring(address.length - 5);
    this.address = str1 + '...' + str2;
    const today = new Date();
    this.dateTime = this.formatDate(today);
  },
  methods: {
    // 处理选择的文件
    handleFileInputChange(event) {
      this.isDrawSign = true;
      const file = event.target.files[0];
      console.log(file)
      const reader = new FileReader();

      reader.onload = (event) => {
        this.uploadImageSrc = event.target.result;
      };

      if (file) {
        reader.readAsDataURL(file);
      }

    },
    uploadFile() {
      this.$refs.fileInput.click();
    },
    handleDraw() {
      this.isDrawSign = true;
    },
    //选择签名方式
    btnHandle(index) {
      this.btnIndex = index;
      this.isDrawSign = false;
      //上传图片签名
      if (index == 2) {
        this.uploadImageSrc = ''
      }
    },
    formatDate(date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    },
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
        if (rect.toolbarType == 0) {
          //绘制矩形拖拽缩放区域
          ctxs[rect.index].fillStyle = "gray";
          ctxs[rect.index].fillRect(rect.x + rect.width - that.sizeDrag, rect.y + rect.height - that.sizeDrag, that.sizeDrag * 2, that.sizeDrag * 2);
        }
        // 绘制路径的描边（即矩形边框）
        ctxs[rect.index].strokeStyle = "red";
        ctxs[rect.index].stroke();


        // 添加描述
        let text = ''
        if (rect.toolbarType == 0) {
          text = "This is a Signature Area";
        } else if (rect.toolbarType == 1) {
          text = "Date signed";
        } else if (rect.toolbarType == 2) {
          text = that.addressDetails;
        }
        else if (rect.toolbarType == 3) {
          text = "This is a Text field";
        }
        // let text = "This is a Signature Area!";
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
              if (rect.toolbarType == 0) {
                if (mouseX - rect.x > 10 && mouseY - rect.y > 10) {
                  rect.width = mouseX - rect.x;
                  rect.height = mouseY - rect.y;
                }
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
        if (that.toolbarType == 0) {
          that.rect.height = 100
        } else {
          that.rect.height = 40
        }
        if (that.toolbarType == 2) {
          that.rect.width = 400
        } else {
          that.rect.width = 250
        }
        const rect = { index, x: mouseX, y: mouseY, isDragging: false, ...that.rect, toolbarType: that.toolbarType };
        rectangles.push(rect);
        that.redraw();
        that.isMenuClick = false;
      }
    },

    loadFile(fileCode) {
      // console.log('pdfUrl===',this.pdfUrl)
      if (!fileCode) {
        // 加载PDF文档 本地文件
        let word2pdfFile = this.$store.state.word2pdfFile;
        if (word2pdfFile) {
          let loadingTask = PDF.getDocument(word2pdfFile);
          loadingTask.promise.then((pdf) => {
            console.log('word2pdf===', pdf)
            this.pdfDoc = pdf // 保存加载的pdf文件流
            this.pdfPages = this.pdfDoc.numPages // 获取pdf文件的总页数
            // alert(this.pdfPages)
            this.$nextTick(() => {
              this.renderPage(pdf);
            });
          });
        } else {
          let file = this.$store.state.pdfFile;
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            let loadingTask = PDF.getDocument(data);
            loadingTask.promise.then((pdf) => {
              console.log('pdf===', pdf)
              this.pdfDoc = pdf // 保存加载的pdf文件流
              this.pdfPages = this.pdfDoc.numPages // 获取pdf文件的总页数
              this.$nextTick(() => {
                this.renderPage(pdf);
              });
            });
          };
        }
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
      let bl = '';
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
        let viewport = page.getViewport({ scale: 1 });
        // 设置 Canvas 的大小以适应页面
        //页面容器跟canvas比例
        bl = (container.offsetWidth / viewport.width).toFixed(2);
        console.log('bl=================', bl)
        viewport = page.getViewport({ scale: bl });
        this.rect.bl = bl;
        viewport.width = viewport.width;
        viewport.height = viewport.height;
        let width = viewport.width;
        let height = viewport.height;
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
        console.log('viewport==', viewport)
        await page.render({ canvasContext: context, viewport });
        this.isRender = true
      }
      this.loadCanvas();

      if (this.placeMark) {
        this.placeMarkCopy = JSON.parse(JSON.stringify(this.placeMark))
        this.placeMarkCopy.forEach(item => {
          this.scaleSize = item.bl / this.rect.bl;
          item.x = item.x / this.scaleSize;
          item.y = item.y / this.scaleSize;
          item.width = item.width / this.scaleSize;
          item.height = item.height / this.scaleSize;
        })
      }
      console.log('this.placeMarkCopy', this.placeMarkCopy)
      this.$nextTick(() => {
        let date = document.getElementsByClassName('date-signed');
        let address = document.getElementsByClassName('address-signed');
        let nodeList = [];//日期节点列表
        let addressList = [];//地址节点列表
        // console.log('ate.length', date.length)
        for (let i = 0; i < date.length; i++) {
          const nodeToMove = date[i];
          let obj = { index: null, node: null, y: null };
          let j = parseInt(nodeToMove.dataset.index) + 1;
          obj.index = j;
          obj.node = nodeToMove;
          obj.y = nodeToMove.dataset.y;
          nodeList.push(obj)
        }
        for (let i = 0; i < address.length; i++) {
          const nodeToMove = address[i];
          let obj = { index: null, node: null, y: null };
          let j = parseInt(nodeToMove.dataset.index) + 1;
          obj.index = j;
          obj.node = nodeToMove;
          obj.y = nodeToMove.dataset.y;
          addressList.push(obj)
        }
        // 将日期节点移动到新的父节点下
        nodeList.map(item => {
          item.node.style.top = parseInt(item.y) - 10 + 'px';
          const targetParent = document.getElementById('pageContainer' + item.index);
          targetParent.appendChild(item.node);
        })
        // 将日期节点移动到新的父节点下
        addressList.map(item => {
          item.node.style.top = parseInt(item.y) - 10 + 'px';
          const targetParent = document.getElementById('pageContainer' + item.index);
          targetParent.appendChild(item.node);
        })

      });
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
      this.toolbarType = index;
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
    //文本实时输入
    handleInput(e, index) {
      let val = e.target.value;
      // console.log(val)
      const nodeToMove = document.getElementById('textField' + index);
      if (!val) {
        nodeToMove.style.width = 200 + 'px'
        return
      }
      var count = this.countChineseChars(val);//汉字数量
      let strLength = val.length - count;//非汉字数量
      // console.log("汉字字符数量：", count);
      // console.log("非汉字字符数量：", count);
      let width = 10 + count * 16 + strLength * 9 + 'px';
      // console.log("相应宽度===", width);
      nodeToMove.style.width = width
    },
    //汉字字符有几个
    countChineseChars(str) {
      // 使用正则表达式匹配汉字字符
      var regex = /[\u4e00-\u9fa5]/g;

      // 使用 match 方法找出所有匹配项，并返回匹配项数组
      var matches = str.match(regex);

      // 如果 matches 不为 null，则返回匹配项的数量
      if (matches !== null) {
        return matches.length;
      } else {
        return 0; // 没有汉字字符，返回 0
      }
    },
    //文本框失焦
    handleChange(e, item, index) {
      console.log(e)
      let val = e.target.value;
      const nodeToMove = document.getElementById('textField' + index);
      const nodeInput = document.getElementById('input' + index);
      if (nodeToMove) {
        let j = item.index + 1;
        nodeToMove.style.top = item.y - 10 + 'px';
        if (!val) {
          nodeInput.style.border = "1px solid";
        } else {
          nodeInput.style.border = "none";
        }

        const targetParent = document.getElementById('pageContainer' + j);
        // 将节点移动到新的父节点下
        targetParent.appendChild(nodeToMove);
      }
    },
    //清除签名
    clearSign() {
      //个性签名
      if (this.btnIndex == 1) {
        this.$refs.personCanvas.reset();
        this.isDrawSign = false;
      } else if (this.btnIndex == 0) {//系统签名
        this.userName = '';
      }

    },

    //添加签名
    insertSign() {
      if (this.btnIndex == 0) {//系统签名
        let str = JSON.stringify(this.placeMarkCopy[this.signIndex]);
        this.placeMarkCopy.splice(this.signIndex, 1);
        this.showModal = false;
        let obj = JSON.parse(str);
        obj.userName = this.userName;
        obj.signedIndex = this.signedIndex;
        obj.btnIndex = this.btnIndex;
        this.signedIndex++;
        this.placeMarkSign.push(obj);
        this.$nextTick(() => {
          // 获取要移动的节点和目标父节点的引用
          const nodeToMove = document.getElementById('signed' + obj.signedIndex);
          let j = obj.index + 1;
          const targetParent = document.getElementById('pageContainer' + j);
          // 将节点移动到新的父节点下
          targetParent.appendChild(nodeToMove);
        })
      } else if (this.btnIndex == 1) {//个性签名
        this.$refs.personCanvas.generate().then((base64) => {
          this.personCanvasImg = base64; //默认生成的是base64形式的图片
          let str = JSON.stringify(this.placeMarkCopy[this.signIndex]);
          this.placeMarkCopy.splice(this.signIndex, 1);
          this.showModal = false;
          let obj = JSON.parse(str);
          obj.userName = this.userName;
          obj.signedIndex = this.signedIndex;
          obj.btnIndex = this.btnIndex;
          // obj.height = 130;
          // obj.width = 250;
          obj.personCanvasImg = this.personCanvasImg;
          this.signedIndex++;
          this.placeMarkSign.push(obj);
          this.$nextTick(() => {
            // 获取要移动的节点和目标父节点的引用
            const nodeToMove = document.getElementById('signed' + obj.signedIndex);
            let j = obj.index + 1;
            const targetParent = document.getElementById('pageContainer' + j);
            // 将节点移动到新的父节点下
            targetParent.appendChild(nodeToMove);
          })
        }).catch((err) => {
          console.log(err); // 画布没有签字时会执行这里 'Not Signned'
        });
      } else {//传入图片签名
        let str = JSON.stringify(this.placeMarkCopy[this.signIndex]);
        this.placeMarkCopy.splice(this.signIndex, 1);
        this.showModal = false;
        let obj = JSON.parse(str);
        obj.userName = this.userName;
        obj.signedIndex = this.signedIndex;
        obj.btnIndex = this.btnIndex;
        obj.uploadImageSrc = this.uploadImageSrc;
        obj.height = 180;
        this.signedIndex++;
        this.placeMarkSign.push(obj);
        this.$nextTick(() => {
          // 获取要移动的节点和目标父节点的引用
          const nodeToMove = document.getElementById('signed' + obj.signedIndex);
          let j = obj.index + 1;
          const targetParent = document.getElementById('pageContainer' + j);
          // 将节点移动到新的父节点下
          targetParent.appendChild(nodeToMove);
        })
      }
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
  height: calc(100vh - 250px);
  overflow-y: scroll;
  overflow-x: hidden;
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
  word-break: break-word;
  text-align: left;
  // margin-top: 15px;
  // padding: 12px 30px;

  .eth-signed-by-text {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: #e27019;
    user-select: none;
  }

  .sign-text {
    font-weight: 700;
    font-size: 26px;
    // line-height: 39px;
    color: #373b46;
    user-select: none;
  }

  .address-text {
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    color: #6e7179;
    user-select: none;
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

    align-items: flex-start;
    width: 600px;
    height: 470px;
    padding: 30px 50px;
    border-radius: 20px;
    box-shadow: 0 0 3px #868e96;
    background: #f9fbfc;
    box-sizing: border-box;

    .sign-part {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      width: 100%;
    }

    .part-1 {
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: 35px;
    }

    .btn-list {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      align-items: center;
      position: absolute;
      width: 500px;
      bottom: 50px;
    }

    .clear-btn {
      left: 52px;
      bottom: 50px;
      border-radius: 8px;
      padding: 8px 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6e7179 !important;
      font-weight: 450;
      font-size: 16px;
      border: 2px solid transparent;
      cursor: pointer;
    }

    .add-btn {
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
  position: fixed;
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
  // min-height: 100px;
}

textarea {
  resize: none;
}

.bg-none {
  background-color: rgba(0, 0, 0, 0);
}

.tab-list {
  font-size: 14px;
  width: 100%;
  display: flex;
  border-radius: 15px;
  border: 1px solid #cfd4da;
  height: 40px;
  color: #485056;
  margin-bottom: 35px;

  .btn-active {
    background: #ffe8de !important;
  }

  button {
    outline: none;
    padding: 0;
    border: none;
    background-color: transparent;
    text-align: center;
    vertical-align: middle;
    line-height: 24px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    flex: 1;
    border-radius: 0;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }

  button:first-child {
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;
  }

  button:last-child {
    border-bottom-right-radius: 15px;
    border-top-right-radius: 15px;
  }

  div {
    width: 1px;
    background: #cfd4da;
  }
}

.person-sign {
  height: 186px;
  // padding-left: 140px;
  position: relative;
  cursor: crosshair;
}

.sign-here {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.person-canvasimg {
  position: absolute;
  width: 100%;
  object-fit: cover;
  // left: 15px;
}

.image-signature-upload {
  font-weight: 450;
  font-size: 16px;
  border-radius: 8px;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 12px 48px;
  background: #d97d40;
  cursor: pointer;
  border: 2px solid transparent;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.upload-imagesrc {
  height: 100px;
  padding: 10px 0;
  object-fit: contain;
}
</style>