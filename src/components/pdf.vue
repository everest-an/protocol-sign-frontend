<template>
  <div class="pdf-content" :style="cursor">
    <div style="position: relative;display: flex;">
      <div :style="divContent"></div>
      <canvas id="pdf-canvas" class="canvas-location"></canvas>
      <canvas id="canvas" class="canvas-location"></canvas>
    </div>
    <div class="menu-bar">
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
  data() {
    return {
      currentType: '',
      pdfDoc: null,
      pdfPages: null,
      divContent: '',
      cursor: 'default',
      isMenuClick: false
    }
  },
  mounted() {
    PDF.GlobalWorkerOptions.workerSrc = entry
    this.loadFile('pdfUrl', 'pdf-canvas')
    this.loadCanvas()
  },
  methods: {

    loadCanvas() {
      let that = this;
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      // let rectangles = [];
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);

      function handleMouseDown(event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        for (let i = rectangles.length - 1; i >= 0; i--) {
          const rect = rectangles[i];
          if (mouseX > rect.x && mouseX < rect.x + rect.width && mouseY > rect.y && mouseY < rect.y + rect.height) {
            rect.isDragging = true;
            rect.offsetX = mouseX - rect.x;
            rect.offsetY = mouseY - rect.y;
            break;
          }
        }
      }

      function handleMouseMove(event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        for (const rect of rectangles) {
          if (rect.isDragging) {
            rect.x = mouseX - rect.offsetX;
            rect.y = mouseY - rect.offsetY;
            // console.log(rectangles)
          }
        }
        redraw();
      }

      function handleMouseUp(event) {
        for (const rect of rectangles) {
          rect.isDragging = false;
        }
        console.log(rectangles)
      }

      function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const rect of rectangles) {
          // ctx.fillStyle = 'red';
          // 设置线条样式为虚线
          ctx.setLineDash([5, 3]);
          ctx.beginPath();
          ctx.rect(rect.x, rect.y, rect.width, rect.height);
          ctx.closePath();
          // 绘制路径的描边（即矩形边框）
          ctx.strokeStyle = "red";
          ctx.stroke();

          // 添加描述
          let text = "This is a Signature Area!";
          ctx.font = "bold 16px Arial";
          let textWidth = ctx.measureText(text).width;
          let textHeight = 16;
          ctx.fillStyle = "black";
          let centerX = rect.x + rect.width / 2 - textWidth / 2;
          let centerY = rect.y + rect.height / 2 + textHeight / 2;
          ctx.fillText(text, centerX, centerY);
        }

        //生成PDF并下载
        // const pdf = new JSPDF({
        //   orientation: "l",
        //   unit: "pt",
        //   format: [960, 540]
        // });
        // pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, 960, 540);
        // pdf.save('newPdf.pdf');
      }

      canvas.addEventListener('click', handleCanvasClick);

      function handleCanvasClick(event) {
        if (!that.isMenuClick) {
          return
        }
        that.cursor = 'cursor:default';

        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        // 检查是否点击在一个已存在的矩形内部
        for (let i = rectangles.length - 1; i >= 0; i--) {
          let rect = rectangles[i];
          if (mouseX > rect.x && mouseX < rect.x + rect.width && mouseY > rect.y && mouseY < rect.y + rect.height) {
            // 如果是，将其设置为选中的矩形并返回
            console.log('矩形内点击')
            // selectedRectangle = rect;
            return;
          }
        }

        const rect = { x: mouseX, y: mouseY, width: 250, height: 150, isDragging: false };
        rectangles.push(rect);
        redraw();
        that.isMenuClick = false;
      }
    },

    loadFile(url, id) {
      let file = this.$store.state.pdfFile;
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        let loadingTask = PDF.getDocument(data);
        loadingTask.promise.then((pdf) => {
          this.pdfDoc = pdf // 保存加载的pdf文件流
          this.pdfPages = this.pdfDoc.numPages // 获取pdf文件的总页数
          this.$nextTick(() => {
            this.renderPage(pdf, id);
          });
        });
      };
      reader.readAsArrayBuffer(file);
   
    },

    async renderPage(pdf, id) {
      const canvas = document.getElementById(id);
      //绘制矩形的画布
      const canvasRect = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvasRect.width = canvas.width;
      canvasRect.height = canvas.height;
      this.divContent = `width:${canvas.width}px;height:${canvas.height}px`
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };
      await page.render(renderContext);
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
  margin-top: 20px;
  position: relative;
  // cursor: url('@/assets/sign_here.svg'),pointer;
  cursor: default;
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