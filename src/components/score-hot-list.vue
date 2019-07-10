<template>
    <div class="side_item dynamic_hot">
        <h2 class="title">HOT</h2>
        <score-null :width="120" v-if="!data.list.length && !data.loading"></score-null>
        <ul class="dynamic_hot_list" v-else>
            <!--<li class="" v-for="(item,index) in data.list" :key="index" @click="toPost(item)">-->
            <li class="flex justify_between" v-for="(item,index) in data.list" :key="index">
                <router-link :to="{path:'/post',query:{id:item.dynamic_id}}" class="flex justify_between">
                    <div class="dynamic_hot_info">
                        <h3>{{item.title}}</h3>
                        <p>Posted by {{item.nickname}} {{item.add_time}}</p>
                    </div>
                    <img :src="(item.video[0].image_url || 'static/image/video_img.png' )+'?x-oss-process=image/resize,m_fill,h_58,w_87,limit_0'" class="dynamic_hot_pic" v-if="item.video.length !== 0">
                    <img :src="(item.picture[0].image_url5 ? item.picture[0].image_url5 : item.picture[0].image_url) +'?x-oss-process=image/resize,m_fill,h_58,w_87,limit_0' " class="dynamic_hot_pic" v-else-if="item.picture.length !== 0">
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
	export default {
		props: {
			data: {
				type: Object,
				default: function () {
					return {
						pageTotal: 0,
						count: 0,
						list: [],
						params: {
							limit: 10,
							page: 0
						},
						type: 'room'
					}
				}
			},
			status: {
				type: String,
				default: ''
			},
			path: {
				type: String,
				default: '/room/'
			},
			field: {
				type: String,
				default: ''
			}
		},
		computed: {
			member () {
				return this.$store.state.member
			},
			isMore () {
				return this.data.count == this.data.params.limit
			}
		},
		data () {
			return {
				view_mode_type:'view_mode_big',
				options: {
					type: {
						1: 'view_mode_big',
						2: 'view_mode_mid',
						3: 'view_mode_small',
					},
					extClass: {
						0: 'datetime',
						1: 'rank',
						2: 'reward'
					},
					room: {
						label: '入场费'
					},
					order : {
						label: '详情',
						text: '查看详情'
					}
				},
				random: Math.random() * 10
			}
		},
		methods: {
			toPost (item) {
				const HOST = {
					'dev.famulei.com': '/en',//线上域名匹配
					'staging-1.famulei.com': '/en',
					'staging-2.famulei.com': '/en',
					'staging-3.famulei.com': '/en',
					'localhost': '',
				};
				this.$router.push(HOST[location.hostname]+'/post?id=' + item.dynamic_id)
			},
			toUser (item) {
				const HOST = {
					'lfl.gg': 'api-v2',//线上域名匹配
					'staging-1': 'staging-1',
					'staging-2': 'staging-2',
					'staging-3': 'staging-3',
					'localhost': 'staging-1',
				};
				const _HOST = HOST[location.hostname] + '.famulei.com';
				window.open('https://'+_HOST+'/u/'+item.member_id,'_blank')
            },
		}
	}
</script>

<style lang="stylus">
    .dynamic_hot{
        padding 0 12px
        .dynamic_hot_list{
            li{
                border-bottom 1px solid #F0F1F2
                cursor pointer
                padding 8px 0
                a{
                    width 100%
                }
                .dynamic_hot_info{
                    h3{
                        min-height 40px
                        line-height 20px
                        font-size:14px;
                        font-family:SFProDisplay-Semibold;
                        font-weight:600;
                        margin-bottom 4px
                    }
                    p{
                        line-height 14px
                        font-size:12px;
                        font-weight:400;
                        color #A8ABB3
                    }

                }
                .dynamic_hot_pic{
                    display block
                    flex: 0 0 87px;
                    width 87px
                    height 58px
                    border-radius 4px
                    margin-left 10px
                }
            }

        }
    }
</style>
