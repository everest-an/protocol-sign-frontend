<template>
<div class="contract-wrap">
    <Step :currentStep="3"></Step>
</div>
</template>
<script>
import Step from '@/components/step.vue'
export default {
    name: "Manage",
    components: {Step},
    data() {
        return{
            currentType:'',
        }
    },
    methods:{

    },
}
</script>
<style scope lang="scss">
.contract-wrap{
    padding:40px 24px;
}

</style>