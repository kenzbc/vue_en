<template>
    <div class="circle-list">
        <score-null :width="120" v-if="!data.list.length && !data.loading"></score-null>
        <article v-else v-for="(item,index) in data.list" :key="index">
            <!--列表大-->
            <div class="score-list-item view_type_big" v-if="data.view_mode_type == 'view_mode_big'">
                <div class="member">
                    <div class="avatar">
                        <img :src="item.avatar || '/en/static/image/avatar.jpg'" class="avatar_img">
                        <img src="/en/static/image/staff.png" class="member_type" v-if="item.member_type == '2'">
                        <img src="/en/static/image/v.png" class="member_type" v-else-if="item.member_type == '1'">
                    </div>
                    <p class="nickname">Posted by <span @click.stop="toUser(item)">{{item.nickname}}</span><span class="time">{{item.add_time}}</span></p>
                </div>
                <div class="flex justify_between">
                    <div class="content">
                        <h2 class="title" @click="toPost(item)"><span class="top" v-show="item.is_top == '1'">Top</span><span v-html="item.title"></span></h2>
                        <p class="summary" v-html="item.summary" @click="toPost(item)"></p>
                        <div class="video" v-if="item.video.length !== 0 && item.video[0].video_type == '1'">
                            <video :src="item.video[0].video_url" id="list_video" width="100%" height="" controls style="max-height: 500px"></video>
                        </div>
                        <div class="video" v-if="item.video.length !== 0 && item.video[0].video_type == '0'" @click="toPost(item)">
                            <img :src="item.video[0].image_url || '/en/static/image/video_img.png'+'?x-oss-process=image/resize,m_fill,h_580,w_580,limit_0'" class="video_img">
                            <img src="/en/static/image/video_icon.png" class="video_icon">
                        </div>
                    </div>
                    <div class="pic" v-if="item.picture.length !== 0 && item.video.length == 0" @click="toPost(item)">
                        <img :src="(item.picture[0].image_url5 ? item.picture[0].image_url5 : item.picture[0].image_url) + '?x-oss-process=image/resize,m_fill,h_120,w_180,limit_0'">
                        <span v-show="item.picture.length >= 2">{{item.picture.length}}P</span>
                    </div>
                </div>
                <div class="operate">
                    <a href="javascript:" :class="{'active': item.is_praise == '1'}" @click.stop="postAction('like',item,index)"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-like"></use></svg>{{item.praise_count == '0' ? 'Like' : item.praise_count }}</a>
                    <!--<a href="javascript:" @click.stop="postAction('unlike',item)"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-unlike"></use></svg>Unlike</a>-->
                    <a href="javascript:"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-comment"></use></svg>{{item.comment_count || 'Comment'}}</a>
                    <el-dropdown class="nav-select">
                        <span class="el-dropdown-link">
                            <a href="javascript:"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-share"></use></svg>Share</a>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <a href="javascript:window.open('https://www.facebook.com/sharer.php?u='+encodeURIComponent(document.location.href),'_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=450,top=100,left=350')">
                                    facebook
                                </a>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <a href="javascript:window.open('https://twitter.com/home?status='+'My Item  '+encodeURIComponent(document.location.href)+' '+encodeURIComponent(document.title),'_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=450,top=100,left=350')">
                                    twitter
                                </a>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <!--列表中-->
            <div class="score-list-item view_type_mid flex justify_between" v-else-if="data.view_mode_type == 'view_mode_mid'">
                <div class="content">
                    <h2 class="title"><span class="top" v-show="item.is_top == '1'">Top</span><span v-html="item.title"></span></h2>
                    <p class="summary" v-html="item.summary"></p>
                    <div class="member flex align_center justify_between">
                        <div class="avatar">
                            <img :src="item.avatar || '/en/static/image/avatar.jpg'" class="avatar_img">
                            <img src="/en/static/image/staff.png" class="member_type" v-if="item.member_type == '2'">
                            <img src="/en/static/image/v.png" class="member_type" v-else-if="item.member_type == '1'">
                        </div>
                        <p class="nickname"><span @click.stop="toUser(item)">{{item.nickname}}</span><span class="time">{{item.add_time}}</span></p>
                        <a href="javascript:" :class="[{'active': item.is_praise == '1'},'operate']" @click.stop="postAction('like',item,index)"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-like"></use></svg>{{item.praise_count || 'Like'}}</a>
                        <!--<a href="javascript:" class="operate" @click.stop="postAction('unlike',item)"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-unlike"></use></svg>Unlike</a>-->
                        <a href="javascript:" class="operate"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-comment"></use></svg>{{item.comment_count || 'Comment'}}</a>
                        <el-dropdown class="nav-select">
                            <span class="el-dropdown-link">
                                <a href="javascript:" class="operate"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-share"></use></svg>Share</a>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <a href="javascript:window.open('https://www.facebook.com/sharer.php?u='+encodeURIComponent(document.location.href),'_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=450,top=100,left=350')">
                                        facebook
                                    </a>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <a href="javascript:window.open('https://twitter.com/home?status='+'My Item  '+encodeURIComponent(document.location.href)+' '+encodeURIComponent(document.title),'_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=450,top=100,left=350')">
                                        twitter
                                    </a>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="video" v-if="item.video.length !== 0">
                    <img :src="item.video[0].image_url || 'static/image/video_img.png'+'?x-oss-process=image/resize,m_fill,h_580,w_580,limit_0'" class="video_img">
                    <img src="/en/static/image/video_icon.png" class="video_icon">
                </div>
                <div class="pic" v-else-if="item.picture.length !== 0">
                    <img :src="(item.picture[0].image_url5 ? item.picture[0].image_url5 : item.picture[0].image_url)+ '?x-oss-process=image/resize,m_fill,h_120,w_180,limit_0'">
                    <span v-show="item.picture.length >= 2">{{item.picture.length}}P</span>
                </div>
            </div>
            <!--列表小-->
            <div class="score-list-item view_type_small" v-else-if="data.view_mode_type == 'view_mode_small'">
                <div class="content">
                    <h2 class="title"><span class="top" v-show="item.is_top == '1'">Top</span><span v-html="item.title"></span></h2>
                    <div class="member flex align_center justify_between">
                        <p class="nickname">{{item.nickname}}<span class="time">{{item.add_time}}</span></p>
                        <a href="javascript:" :class="[{'active': item.is_praise == '1'},'operate']" @click.stop="postAction('like',item,index)"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-like"></use></svg>{{item.praise_count == '0' ? 'Like' : item.praise_count }}</a>
                        <!--<a href="javascript:" class="operate" @click.stop="postAction('unlike',item)"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-unlike"></use></svg>Unlike</a>-->
                        <a href="javascript:" class="operate"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-comment"></use></svg>{{item.comment_count || 'Comment'}}</a>
                        <el-dropdown class="nav-select">
                            <span class="el-dropdown-link">
                                <a href="javascript:" class="operate"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-share"></use></svg>Share</a>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <a href="javascript:window.open('https://www.facebook.com/sharer.php?u='+encodeURIComponent(document.location.href),'_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=450,top=100,left=350')">
                                        facebook
                                    </a>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <a href="javascript:window.open('https://twitter.com/home?status='+'My Item  '+encodeURIComponent(document.location.href)+' '+encodeURIComponent(document.title),'_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=450,top=100,left=350')">
                                        twitter
                                    </a>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
        </article>
        <!--详情弹窗-->
        <!--<el-dialog title="" :show-close="faiflse" customClass="post_dialog" top="50px" :lock-scroll="false" :visible.sync="dialogPostVisible" @close='closePostDialog()'>-->
        <div class="post_dialog" v-if="dialogPostVisible" v-on:click.self="closePostDialog()">
            <div class="post_dialog_wrap container">
                <div class="post_header">
                    <div class="post_header_wrap flex align_center">
                        <a href="javascript:" :class="[{'active': dialogPostData.is_praise == '1'},'like flex']" @click.stop="postAction('like',dialogPostData,'-1')"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-like"></use></svg>{{dialogPostData.praise_count == '0' ? 'Like' : dialogPostData.praise_count }}</a>
                        <p class="title" v-html="dialogPostData.title"></p>
                        <a href="javascript:" class="close" @click="closePostDialog()"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-close"></use></svg>Close</a>
                    </div>
                </div>
                <div class="post_dialog_main">
                    <score-post :data="dynamic_id"></score-post>
                </div>
            </div>
        </div>

        <!--</el-dialog>-->
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
							limit: 20,
							page: 1
						},
						type: 'post'
					}
				}
			},
			status: {
				type: String,
				default: ''
			},
			path: {
				type: String,
				default: '/post/'
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
				dynamic_id:'',
				dialogPostVisible: false,
				dialogPostData:{}
			}
		},
		methods: {
			isLogin () {
				if (!this.member.info) {
					this.$root.hub.$emit('showLogin')
				}
			},
			toPost (item) {
				if(document.body.clientWidth <= 960){
					this.$router.push({path: '/post/', params: {id: item.dynamic_id}})
                }else{
					var myVideo = document.getElementById("list_video");
					if(myVideo){
						myVideo.pause();
					}
					const HOST = {
						'dev.famulei.com': '/en',//线上域名匹配
						'www.famulei.com': '/en',//线上域名匹配
						'score.gg': '/en',//线上域名匹配
						'staging-1.famulei.com': '/en',
						'staging-2.famulei.com': '/en',
						'staging-3.famulei.com': '/en',
						'score.vcentos.com': '/en',
						'localhost': '/en',
					};
					this.dynamic_id = item.dynamic_id;
					window.history.pushState(null,null,HOST[location.hostname]+'/post/'+item.dynamic_id);//路由跳转到指定贴子
					this.dialogPostData = item;
					this.dialogPostVisible = true;
					document.body.className = 'no_scroll'
                }

			},
			closePostDialog(){
				const HOST = {
					'dev.famulei.com': '/en',//线上域名匹配
					'www.famulei.com': '/en',//线上域名匹配
					'score.gg': '/en',//线上域名匹配
					'staging-1.famulei.com': '/en',
					'staging-2.famulei.com': '/en',
					'staging-3.famulei.com': '/en',
					'localhost': '',
				};
				this.dynamic_id = '';
				// document.querySelector('#container').scrollTop = 0
				this.dialogPostVisible = false;
				window.history.replaceState(null,null,HOST[location.hostname]+'/');//路由修正到首页;
				document.body.className = ''
            },
			toUser (item) {
				let _HOST = ''
				let HOST = {
					'localhost': 'staging-1',
				}
				if(HOST[location.hostname] ){
					_HOST = '//'+HOST[location.hostname] + '.famulei.com'
				}
				window.open(_HOST+'/u/'+item.member_id,'_blank')
            },
			postScroll(){
				return false
            },
			postAction (type,item,index) {
				switch (type) {
					case 'like':
						this.isLogin();
						if (!this.member.info) return
						if(item.is_praise == '1'){
							this.api('/services/dynamic/dynamic_praise_cancel.php',{dynamic_id:item.dynamic_id}).then(req => {
								this.$message(req.message);
								if (req.code == 200) {
									if(index == '-1'){
										this.dialogPostData.is_praise = '0'
										this.dialogPostData.praise_count = parseInt(this.dialogPostData.praise_count) - 1;
                                    }else{
										this.data.list[index].is_praise = '0';
										this.data.list[index].praise_count = parseInt(this.data.list[index].praise_count) - 1;
                                    }
								}
							});
                        }else{
							this.api('/services/dynamic/dynamic_praise.php',{dynamic_id:item.dynamic_id}).then(req => {
								this.$message(req.message);
								if (req.code == 200) {
									if(index == '-1'){
										this.dialogPostData.is_praise = '1'
										this.dialogPostData.praise_count = parseInt(this.dialogPostData.praise_count) + 1;
									}else{
										this.data.list[index].is_praise = '1';
										this.data.list[index].praise_count = parseInt(this.data.list[index].praise_count) + 1;
									}
								}
							});
                        }
						break;
					case 'share':
						console.log(type);
						break;
				}
			},

		}
	}
</script>

<style lang="stylus">
    .circle-list{

        .score-list-item{
            cursor pointer

            &.view_type_big{
                border-bottom 1px solid #F0F1F2
                padding 16px 24px
                .member{
                    display block
                    line-height 20px
                    margin-bottom 6px
                    .avatar{
                        position relative
                        margin-right 6px
                        float left
                        .avatar_img{
                            display block
                            width 20px
                            height 20px
                            border-radius 50%
                        }
                        .member_type{
                            display block
                            width 12px
                            height 12px
                            position absolute
                            right -4px
                            bottom -4px
                        }
                    }
                    .nickname{
                        color #A8ABB3
                        font-size:14px;
                        /*font-family:PingFangSC-Semibold;*/
                        font-weight:400;
                        .time{
                            display inline-block
                            font-size:12px;
                            font-weight:400;
                            margin-left 12px
                        }
                    }
                }
                .content{
                    flex-direction: column;
                    word-break: break-word;
                    flex: 1 1 100%;
                    margin-bottom 16px
                    .title{
                        display inline-block
                        /*height:22px;*/
                        font-size:18px;
                        font-family:SFProDisplay-Semibold;
                        font-weight:600;
                        line-height:22px;
                        margin-bottom 10px
                        .top{
                            display inline-block
                            line-height 18px
                            font-size 12px
                            font-weight 400
                            color #fff
                            background #0d8dfc
                            border-radius 4px
                            vertical-align middle
                            padding 0 6px
                            margin-right 6px
                            margin-top 2px
                            float left
                        }
                    }
                    .summary{
                        font-size:16px;
                        font-weight:400;
                        line-height:22px;
                    }
                    .emoji-img {
                        width: 25px;
                        vertical-align: middle;
                        margin-top: -5px;
                    }
                    .video{
                        width 100%
                        position relative
                        margin-top 12px
                        .video_img{
                            display block
                            width 100%
                        }
                        .video_icon{
                            display block
                            width 80px
                            height 80px
                            position absolute
                            left 50%
                            top 50%
                            margin -40px 0 0 -40px
                        }
                    }
                }
                .pic{
                    flex: 0 0 180px;
                    height 120px
                    border-radius 4px
                    overflow hidden
                    position relative
                    margin-left 18px
                    img{
                        display block
                        width 100%
                    }
                    span{
                        display inline-block
                        line-height 18px
                        font-size 12px
                        color #fff
                        background:rgba(0,0,0,0.5);
                        border-radius:4px 0px 0px 0px;
                        padding 0 8px
                        position absolute
                        right 0px
                        bottom 0px
                    }
                }
                .operate{
                    a{
                        display inline-block
                        line-height 20px
                        font-size 14px
                        color #656973
                        margin-right 14px
                        .icon{
                            width 20px
                            height 20px
                            color #656973
                            margin-right 6px
                            float left
                        }
                        &.active{
                            color #0D8DFC
                            .icon{
                                color #0D8DFC
                            }
                        }
                    }
                }
            }
            &.view_type_mid{
                border-bottom 1px dashed #F0F1F2
                padding 12px 0
                margin 0 15px 0 20px
                .content{
                    flex-direction: column;
                    word-break: break-word;
                    flex: 1 1 100%;
                    .title{
                        display inline-block
                        line-height 20px
                        font-size:16px;
                        font-family:SFProDisplay-Semibold;
                        font-weight:600;
                        margin-bottom 4px
                        .top{
                            display inline-block
                            line-height 18px
                            font-size 12px
                            font-weight 400
                            color #fff
                            background #0d8dfc
                            border-radius 4px
                            vertical-align middle
                            padding 0 6px
                            margin-right 6px
                            margin-top 2px
                            float left
                        }
                    }
                    .summary{
                        font-size:14px;
                        font-weight:400;
                        line-height:20px;
                        margin-bottom 4px
                    }
                    .emoji-img {
                        width: 25px;
                        vertical-align: middle;
                        margin-top: -5px;
                    }
                    .member{
                        display block
                        line-height 14px
                        .avatar{
                            position relative
                            margin-right 6px
                            float left
                            .avatar_img{
                                display block
                                width 14px
                                height 14px
                                border-radius 50%
                            }
                            .member_type{
                                display block
                                width 10px
                                height 10px
                                position absolute
                                right -4px
                                bottom -4px
                            }
                        }
                        .nickname{
                            color #A8ABB3
                            font-size:12px;
                            /*font-family:PingFangSC-Semibold;*/
                            font-weight:600;
                            float left
                            margin-right 8px
                            .time{
                                display inline-block
                                font-weight:400;
                                margin-left 6px
                            }
                        }
                        a.operate{
                            display inline-block
                            line-height 14px
                            font-size 12px
                            color #A8ABB3
                            margin-right 8px
                            .icon{
                                width 14px
                                height 14px
                                color #A8ABB3
                                margin-right 2px
                                float left
                            }
                            &.active{
                                color #0d8dfc
                                .icon{
                                    color #0d8dfc
                                }
                            }
                        }
                    }
                }

                .pic{
                    flex: 0 0 96px;
                    height 64px
                    border-radius 4px
                    position relative
                    overflow hidden
                    margin-left 18px
                    img{
                        display block
                        width 100%
                    }
                    span{
                        display inline-block
                        line-height 18px
                        font-size 12px
                        color #fff
                        background:rgba(0,0,0,0.5);
                        border-radius:4px 0px 0px 0px;
                        padding 0 8px
                        position absolute
                        right 0px
                        bottom 0px
                    }
                }
                .video{
                    flex: 0 0 96px;
                    height 64px
                    border-radius 4px
                    overflow hidden
                    position relative
                    margin-left 18px
                    .video_img{
                        display block
                        width 100%
                    }
                    .video_icon{
                        display block
                        width 24px
                        height 24px
                        position absolute
                        left 50%
                        top 50%
                        margin -12px 0 0 -12px
                    }
                }
            }
            &.view_type_small{
                border-bottom 1px dashed #F0F1F2
                padding 6px 0 10px 0
                margin 0 15px
                .content{
                    flex-direction: column;
                    word-break: break-word;
                    flex: 1 1 100%;
                    .title{
                        display inline-block
                        line-height 20px
                        font-size:16px;
                        font-family:SFProDisplay-Semibold;
                        font-weight:600;
                        margin-bottom 4px
                        .top{
                            display inline-block
                            line-height 18px
                            font-size 12px
                            font-weight 400
                            color #fff
                            background #0d8dfc
                            border-radius 4px
                            vertical-align middle
                            padding 0 6px
                            margin-right 6px
                            margin-top 2px
                            float left
                        }
                    }
                    .summary{
                        font-size:14px;
                        font-weight:400;
                        line-height:20px;
                        margin-bottom 4px
                    }
                    .emoji-img {
                        width: 25px;
                        vertical-align: middle;
                        margin-top: -5px;
                    }
                    .member{
                        display block
                        line-height 14px
                        .avatar{
                            position relative
                            margin-right 6px
                            float left
                            .avatar_img{
                                display block
                                width 14px
                                height 14px
                                border-radius 50%
                            }
                            .member_type{
                                display block
                                width 10px
                                height 10px
                                position absolute
                                right -4px
                                bottom -4px
                            }
                        }
                        .nickname{
                            color #A8ABB3
                            font-size:12px;
                            /*font-family:PingFangSC-Semibold;*/
                            font-weight:600;
                            float left
                            margin-right 8px
                            .time{
                                display inline-block
                                font-weight:400;
                                margin-left 6px
                            }
                        }
                        a.operate{
                            display inline-block
                            line-height 14px
                            font-size 12px
                            color #A8ABB3
                            margin-right 8px
                            .icon{
                                width 14px
                                height 14px
                                color #A8ABB3
                                margin-right 2px
                                float left
                            }
                            &.active{
                                color #0d8dfc
                                .icon{
                                    color #0d8dfc
                                }
                            }
                        }
                    }
                }

                .pic{
                    flex: 0 0 114px;
                    height 64px
                    overflow hidden
                    padding-left 18px
                    img{
                        display block
                        width 100%
                    }
                }
                .video{
                    width 100%
                    position relative
                    margin-top 12px
                    .video_img{
                        display block
                        width 100%
                    }
                    .video_icon{
                        display block
                        width 80px
                        height 80px
                        position absolute
                        left 50%
                        top 50%
                        margin -40px 0 0 -40px
                    }
                }
            }
        }
        .el-dialog__wrapper{
            overflow hidden
            .el-dialog{
                &.post_dialog{
                    /*display flex*/
                    width calc(100% - 180px)
                    background-color #2D2F33
                    //height calc(100% - 50px)
                    //flex-direction column
                    .scrollbar {
                        height 100vh
                        position relative
                        transition-duration: 0.3s;
                        padding-top 10px
                        padding-bottom 100px
                    }
                    .el-dialog__header{
                        display none

                        .el-dialog__title{
                            font-weight 400
                            color #fff
                        }
                    }
                    .el-dialog__body{
                        .post_header{
                            color #fff
                            background #2D2F33
                            .post_header_wrap{
                                max-width 1280px
                                width 100%
                                height 50px
                                line-height 50px
                                font-size 14px
                                padding 0 10px
                                margin 0 auto
                                .like{
                                    line-height 50px
                                    color #fff
                                    .icon{
                                        width 20px
                                        height 20px
                                        margin-top 14px
                                        margin-right 5px
                                        float left
                                    }
                                    &.active{
                                        color #0d8dfc
                                    }
                                }
                                .title{
                                    width 100%
                                    height 50px
                                    line-height 50px

                                    text-overflow: ellipsis;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    padding 0 44px
                                    img{
                                        vertical-align middle
                                    }
                                }
                                .close{
                                    flex: 1 1 80px;
                                    line-height 50px
                                    text-align right
                                    color #A8ABB3
                                    .icon{
                                        width 16px
                                        height 16px
                                        margin-right 5px
                                    }
                                }
                            }
                        }
                        background-color #fff
                        padding 0px 0px
                        /*overflow auto*/
                        /*padding-bottom 40px*/
                    }

                }
            }

        }

        /*自己写一个弹窗*/
        .post_dialog{
            width 100%
            height calc(100vh - 50px)
            background rgba(0,0,0,0.7)
            overflow-y scroll
            position fixed
            left 0
            top 50px
            z-index 10
            .post_dialog_wrap{
                background: #fff;
                box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
                border-radius: 2px;
                .post_header{
                    color #fff
                    background #2D2F33
                    .post_header_wrap{
                        max-width 1280px
                        width 100%
                        height 50px
                        line-height 50px
                        font-size 14px
                        padding 0 10px
                        margin 0 auto
                        .like{
                            line-height 50px
                            color #fff
                            .icon{
                                width 20px
                                height 20px
                                margin-top 14px
                                margin-right 5px
                                float left
                            }
                            &.active{
                                color #0d8dfc
                            }
                        }
                        .title{
                            width 100%
                            height 50px
                            line-height 50px

                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                            padding 0 44px
                            img{
                                vertical-align middle
                            }
                        }
                        .close{
                            flex: 1 1 80px;
                            line-height 50px
                            text-align right
                            color #A8ABB3
                            .icon{
                                width 16px
                                height 16px
                                margin-right 5px
                            }
                        }
                    }
                }

                .post_dialog_main{
                    padding 20px
                }
            }

        }

    }

</style>
