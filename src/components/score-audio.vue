<template>
    <div class="audio-box" v-if="src" :style="{marginTop: mt}">
        <div class="list-items-radio">
            <div class="cubeshape">
                <div class="item-cube items-radio-first cl" :style="{'background-image': 'url(https://img1.famulei.com/active/wx_share/radio.png)'}" @click="audioPlay" v-show="!isPlay">
                    <div class="radio-left flex fl">
                        <svg class="icon" aria-hidden="true"><use xlink:href="#icon-audio"></use></svg>
                        <span class="radio-text">Click to listen</span>
                    </div>
                    <div class="radio-right fr">{{ duration }}"</div>
                </div>
                <div class="item-cube items-radio-first cl" :style="{'background-image': 'url(https://img1.famulei.com/active/wx_share/radio.png)'}" v-show="isPlay">
                    <div class="radio-left flex fl playing" v-show="isPlay">
                        <svg class="icon" aria-hidden="true" @click="audioPause"><use xlink:href="#icon-pause"></use></svg>
                        <div class="duration-bar"><div class="curr-bar" :style="{'width': width}"></div></div>
                    </div>
                    <div class="radio-right fr">{{ currentTime }}"</div>
                </div>
                <div class="item-cube items-radio-second cl">
                    <audio preload="auto" class="audio-play" ref="audio"></audio>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		data () {
			return {
				isPlay: false,
				animation: {},
				animationData: {},
				innerAudioContext: {},
				currentTime: 0
			}
		},
		props: {
			commentType: {
				type: String,
				default: ''
			},
			cid: {
				type: String,
				default: ''
			},
			src: {
				type: String,
				default: ''
			},
			duration: {
				type: Number,
				default: 0
			},
			stop: {
				type: Boolean,
				default: false
			},
			mt: {
				type: String,
				default: '10px'
			}
		},
		watch: {
			stop (newVal, old) {
				console.log(newVal);
				if (newVal) {
					this.innerAudioContext.stop()
					this.isPlay = false
				}
			},
		},
		computed: {
			width () {
				console.log(this.currentTime,this.duration)
				return Math.round(this.currentTime / (this.duration || 0) * 100) + '%'
			},
		},
		methods: {
			audioPlay () {
				console.log(this.currentTime,this.duration);
				// this.animation.rotate3d(1, 0, 0, 360).step()
				// this.animationData = this.animation.export()
				/*
                setTimeout(() => {
                }, 100)
                */
				// 通知父级是否需要关闭上一个音频
				this.$emit('setAudioStop', {type: this.commentType, cid: this.cid})
				// // 播放当前音频
				if (!this.isPlay) {
					this.isPlay = true
					this.innerAudioContext.src = this.src
					this.innerAudioContext.play()
					this.addEventListeners()
				}
			},
			audioPause () {
				this.isPlay = false
				this.innerAudioContext.pause()
			},
			addEventListeners: function () {
				const _this = this;
				_this.$refs.audio.addEventListener('timeupdate', _this._currentTime)
					// _this.$refs.audio.addEventListener('canplay', _this._durationTime)
			},
			_currentTime: function () {
				const _this = this;
				_this.currentTime = parseInt(_this.$refs.audio.currentTime)
			},
			// _durationTime: function () {
			// 	const _this = this;
			// 	_this.duration = parseInt(_this.$refs.audio.duration)
			// }
		},
		mounted () {
			// this.addEventListeners()
			this.innerAudioContext = this.$refs.audio

			// this.innerAudioContext.Play(() => {
			// })
			// this.innerAudioContext.onTimeUpdate(() => {
			// 	this.currentTime = this.$refs.audio.currentTime
			// })
			// this.innerAudioContext.onEnded(() => {
			// 	this.isPlay = false
			// 	this.currentTime = 0
			// })
			// this.innerAudioContext.pause(() => {
			// 	this.isPlay = false
			// 	this.currentTime = 0
			// })
			/*
            this.animation = wx.createAnimation({
              duration: 600,
              timingFunction: 'ease'
            })
            */
		}
	}
</script>

<style lang="stylus">
    /* 音频部分显示*/
    .audio-box {
        /*margin-top: 10px*/
        .list-items-radio{
            cursor pointer
            width: 100%
            height:60px
            .cubeshape {
                width: 100%;
                height: 60px;
                position relative
                .item-cube {
                    position: absolute;
                    width: 100%
                    height: 100%
                    background-repeat no-repeat
                    background-position center
                    background-size: 100%
                    transition opacity .3s, z-index .3s, visibility .3s;
                    &.items-radio-first {
                        z-index 1
                        visibility visible
                        opacity 1
                        .radio-left{
                            margin:13px 0 0 20px
                            align-items center
                            .icon{
                                width 16px
                                height 16px
                                color: #fff
                            }
                            .radio-text{
                                margin-left: 9px
                                font-size: 15px
                                color: #FFF
                            }
                            .duration-bar {
                                width 100%
                                height 2px
                                background #3ca3ff
                                margin-left 9px
                                .curr-bar {
                                    height 100%
                                    background #fff
                                }
                            }
                            &.playing {
                                width 70%
                            }
                        }
                        .radio-right{
                            margin-top: 14px
                            margin-right: 20px
                            font-size: 15px;
                            line-height: 20px
                            color: #FFFFFF;
                        }
                    }
                    &.items-radio-second {
                        z-index -1
                        visibility hidden
                        opacity 0
                        .items-radio-left {
                            margin:15px 0 0 16px
                            .icon-player{
                                font-size 12px
                                color: #fff
                            }
                        }
                        .items-radio-right{}
                    }
                }

                &.turn {
                    .item-cube {
                        &.items-radio-first {
                            z-index -1
                            visibility hidden
                            opacity 0
                        }
                        &.items-radio-second {
                            z-index 1
                            visibility visible
                            opacity 1
                        }
                    }
                }

                &.rotate {
                    animation: rotate-y 0.3s;
                }
            }
        }
    }
</style>