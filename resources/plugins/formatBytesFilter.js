import Vue from 'vue'

Vue.filter('formatBytes', function (bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)

    if (i === 0) return `${bytes} ${sizes[i]}`

    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
})