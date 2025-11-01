<template>
  <div class="pdf-canvas-container">
    <canvas ref="pdfCanvas" :id="canvasId"></canvas>
  </div>
</template>

<script>
import * as PDF from "pdfjs-dist";
import entry from "pdfjs-dist/build/pdf.worker.entry";

export default {
  name: 'PdfCanvas',
  props: {
    pdfUrl: {
      type: String,
      required: true
    },
    canvasId: {
      type: String,
      default: 'pdf-canvas'
    },
    pageNum: {
      type: Number,
      default: 1
    },
    scale: {
      type: Number,
      default: 1.5
    }
  },
  data() {
    return {
      pdfDoc: null,
      pageRendering: false,
      pageNumPending: null,
      currentPage: 1
    }
  },
  mounted() {
    PDF.GlobalWorkerOptions.workerSrc = entry;
    this.loadPdf();
  },
  watch: {
    pdfUrl() {
      this.loadPdf();
    },
    pageNum(newVal) {
      this.renderPage(newVal);
    }
  },
  methods: {
    async loadPdf() {
      if (!this.pdfUrl) return;
      
      try {
        const loadingTask = PDF.getDocument(this.pdfUrl);
        this.pdfDoc = await loadingTask.promise;
        this.renderPage(this.pageNum);
        this.$emit('pdf-loaded', {
          numPages: this.pdfDoc.numPages
        });
      } catch (error) {
        console.error('Error loading PDF:', error);
        this.$emit('pdf-error', error);
      }
    },
    async renderPage(num) {
      if (!this.pdfDoc) return;
      
      this.pageRendering = true;
      
      try {
        const page = await this.pdfDoc.getPage(num);
        const canvas = this.$refs.pdfCanvas;
        const ctx = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: this.scale });
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
        this.pageRendering = false;
        this.currentPage = num;
        
        if (this.pageNumPending !== null) {
          this.renderPage(this.pageNumPending);
          this.pageNumPending = null;
        }
        
        this.$emit('page-rendered', num);
      } catch (error) {
        console.error('Error rendering page:', error);
        this.pageRendering = false;
        this.$emit('render-error', error);
      }
    },
    queueRenderPage(num) {
      if (this.pageRendering) {
        this.pageNumPending = num;
      } else {
        this.renderPage(num);
      }
    },
    nextPage() {
      if (this.pdfDoc && this.currentPage < this.pdfDoc.numPages) {
        this.queueRenderPage(this.currentPage + 1);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.queueRenderPage(this.currentPage - 1);
      }
    },
    getTotalPages() {
      return this.pdfDoc ? this.pdfDoc.numPages : 0;
    }
  }
}
</script>

<style scoped lang="scss">
.pdf-canvas-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #f5f5f5;
  
  canvas {
    display: block;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background: white;
    margin: 20px;
  }
}
</style>
