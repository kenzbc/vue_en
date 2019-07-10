<template>
  <span>

    <audio :src="url" preload="auto" id="audio" ref="audio" @timeupdate="onTimeUpdate" @error="onError" @waiting="onWaiting" @loadedmetadata="onLoadedmetadata" @onended="onEnd">亲 您的浏览器不支持html5的audio标签</audio>

    <div class="con" v-show="type == 'circle'" @click="control()">
      <div class="percent-circle percent-circle-left">
        <div class="left-content"></div>
      </div>
      <div class="percent-circle percent-circle-right">
        <div class="right-content"></div>
      </div>
      <div class="text-circle">
        <span class="play-btn">
          <span v-if="isPlay"><img width="25" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAB2klEQVRoQ+1au0oDQRQ9dxNINkERDFoIIuRDJI0gWlkpiI8ktaWdYGFnp1hIYoyVIFhpoZ34A/oFNqYQxEZxs0LYK4KPINkwM1aJZ+tzZ+Y+5pwDO4J/9sk/yxdMuN87zg6zw31WgfiR3tFUJos9VSyIIOOSd6TYCMuyZRx7oon0M3ZFsCjAgHFcG1CB7WZJ1uNiYxNOVXUmITh32bQ9JnhFGmvyZrJOuqaTnuLKBNsNEySRw7I8dcLEJuxXdV4Ex3/eXDCCojyarJOp6SwUZybYbphIkA+LcseEgXjjwQ47zlnAkY6vHO+w41SRtNoKR1n6KgZZ2vE+kaW7FI4s7ThVZGmydIfRIUs73ieyNFn6pwKUJcdrRFmiLFGWAOqwI4FQh6nD1GH+ebClDxoPGg8aDxoPW974xtN40HjQeNB42BIIjQeNB40HjYctb/Sg8ajonHg4dc70MzAABlGSF5N1Ugc6lQAuTbDdMCoYbxblvhMm/nHpvub8JG4FGHM+gOIiKMu0cfyhDvkRbgSYMI75BVTFdbOBAjYlskv4A13RUd/DkgBZ2wNEikaYRx0FaVnFHumw38KK42vah8BDHasSxu3JF/FW3ehBMDvcg02zOjI7bFWuHgS/A7fGPlur34FWAAAAAElFTkSuQmCC"></span>
          <span v-if="!isPlay"><img width="25" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAACuElEQVRoQ+2b3XHTQBSFz5We4ic6gA6ACnAJTgfW2DzjVIDcgf0eD6GDUAGhg6QCTAfxi+QZgw4j24JMBktr7Y92bfyqlfZ+e+7unr2yBAq/3oIfSfRF0CdxJ8A8G8utwq3eNZHaiD7xRe8XvkLw5h/tbrIIV0jk0TuqmoBqgS+uORPBh0P3E1iyQLJ+L3ehQNcDL/hdgFdNMARmeYRpCGrXAvcWZBPsn+vE/SZGsknkXvmeDhqaA/4bfJqNZNoBi1KXNoABj9W2A7wfaxKTfCxzpaF31MgqcMlQ7tuMkawTWTpiqu3GOvC+90cSqQ9quwLecpO4zWMkXW5fToErtUEkXVnTLoA7Vbsz4ErtosClS2vaNfBObYfW1AvgPbSTg4g3wE82T6vW1Edgq9bUT2CLBxHfgbdqFzEuTVlT/4F3ahuzpqEAV2ZF+yASFLAJaxoisJY1DRa4rdqhA1cbmHKN/FSASz+uZE1PBriSehPhbV2p+OSASXzJxzI4VNg6OeASNBvJQa7/wE9T4ahXLT7UYHeFwvNK6bNZtEj8IDFsqo+dxBwmMc9jpCr17rCBiVVBDJpUfbq8BAu8XZxiDFVUDRuYWAEYtn1zEZTCBL7lEQbHqhqewsSKgjQfyUx3u/de4VJVRhieRRGPwJUJVUNI6YdNhKGNfwT5mNLTbCSp7lz1/nhYWsOfMQY2VPUupY+xhrrKd5rSqoZfF9IPhYnPWYyJjoloMxDuFda0hm0gO1O4reHXhXQPXB7jBJP1SG5MBt/mWdZT2rQ1bAPpRmGDhl8X0gXwQxFhYMrw+w5s1Rrqwpucw9YMvy6kckpfXHMpgpdNHW6t4VgmTe18uF6rcONnPIq1YB9AqxhqgVF+qFWg/Cbp9fOgXRp+kwNWD7zvqbdgSqAvwLtyXxVi1rZqaDL4Ns/6DSXewUwsRKJvAAAAAElFTkSuQmCC"></span>
        </span>
      </div>
    </div>

    <div id="audioBox" ref="audioBox" v-show="type == 'bar'">
      <div id="progressBar" ref="progressBar" class="progress-bar">
        <div id="progress" ref="progress" class="progress">
          <div id="drag" ref="drag" class="drag"></div>
        </div>

      </div>
      <div class="control">
        <div class="control-btn">
          <span class="ctrl-btn" @click="control();">
            <span v-if="isPlay"><img width="25" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAB2klEQVRoQ+1au0oDQRQ9dxNINkERDFoIIuRDJI0gWlkpiI8ktaWdYGFnp1hIYoyVIFhpoZ34A/oFNqYQxEZxs0LYK4KPINkwM1aJZ+tzZ+Y+5pwDO4J/9sk/yxdMuN87zg6zw31WgfiR3tFUJos9VSyIIOOSd6TYCMuyZRx7oon0M3ZFsCjAgHFcG1CB7WZJ1uNiYxNOVXUmITh32bQ9JnhFGmvyZrJOuqaTnuLKBNsNEySRw7I8dcLEJuxXdV4Ex3/eXDCCojyarJOp6SwUZybYbphIkA+LcseEgXjjwQ47zlnAkY6vHO+w41SRtNoKR1n6KgZZ2vE+kaW7FI4s7ThVZGmydIfRIUs73ieyNFn6pwKUJcdrRFmiLFGWAOqwI4FQh6nD1GH+ebClDxoPGg8aDxoPW974xtN40HjQeNB42BIIjQeNB40HjYctb/Sg8ajonHg4dc70MzAABlGSF5N1Ugc6lQAuTbDdMCoYbxblvhMm/nHpvub8JG4FGHM+gOIiKMu0cfyhDvkRbgSYMI75BVTFdbOBAjYlskv4A13RUd/DkgBZ2wNEikaYRx0FaVnFHumw38KK42vah8BDHasSxu3JF/FW3ehBMDvcg02zOjI7bFWuHgS/A7fGPlur34FWAAAAAElFTkSuQmCC" ></span>
            <span v-if="!isPlay"><img width="25" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAACuElEQVRoQ+2b3XHTQBSFz5We4ic6gA6ACnAJTgfW2DzjVIDcgf0eD6GDUAGhg6QCTAfxi+QZgw4j24JMBktr7Y92bfyqlfZ+e+7unr2yBAq/3oIfSfRF0CdxJ8A8G8utwq3eNZHaiD7xRe8XvkLw5h/tbrIIV0jk0TuqmoBqgS+uORPBh0P3E1iyQLJ+L3ehQNcDL/hdgFdNMARmeYRpCGrXAvcWZBPsn+vE/SZGsknkXvmeDhqaA/4bfJqNZNoBi1KXNoABj9W2A7wfaxKTfCxzpaF31MgqcMlQ7tuMkawTWTpiqu3GOvC+90cSqQ9quwLecpO4zWMkXW5fToErtUEkXVnTLoA7Vbsz4ErtosClS2vaNfBObYfW1AvgPbSTg4g3wE82T6vW1Edgq9bUT2CLBxHfgbdqFzEuTVlT/4F3ahuzpqEAV2ZF+yASFLAJaxoisJY1DRa4rdqhA1cbmHKN/FSASz+uZE1PBriSehPhbV2p+OSASXzJxzI4VNg6OeASNBvJQa7/wE9T4ahXLT7UYHeFwvNK6bNZtEj8IDFsqo+dxBwmMc9jpCr17rCBiVVBDJpUfbq8BAu8XZxiDFVUDRuYWAEYtn1zEZTCBL7lEQbHqhqewsSKgjQfyUx3u/de4VJVRhieRRGPwJUJVUNI6YdNhKGNfwT5mNLTbCSp7lz1/nhYWsOfMQY2VPUupY+xhrrKd5rSqoZfF9IPhYnPWYyJjoloMxDuFda0hm0gO1O4reHXhXQPXB7jBJP1SG5MBt/mWdZT2rQ1bAPpRmGDhl8X0gXwQxFhYMrw+w5s1Rrqwpucw9YMvy6kckpfXHMpgpdNHW6t4VgmTe18uF6rcONnPIq1YB9AqxhqgVF+qFWg/Cbp9fOgXRp+kwNWD7zvqbdgSqAvwLtyXxVi1rZqaDL4Ns/6DSXewUwsRKJvAAAAAElFTkSuQmCC"> </span>
          </span>
          <span class="ctrl-btn repeat" @click="repeat();"><img width="25" src="data:image/png;base64,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"></span>
          <span class="ctrl-btn repeat" v-if="muted" @click="closeVolume()"><img width="25" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODNEMDUzRjlGQjk0MTFFOEIzNEFEMEU5RTA0RkE2NjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODNEMDUzRkFGQjk0MTFFOEIzNEFEMEU5RTA0RkE2NjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4M0QwNTNGN0ZCOTQxMUU4QjM0QUQwRTlFMDRGQTY2MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4M0QwNTNGOEZCOTQxMUU4QjM0QUQwRTlFMDRGQTY2MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pozu2IQAAARnSURBVHjaxFdbbFRVFN1nOtPO3FpKCLYgaoQKaIIECoFQMNoYSagSDUp4mWgwDeERiEReX6DEDw0Bf/ggpv3gwxgENDEF9adoiiHKu+EZM00A+4IQQts7DJ3OYe1799w5be+8SpCdrMzMfZy9ztpnP0ZprelpWtDvYmmj81EkGBB41rf6CROQ6y8CLwCdwA0gNoRgweZHPJDh2VHAO8CXwBrglSxkH8s8AkopD7AkMA2oBpYAS4HnzRftB/QMnppViLMhPrIq0A9cA24Dz4oabwHlwq7WKqE2vH3aIZLFkkmaaE/KrF4mAg+AZuAv4CHwMrCcFM0lTZPB/yd8H8sPWkEqy7Q4EmxrIEDRSJSu2QEaVwiBAVHgCHBVsmE2nH8Mx5+AwHohlssWOtITTbIG6Dc6qEvzJeCEWRT4UUIxGnhfsqMPOJQz5pq2QYW4+4OmR/rpu+wEDuix4Ub9BuL2pmA8rl4ELogqFlAjO/tFVMp2xM+gzK3zCBGtCDXqal8CkQa9ORKkzoCmE4hbs+Acbs0FWoQI20vAVGABsHtQzIm2A/8BWzwHirhq/J76HdL0tb8CmjYqN9ZDbRPQBfwJ3JF3auTemFSBsldjg5q+whrPAd+AxGYjpbYaJGuhdLlPHaDyDEJyGrKMTQJO0bDUh2okmFOmrUZem743NrTbVs67FHJD2CphKAoH6d18DqFps4H5wCXgvLsRmuCkp3aKlZPnsTitxY122ZAV1s6hTe38V+NwziiUANtOScl/gJtybQ62tAifFY4KYerFDhuMxecZNeGqsVblSAiwfSEZ8YekYjGwGHg7VSXhqNUIQ6WhQJcR7oqREpgp/aFVMoN7xkRgpVwvVlIhxWmPkQ2lhhp9IyXA9hHQDUQFvAbH9EMmg8VvG8+eNdSYYFzvzDUPZDPeyR4pRmOEwDhpVh1QgJU5zQcXheznoiKvCtUYa1wZTkBDTpU3CZZ5B3AK6AXek+FlmRSpb7He63B+3akRZVQcuU91qfVB8ujwEChDrvxsqTSkJjkTWgaXMMJQFU/QZ16V7aENnJay0Uv2p6p9mALJANWrJKoe56hKa6Hc35mK1Od4fh7uj/fqAko0nJ0vCTlTVcwOUQWa0C7PD9HewQ1LpmJzSrEa9KCBAie4CU5e9aWQQDiCjrNNkg2W9I29WtFxeDyEpevk9N+IVVEV1apEym/OLEBDarNH0Sw8fjjDI1wLbpF7/5R0TQ7FB1BvFZw3i/NkUtNadp7vPJBWpIdiyo35BiyUyDDC8Tngw9UGlEi35K7IteAYhyter44VMpD42X6nJ+h0VbOLKRWvHhnjuObfk9RkW5RUdBBK7CtkJMsy2dLfmO9ew9fjUKMX08Gd9PmiDlGhRUq1U4oxY0TJv9WnCfChSCFnSNxqVwcyZVZ0UEg4LS8DP0jnZKdTgMkcFj8fT+LPBhemk5KWAzJb2u4okP9fs8e1uzIz/iuOWZX4/0kgIanZbWRJwn9yfsp/zx8JMADmllgquHJTOwAAAABJRU5ErkJggg=="></span>
          <span class="ctrl-btn repeat" v-if="!muted" @click="closeVolume()"><img width="25" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADW0lEQVRYR+2WS4gcVRSGv7/nka4iwUdixIgYGSEGIxECIoqL+EIYXIhGRELQrkqyCEFM1GQjSnbGVxZGkKmaIROCpAMuRAPBiCC6VCSQhaLiA4zgIxi1qseZ6SNVuTXTmeluuudBNtOre6rPPfe7/z3nnisu80+XeX2WAOauwGFb7vezLtmuL+ZzjHMCKMe2uWRUEauSGivYpX9aQZSH7KbazfzMZk008+kO4BPr9b/jgIn9wuXPBGuSnTrXLLgX2QsSrxh8n5a4m6f160y/jgG8YbuBOlWJOy8J0h7gtMR9ub9xJunnLrbp38b5HQEsi2ywB44hrpi10zYA/pBtMvG5xLKLDLybBnqyNcA7tqrcx61MTpenxKDEcy0TrQ1ANqccWaUk4mL+uNg0XtGXhT2lgBfbHuCgoKerrG4A8GLbD+wGDqWBXi3i+LGdAh509ukk0AOzASL7QeLGrhbPnAsAM3kxExIlJ/feNNAb2bgvto198JX7PplOsJKd+iuzpxTwYzsPXDlnAMCL7KjE1nwhI0lLrKWi3zLbj+0McFs2rsPWWqBjCw7AYVvulflasMYttKMWaCgbe7Flx/u8g3stDZWPF1QBt9MDwItOyZEkUGVmMppxNA21bVEAvMi2SFRzAONkEmowG+alLD5wYKeSQA8tCoAf2y7gLSf18TTUE+4IHhccd9/fS0M9uigAXmTZbbnFLbQvDXUwB4jsWYm8Ksx4Ow2VgS5sDpSH7d6S8XFRSZOTrBvboW+cAicEjzmA3WmoXKXpJIzsD8TV8yzD6bvEOJKEeiqPV7V+7wLnJXwX//ok0C8zFfgIuH8+AH5svwMrzfgxHWND0aazW1bwukvMs0moDcU6UwqUR2yt6jyDcTtq6AUX7dlNqIjQ2AtGbbX/H48kcIJQf+Yuo7baG+dbwYrMrBtBLdTwLIBWO88eFCXxIWJ9U592zahqPd4FPitauBk/pQMMND5OOmrHVM3z/ma0SKJLQNq149heAl52iVevGw+PbdfJxvmdAbgZWY2bcUiidypIhw8SM/akod6cqWJXAK6e7xC8j7g2s5MS1zV7amX/9Y/YLb119tXFp7WKRpodYdcAeZBhu8Y3jphxTzrAVa0enJ1U1NwAOoncoc8SwJIC/wMCH3QwdIjSRAAAAABJRU5ErkJggg=="></span>
          <span class="ctrl-btn stop" @click="stop();"><img width="25" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAACKUlEQVRoQ+1a3VHCQBD+NuiM8CIlYAVSAiVoBZJJCsAKxAqQZ2FICVgBdiAdiBUILwkzCusc/gyQkByZIebC3lOY3LH77e73XR4+wpEtOjK8EMBJHT8dcL3EOE/al8X7BWH2YdN4n1haHT4bcM1a4g7AFYDqPgEOvZeBCYAhW+jObVLPsSsRcLnPHQJaSX+Uk/dt36H7uFx2Ax5wtbLACIR6TsBopcGMYVCCDZumUQd2Ai73eESEhlaU/G3yfIdsbcCVPreBFWeNXQzcBg49bAMId1iN8hKveROnFJWf+hYutkc7BLgI3f0tzhKw5w5568UKA+7xi2lCtav7zHgKXFJX6d+K6jCnGJ/cHvEd2sC48ePnA0PxtzArHvAjNywLo8KgBSCA17t5Jh02f7hlpGWkRaXN5rFwWDgsHBYOG1UBES0RLREtoygbSlY4LBwWDguHjaqAiJaIloiWUZSVDw8RLREtES0RLaMqECta+Da0vBuFKCHZeMAAKn0ujuWBMfNd2rBKRnk8lFnzsghd1jK1lPvcIqBTBMBatqUVjxeYgPJhEU5beGa8BS7Vts9Hei0L0WXGte/SUAuw2lTpsQfCTdoK/+c5ZnQDlyItz7F+aRNBx4FVTdAxiLeI0c47pxVnlZE9aozXpy0R8GrzgKvlJZoENPN2ZamrB4TnwIK3yxS+P+AtQiqLIj4RUsAseTs/wVgHoLZoZZl8lrH0RjrLjA4c6+gAfwEciRRMJ/lPRgAAAABJRU5ErkJggg=="></span>
        </div>
        <div class="time"><span ref="percent"></span>
          <span id="currentTime">{{currentTime}}</span> /
          <span id="countTime">{{countTime}}</span>
        </div>
      </div>

    </div>

  </span>
</template>

<script>
export default {
  name: 'AudioBox',
  props: {
    url: {
      type: String,
      default: ''
    },
    // 样式风格 1、bar  2、circle
    type: {
      type: String,
      default: 'bar'
    },
    width: {
      type: String,
      default: '30'
    },
    height: {
      type: String,
      default: '30'
    }
  },
  data () {
    return {
      svgStyle: {
        width: this.width + 'px',
        height: this.width + 'px'
      },
      intervalTimer: '',
      isPlay: false,
      muted: false, // 是否静音
      currentTime: '00:00',
      countTime: '00:00',
      textCircle: '0%',

      isTouch: false// 是否正常触摸滚动条

    }
  },
  mounted () {
    this.addListenTouch()
  },
  methods: {
    // 点击暂停播放
    control () {
      let audio = this.$refs.audio

      if (audio !== null) {
        if (audio.paused) {
          audio.play()// 播放
          this.isPlay = true
          
        } else {
          audio.pause()// 暂停
          this.isPlay = false
        }
      }
    },
    // 重新播放
    repeat () {
      this.stop()
      this.control()// 播放
    },
    // 停止播放
    stop () {
      let audio = this.$refs.audio

      this.isPlay = false
      this.currentTime = '00:00'
      audio.load()// 停止
      this.setProgress(0)
      this.$refs.drag.style.left = 0
      this.$refs.progress.style.width = 0
      clearInterval(this.intervalTimer)
    },
    // 静音控制
    closeVolume () {
      let audio = this.$refs.audio
      this.muted ? audio.volume = 1 : audio.volume = 0
      this.muted = !this.muted
    },
    // 格式化播放时间
    timeFormat (time) { // 传入的是秒，要格式化成时间格式
      // 分钟
      let minute = time.toFixed(0) / 60
      let minutes = parseInt(minute)
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      // 秒
      let seconds = parseInt(time % 60)
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      let allTime = '' + minutes + '' + ':' + '' + seconds + ''
      // console.log('allTime='+allTime);
      return allTime
    },
    // 设置环形百分比
    setProgress (angle) {
      let leftContent = document.querySelector('.left-content')
      let rightContent = document.querySelector('.right-content')

      if (angle < 1) {
        leftContent.setAttribute('style', 'transform: rotate(' + 0 + 'deg)')
        rightContent.setAttribute('style', 'transform: rotate(' + 0 + 'deg)')
      }

      if (angle > 360) {
      } else {
        if (angle > 180) {
          // rightContent.setAttribute('style', 'transform: rotate('+180+'deg)');
          leftContent.setAttribute('style', 'transform: rotate(' + (angle - 180) + 'deg)')
        } else {
          rightContent.setAttribute('style', 'transform: rotate(' + angle + 'deg)')
        }

        this.textCircle = parseInt(angle * 100 / 360) + '%'
      }
    },
    // 添加播放触摸控制
    addListenTouch () {
      // --创建页面监听，等待微信端页面加载完毕 触发音频播放
      document.addEventListener('DOMContentLoaded', function () {
        function audioAutoPlay () {
          let audio = document.getElementById('audio')
          audio.play()
          document.addEventListener('WeixinJSBridgeReady', function () {
            audio.play()
          }, false)
        }
        audioAutoPlay()
      })

      this.$refs.drag.addEventListener('touchstart', this.touchStart, false)
      this.$refs.drag.addEventListener('mousedown', this.touchStart, false)
      this.$refs.drag.addEventListener('touchmove', this.touchMove, false)
      this.$refs.drag.addEventListener('mousemove', this.touchMove, false)
      this.$refs.drag.addEventListener('touchend', this.touchEnd, false)
      this.$refs.drag.addEventListener('mouseup', this.touchEnd, false)
    },
    touchStart (e) {
      e.stopPropagation()
      this.isTouch = true
      // console.log(`鼠标按下 touchStart=${touch.pageX}`);
    },
    touchMove (e) { // 滑动
      // e.preventDefault();
      let audio = this.$refs.audio
      let progressBar = this.$refs.progressBar
      let progress = this.$refs.progress
      let drag = this.$refs.drag
      let x

      if (!e.touches) { // 兼容移动端
        x = e.clientX
      } else { // 兼容PC端
        x = e.touches[0].pageX
      }

      let lineDivLeft = this.getPosition(progressBar).left // 长线条的横坐标
      let dragDot = x - lineDivLeft // 小方块相对于父元素（长线条）的left值

      if (dragDot >= progressBar.offsetWidth - 15) {
        dragDot = progressBar.offsetWidth - 15
      }
      if (dragDot < 0) {
        dragDot = 0
      }

      // 设置拖动后小方块的left值
      drag.style.left = dragDot + 'px'
      progress.style.width = dragDot + 15 + 'px'

      // percent.innerText = parseInt((dragDot / (progressBar.offsetWidth - 15)) * 100); //百分比
      this.currentTime = this.timeFormat(progress.offsetWidth / progressBar.offsetWidth * audio.duration)

      // console.log(`touchMove=${this.x}`);
    },
    touchEnd (e) { // 手指离开屏幕
      // console.log("鼠标弹起");
      let audio = this.$refs.audio
      let progressBar = this.$refs.progressBar
      let progress = this.$refs.progress

      this.isTouch = false

      let currentTime = progress.offsetWidth / progressBar.offsetWidth * audio.duration

      // console.log(`jd=${progress.offsetWidth / progressBar.offsetWidth}`);
      // console.log(`progress.offsetWidth=${progress.offsetWidth}`);
      // console.log(`currentTime=${currentTime}`);

      audio.currentTime = currentTime
    },
    // 获取元素的绝对位置
    getPosition (node) {
      let left = node.offsetLeft // 获取元素相对于其父元素的left值var left
      let top = node.offsetTop
      let current = node.offsetParent // 取得元素的offsetParent
      // 一直循环直到根元素

      while (current != null) {
        left += current.offsetLeft
        top += current.offsetTop
        current = current.offsetParent
      }
      return {
        'left': left,
        'top': top
      }
    },
    // 当时间进度改变时
    onTimeUpdate (res) {
      console.log(`时间进度改变了。`)

      let _this = this
      let audio = this.$refs.audio
      let progress = this.$refs.progress
      let drag = this.$refs.drag

      _this.countTime = _this.timeFormat(audio.duration) // 总时间
      // console.log('audio runing~');

      if (!_this.isTouch) { // 如果拖动了进度条，此段暂停执行
        _this.currentTime = _this.timeFormat(audio.currentTime) // 当前时间
        progress.style.width = (audio.currentTime / audio.duration) * 100 + '%'// 进度条
        if (progress.offsetWidth > 9) {
          drag.style.left = progress.offsetWidth - 10 + 'px'// 进度条
        }
      }

      let audioProgress = ((360 / audio.duration) * audio.currentTime).toFixed(2)
      _this.setProgress(audioProgress)
      if (audioProgress === 360) {
        _this.stop()// 播放完成后停止
      }
    },
    // 当发生错误, 就出现loading状态
    onError (res) {
      console.log({content: '播放失败~', skin: 'msg', time: 2})
    },
    // 当音频开始等待
    onWaiting (res) {
      console.log(res)
      // layer.open({content: '音频开始加载：'+JSON.stringify(res),skin: 'msg',time: 2});
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata (res) {
      console.log('loadedmetadata')
      // layer.open({content: '数据加载完成'+JSON.stringify(res),skin: 'msg',time: 2});
      this.countTime = this.timeFormat(res.target.duration)

      // this.audio.maxTime = parseInt( this.$refs.audio.duration);
      // console.log("总时间",this.$refs.audio.duration);
    },
    // 当播放器播放完毕 执行的回调函数
    onEnd (res) {
      console.log(`播放完毕了 ${res}`)
    }

  }
}
</script>

<style scoped>
  body {
    -webkit-touch-callout: none !important;
    -webkit-overflow-scrolling: touch;
  }
  img,a{
    pointer-events: none;
  }

  .progress-bar{
    height:15px;
    background: #cecece;
    position: relative;
    border-radius:10px;
  }

  .progress{
    height:15px;
    background: #0A9DFF;
    border-radius:10px;
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .drag{
    position: absolute;
    z-index: 99;
    width: 20px;
    height: 20px;
    top: -2px;
    left: -3px;
    background-color: #0A9DFF;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    -webkit-box-shadow: 0 0 4px hsla(0,0%,100%,.5);
    box-shadow: 0 0 4px hsla(0,0%,100%,.5);
  }
  .drag:before {
    content: "";
    position: absolute;
    left: -25px;
    top: -25px;
    width: 30px;
    height: 30px;
    padding: 20px;
    /* background: red; */
  }

  .control{
    display:flex;
    justify-content:space-between;
    align-items: center;
    margin-top:20px;
  }
  .control-btn{
    display:flex;
    justify-content:flex-start;
    align-items: center;
    flex-grow:1;
  }
  .ctrl-btn{
    border-radius:5px;
    margin-top:10px;
    margin-right:10px;
    display:inline-block;
    width:60px;
    height:30px;
    line-height:30px;
    /*background: #fff;*/
    color:#0A9DFF;
  }

  .con {
    position:relative;
    display:inline-block;
    height:60px;
    width:60px;
  }

  .percent-circle {
    position:absolute;
    height:100%;
    background:#0A9DFF;
    overflow: hidden;
  }

  .percent-circle-right {
    right:0;
    width:30px;
    border-radius: 0 30px 30px 0/0 30px 30px 0;
  }

  .percent-circle-right .right-content{
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    transform-origin:left center;
    transform: rotate(0deg);
    border-radius: 0 30px 30px 0/0 30px 30px 0;
    background:#bbb;
  }
  .percent-circle-right .right-content:after{
    /*content: '';
    border: 10px solid red;
    border-radius: 50%;
    left: -10px;
    bottom: 180px;
    position: absolute;*/
  }
  .percent-circle-left {
    width:30px;
    border-radius: 30px 0 0 30px/30px 0 0 30px;
  }

  .percent-circle-left .left-content {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    transform-origin:right center;
    transform: rotate(0deg);
    border-radius: 30px 0 0 30px/30px 0 0 30px;
    background:#bbb;
  }
  .percent-circle-left .left-content:after{
    /*content: '';
    border: 10px solid red;
    border-radius: 50%;
    left: 90px;
    bottom: 0px;
    position: absolute;*/
  }
  .time{
    color:#0A9DFF;
  }
  .text-circle {
    position: absolute;
    display:flex;
    align-items: center;
    justify-content: center;
    height:80%;
    line-height: 80%;
    width:80%;
    left:10%;
    top:10%;
    border-radius:100%;
    background:#FFF;
    color:#0A9DFF;
  }
  .play-btn{

  }

</style>
