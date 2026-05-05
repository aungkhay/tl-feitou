<template>
    <div class="pa-4">
        <v-btn color="primary" @click="makePreview" class="mb-3">Preview screenshot</v-btn>

        <!-- Everything inside this div will be captured -->
        <div ref="captureEl" class="capture">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in rows" :key="row.id">
                        <td>{{ row.id }}</td>
                        <td>{{ row.name }}</td>
                        <td style="text-align:right">{{ row.amount }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Preview area -->
        <div v-if="previewUrl" class="preview">
            <h4>Preview</h4>
            <img :src="previewUrl" alt="Screenshot preview" />
            <div>
                <v-btn variant="tonal" @click="clearPreview" color="primary">Close</v-btn variant="tonal">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import html2canvas from "html2canvas";

const captureEl = ref(null);
const previewUrl = ref("");

const rows = ref([
    { id: 1, name: "A", amount: 1200 },
    { id: 2, name: "B", amount: 900 },
]);

async function makePreview() {
    const el = captureEl.value;
    if (!el) return;

    const canvas = await html2canvas(el, {
        backgroundColor: "#ffffff",
        scale: window.devicePixelRatio || 2,
        useCORS: true,
    });

    // Preview as an <img>
    previewUrl.value = canvas.toDataURL("image/png");
}

function clearPreview() {
    previewUrl.value = "";
}
</script>

<style scoped>
.capture {
    background: white;
    width: fit-content;
}

.preview {
    margin-top: 16px;
    display: inline-block;
}

.preview img {
    max-width: 100%;
}

.tbl {
    border-collapse: collapse;
    min-width: 500px;
}

.tbl th,
.tbl td {
    border: 1px solid #ccc;
    padding: 8px;
    line-height: 11px;
    font-size: 11px;
}
</style>