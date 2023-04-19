<template>
    <div class="contract-wrap">
        <Step :currentStep="3"></Step>
        <!-- <div class="content" :style="cursor">
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
        </div> -->
        <pdf-canvas></pdf-canvas>
    </div>
</template>
<script>
import Step from '@/components/step.vue'
import PdfCanvas from '@/components/pdf.vue'

export default {
    name: "Manage",
    components: { Step,PdfCanvas},
    data() {
        return {
           
        }
    },
    mounted() {
        
    },
    methods: {

       
    },
}
</script>
<style scope lang="scss">
.contract-wrap {
    padding: 40px 24px;
}

</style>