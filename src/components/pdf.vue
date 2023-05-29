<template>
  <div class="pdf-content" :class="{ 'pdf-center': showMenu == false }" :style="cursor">
    <div style="position: relative;" id="pdfContainer">
      <!-- 加载原生pdf -->
      <!-- <canvas id="pdf-canvas" class="canvas-location"></canvas> -->
      <!-- 删除按钮 -->
      <span class="delete" style="position: absolute;z-index: 1;color: red;cursor: pointer;" @click="deleteRect(index)"
        :style="'left:' + item.x + 'px;' + 'top:' + (item.y + item.index * (canvasHeight + item.index * 10) - 20) + 'px'"
        v-for="(item, index) in rectangles" :key="index">
        x
      </span>
      <!-- 签名区域 -->
      <div v-if="placeMark">
        <div style="position: absolute;z-index: 1;color: red;cursor: pointer;"
          :style="'left:' + item.x + 'px;' + 'top:' + (item.y + item.index * (canvasHeight + item.index * 10) - 20) + 'px'"
          v-for="(item, index) in rectangles" :key="index">
        </div>
      </div>

    </div>

    <div class="menu-bar" v-if="showMenu">
      <div>
        <div class="item-button">Signature Fields</div>
        <div class="nav-item" @click="signHandle()">
          <div>0xC50557…a579C7's</div>
          <div>Signature</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as PDF from "pdfjs-dist";
// import pdfUrl from "@/assets/2.pdf";
import signImg from "@/assets/sign_here.svg";
import entry from "pdfjs-dist/build/pdf.worker.entry";
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
      sizeDrag: 5
    }
  },
  mounted() {
    rectangles = [];
    PDF.GlobalWorkerOptions.workerSrc = entry
    // this.loadFile('pdfUrl')
    // this.loadCanvas()
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
      console.log('pageContainer', pageContainer)
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
        this.$axios({
          url: 'http://18.181.218.33:8132/web/contract/loadContract',
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

        return
        this.$axios.post('/web/contract/loadContract', { fileCode }).then(async (res) => {



          //导出PDF
          // var form = document.createElement("form");
          // form.id = "form";
          // form.name = "form";
          // document.body.appendChild(form);
          // var input = document.createElement("input");
          // input.type = "hidden";
          // input.name = "fileCode"; //参数名字
          // input.value = fileCode; //参数值
          // form.appendChild(input);
          // form.method = "POST"; //请求方式
          // form.action = 'http://18.181.218.33:8132/web/contract/loadContract';
          // form.submit();
          // document.body.removeChild(form);

          // // 加载PDF文档 url路径  获取非Blob文件流
          // var arrayBuffer = new Uint8Array(res).buffer;
          // let loadingTask = PDF.getDocument(arrayBuffer);
          // loadingTask.promise.then((pdf) => {
          //   this.pdfDoc = pdf // 保存加载的pdf文件流
          //   this.pdfPages = this.pdfDoc.numPages // 获取pdf文件的总页数
          //   this.$nextTick(() => {
          //     this.renderPage(pdf);
          //   });
          // });


          // //将文件流转换为Blob对象
          let url = window.URL.createObjectURL(new Blob([res], { type: 'application/pdf' }));
          let loadingTask = PDF.getDocument(url);
          loadingTask.promise.then((pdf) => {
            this.pdfDoc = pdf // 保存加载的pdf文件流
            this.pdfPages = this.pdfDoc.numPages // 获取pdf文件的总页数
            this.$nextTick(() => {
              this.renderPage(pdf);
            });
          });

        }).catch(function (error) {
          console.log(error);
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
      }
      this.loadCanvas();

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
    signHandle() {
      this.cursor = `cursor:url(${signImg}),pointer`;
      this.isMenuClick = true;
    }
  },
}
</script>
<style scoped lang="scss">
.pdf-content {
  background: #eee;
  padding: 20px;
  // margin-top: 20px;
  position: relative;
  // cursor: url('@/assets/sign_here.svg'),pointer;
  cursor: default;
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
</style>