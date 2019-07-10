<template>
    <!--<el-scrollbar ref="myScrollbar" :native="false" style="height:100vh">-->
    <!--贴子详情页面-->
    <div class="container flex justify_between">
        <!--详情主要内容-->
        <div class="main">
            <!--贴子内容-->
            <div class="post white_wrap">
                <h1 class="title" v-html="dynamic_info.data.title ? dynamic_info.data.title : dynamic_info.data.summary"></h1>
                <div class="member" @click="toUser(dynamic_info.data)">
                    <div class="avatar">
                        <img :src="dynamic_info.data.avatar || '/en/static/image/avatar.jpg'" class="avatar_img">
                        <img src="/en/static/image/staff.png" class="member_type" v-if="dynamic_info.data.member_type == '2'">
                        <img src="/en/static/image/v.png" class="member_type" v-else-if="dynamic_info.data.member_type == '1'">
                    </div>
                    <p class="nickname">Posted by {{dynamic_info.data.nickname}}<span class="time">{{dynamic_info.data.dateWord}}</span></p>
                </div>
                <score-null :width="120" v-show="!dynamic_info.data && !dynamic_info.loading"></score-null>
                <!--正文模块-->
                <div class="content" v-html="dynamic_info.data.content_html"></div>

                <!--普通语音-->
                <div class="audio-wrap" v-if="dynamic_info.data.sound && dynamic_info.data.sound.length">
                    <!--<AudioBox :url="dynamic_info.data.sound[0].audio_url"></AudioBox>-->
                    <scoreAudio commentType="details" :cid="dynamic_info.data.dynamic_id" :src="dynamic_info.data.sound[0].audio_url" :duration="parseInt(dynamic_info.data.sound[0].seconds)" :stop="audioStop" @setAudioStop="audioStops" />
                </div>

                <!--投票模块-->
                <div class="editor-vote-list" v-if="dynamic_info.data.vote && dynamic_info.data.vote.item">
                    <div class="editor-vote-list-top">
                        <div class="vote-list-left"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-vote"></use></svg>Vote</div>
                        <div class="vote-list-right"><span class="vote-list-n">{{dynamic_info.data.vote.vote_number_count}}</span> people voted</div>
                    </div>
                    <div class="editor-vote-list-bottom" :class="{end: dynamic_info.data.vote.status == '1'}">
                        <div class="editor-vote-items" :class="{selected: item.checked}" v-for="(item, index) in dynamic_info.data.vote.item" :key="index" @click="selectVoteItem(item)">
                            <div class="editor-vote-first cl" :class="{'editor-vote-first1': !item.myVoteStatus}">
                                <div class="editor-vote-first-left fl">{{ index + 1 }}<span class="zhijiao-down"></span></div>
                                <div class="editor-vote-first-right fl">{{ item.item || '' }}</div>
                                <div class="editor-vote-first-score" v-if="dynamic_info.data.vote.status == '1' || dynamic_info.data.vote.is_vote == '1'">{{ item.percent }}</div>
                                <div class="editor-vote-first-line" :style="{width: item.percent}" v-if="dynamic_info.data.vote.status == '1' || dynamic_info.data.vote.is_vote == '1'"></div>
                                <div class="editor-vote-first-border"></div>
                            </div>
                        </div>
                    </div>
                    <div class="toggle-num flex justify_between">
                        <div class="toggle-num-left">{{ dynamic_info.data.vote.vote.number == '1' ? 'single choice' : 'multiple choice' }}</div>
                        <div class="toggle-num-right">D/L : {{dynamic_info.data.vote.vote.end_time,'YYYY-MM-DD HH:mm' | datetime}}</div>
                    </div>
                    <div class="add-vote-btn flex justify_end">
                        <p class="add-vote-button add-vote-button-jiezhi" v-if="dynamic_info.data.vote.status == '1'">Closed</p>
                        <p class="add-vote-button add-vote-btn1" v-if="dynamic_info.data.vote.status != '1' && dynamic_info.data.vote.is_vote == '1'">Voted</p>
                        <p class="add-vote-button" v-if="dynamic_info.data.vote.status != '1' && dynamic_info.data.vote.is_vote != '1'" @click="setVote">Vote</p>
                    </div>
                </div>

                <!--视频模块-->
                <div class="video" v-if="dynamic_info.data.video && dynamic_info.data.video.length && dynamic_info.data.video[0].video_type !== '0'">
                    <video :src="dynamic_info.data.video[0].video_url" width="100%" controls></video>
                </div>

                <div class="operate">
                    <a href="javascript:" :class="{'active': dynamic_info.data.is_praise == '1'}" @click="postAction('like','')"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-like"></use></svg>{{dynamic_info.data.praise_count == '0' ? 'Like' : dynamic_info.data.praise_count }}</a>
                    <a href="javascript:"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-comment"></use></svg>{{dynamic_info.data.comment_count || 'Comment'}}</a>
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
                    <!--<a href="javascript:" class="report fr">Report</a>-->
                </div>
            </div>
            <!--热门回复-->
            <div class="hot_replies gold_wrap" v-if="hot_replies.list.length">
                <div class="reolies_title flex justify_between align_center">
                    <div class="left">Top Reply</div>
                    <div class="right">Totally {{hot_replies.count}} top replies， legendary！</div>
                </div>
                <ul class="c-list">
                    <li class="c-item flex" v-for="(item, index) in hot_replies.list" :key="index">
                        <div class="avatar" @click="toUser(item)">
                            <img class="avatar-img" :src="item.avatar || '/en/static/image/avatar.jpg'" />
                            <img class="sign-icon" src="/en/static/image/v.png" v-if="item.member_type == '1'" />
                            <img class="sign-icon" src="/en/static/image/staff.png" v-if="item.member_type == '2'" />
                        </div>
                        <div class="comment-info">
                            <div class="c-username">
                                <span @click="toUser(item)">{{ item.nickname || '' }}</span><div class="rank">Lv.{{ item.rank }}</div>
                            </div>
                            <div class="content">
                                <div class="text-box" v-html="item.content_html"></div>
                            </div>
                            <!--语音-->
                            <div class="audio-wrap" v-if="item.audio_url">
                                <scoreAudio commentType="details" :cid="item.dynamic_comment_id.toString()" :src="item.audio_url" :duration="parseInt(item.seconds)" :stop="audioStop" @setAudioStop="audioStops" />
                            </div>
                            <div class="tools-bar">
                                <div class="left">{{ item.floor + 1 + 'L'}}<span class="date">{{item.add_time,'YYYY-MM-DD HH:mm' | datetime}}</span></div>
                                <div class="right">
                                    <a href="javascript:" :class="[{'active': item.dislike_count == '1'},'operate']" @click="postAction('reply',item,index,'hot')"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-comment"></use></svg>Reply</a>
                                    <a href="javascript:" :class="[{'active': item.is_praise == '1'},'operate']" @click="postAction('replay_like',item,index,'hot')"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-like"></use></svg>{{item.praise_count == '0' ? 'Like' : item.praise_count }}</a>
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
                            <div class="reply_text_wrap" v-show="item.reply_show">
                                <el-input
                                        type="textarea"
                                        :rows="5"
                                        placeholder="what are your thoughts"
                                        v-model="item.reply_content">
                                </el-input>
                                <div class="reply_btn">
                                    <!--<a href="javascript:" @click="replyAdd(item.dynamic_comment_id,'',item.reply_content)">Reply</a>-->
                                    <el-button class="btn" :disabled="reply_info.loading" @click="replyAdd(item.dynamic_comment_id,'',item.reply_content,item.nickname)">Reply</el-button>
                                </div>
                            </div>
                            <!--热门回复的回复-->
                            <ul class="reply-list" :class="{full: item.reply.list.length == item.reply.count}" v-show="item.reply.count > 0">
                                <li class="r-list" v-for="(replyItem, n) in (item.reply.list || [])" :key="n">
                                    <div class="r-username flex align_center" @click="toUser(replyItem)"><img :src="replyItem.avatar || '/en/static/image/avatar.jpg'">{{ replyItem.nickname || '' }}</div>
                                    <div class="r-content" v-html="replyItem.content_html"></div>
                                    <div class="r-date flex">
                                        <div class="left">{{replyItem.add_time,'YYYY-MM-DD HH:mm' | datetime}}</div>
                                        <!--<div class="left">Report</div>-->
                                        <!--<div class="left">管理</div>-->
                                        <div :class="[{'active': replyItem.dislike_count == '1'},'reply-btn']" @click="postAction('reply_reply',replyItem,index,'hot',n)"><span>Reply</span></div>
                                    </div>
                                    <div class="reply_text_wrap" v-show="replyItem.reply_show">
                                        <el-input
                                                type="textarea"
                                                :rows="5"
                                                placeholder="what are your thoughts"
                                                v-model="replyItem.reply_content">
                                        </el-input>
                                        <div class="reply_btn">
                                            <!--<a href="javascript:" @click="replyAdd(replyItem.reply_id,replyItem.dynamic_comment_id,replyItem.reply_content)">Reply</a>-->
                                            <el-button class="btn" :disabled="reply_info.loading" @click="replyAdd(replyItem.reply_id,replyItem.dynamic_comment_id,replyItem.reply_content,replyItem.nickname)">Reply</el-button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div class="load-more gold" v-show="item.reply.count > item.reply.list.length" @click="loadingMore('hot_replies_replies',index)">
                                <div><span>LOAD</span><span class="load"><lfl-icon icon="add"></lfl-icon></span><span>MORE</span></div>
                                <!--<div v-else>No more data</div>-->
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="load-more gold" v-show="!hot_replies.no_more" @click="loadingMore('hot_replies')">
                    <div><span>LOAD</span><span class="load"><lfl-icon icon="add"></lfl-icon></span><span>MORE</span></div>
                    <!--<div v-else>No more data</div>-->
                </div>
            </div>
            <!--全部回复-->
            <div class="all_replies white_wrap">
                <div class="reolies_title flex justify_between align_center">
                    <div class="left">All Replies {{all_replies.count ? '（'+all_replies.count+'）' : ''}}</div>
                    <div class="right">
                        <a href="javascript:" :class="{'active': all_replies.params.landlord_only == '1'}" @click="allRepliesType('landlord_only')">author only</a>
                        <a href="javascript:" :class="{'active': all_replies.params.order_switch == '1'}" @click="allRepliesType('order_switch')">{{all_replies.params.order_switch == '0' ? 'ascending order' : 'descending order'}}</a>
                    </div>
                </div>
                <score-null v-show="!all_replies.list.length && !all_replies.loading" width="70" padding="15"></score-null>
                <ul class="c-list">
                    <li class="c-item flex" v-for="(item, index) in all_replies.list" :key="index">
                        <div class="avatar" @click="toUser(item)">
                            <img class="avatar-img" :src="item.avatar || '/en/static/image/avatar.jpg'" />
                            <img class="sign-icon" src="/en/static/image/v.png" v-if="item.member_type == '1'" />
                            <img class="sign-icon" src="/en/static/image/staff.png" v-if="item.member_type == '2'" />
                        </div>
                        <div class="comment-info">
                            <div class="c-username"><span @click="toUser(item)">{{ item.nickname || '' }}</span><div class="rank">Lv.{{ item.rank }}</div></div>
                            <div class="content">
                                <div class="text-box" v-html="item.content_html"></div>
                            </div>
                            <!--语音-->
                            <div class="audio-wrap" v-if="item.audio_url">
                                <scoreAudio commentType="details" :cid="item.dynamic_comment_id.toString()" :src="item.audio_url" :duration="parseInt(item.seconds)" :stop="audioStop" @setAudioStop="audioStops" />
                            </div>
                            <div class="tools-bar">
                                <div class="left">{{ item.floor + 1 + 'L'}}<span class="date">{{item.add_time,'YYYY-MM-DD HH:mm' | datetime}}</span></div>
                                <div class="right">
                                    <a href="javascript:" :class="[{'active': item.dislike_count == '1'},'operate']" @click="postAction('reply',item,index,'all')"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-comment"></use></svg>Reply</a>
                                    <a href="javascript:" :class="[{'active': item.is_praise == '1'},'operate']" @click="postAction('replay_like',item,index,'all')"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-like"></use></svg>{{item.praise_count == '0' ? 'Like' : item.praise_count }}</a>
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
                            <div class="reply_text_wrap" v-show="item.reply_show">
                                <el-input
                                        type="textarea"
                                        :rows="5"
                                        placeholder="what are your thoughts"
                                        v-model="item.reply_content">
                                </el-input>
                                <div class="reply_btn">
                                    <el-button class="btn" :disabled="reply_info.loading" @click="replyAdd(item.dynamic_comment_id,'',item.reply_content,item.nickname)">Reply</el-button>
                                </div>
                            </div>
                            <!--全部回复的回复-->
                            <ul class="reply-list" :class="{full: item.reply.list.length == item.reply.count}" v-show="item.reply.count > 0">
                                <li class="r-list" v-for="(replyItem, n) in (item.reply.list || [])" :key="n">
                                    <div class="r-username flex align_center" @click="toUser(replyItem)"><img :src="replyItem.avatar || '/en/static/image/avatar.jpg'">{{ replyItem.nickname || '' }}</div>
                                    <div class="r-content" v-html="replyItem.content_html"></div>
                                    <div class="r-date flex">
                                        <div class="left">{{replyItem.add_time,'YYYY-MM-DD HH:mm' | datetime}}</div>
                                        <!--<div class="left">Report</div>-->
                                        <!--<div class="left">管理</div>-->
                                        <div :class="[{'active': replyItem.dislike_count == '1'},'reply-btn']" @click="postAction('reply_reply',replyItem,index,'all',n)"><span>Reply</span></div>
                                    </div>
                                    <div class="reply_text_wrap" v-show="replyItem.reply_show">
                                        <el-input
                                                type="textarea"
                                                :rows="5"
                                                placeholder="what are your thoughts"
                                                v-model="replyItem.reply_content">
                                        </el-input>
                                        <div class="reply_btn">
                                            <el-button class="btn" :disabled="reply_info.loading" @click="replyAdd(replyItem.reply_id,replyItem.dynamic_comment_id,replyItem.reply_content,replyItem.nickname)">Reply</el-button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div class="load-more" v-show="item.reply.count > item.reply.list.length" @click="loadingMore('all_replies_replies',index)">
                                <div><span>LOAD</span><span class="load"><lfl-icon icon="add"></lfl-icon></span><span>MORE</span></div>
                                <!--<div v-else>No more data</div>-->
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="load-more" v-show="!all_replies.no_more && all_replies.count >= 20" @click="loadingMore('all_replies')">
                    <div><span>LOAD</span><span class="load"><lfl-icon icon="add"></lfl-icon></span><span>MORE</span></div>
                    <!--<div v-else>No more data</div>-->
                </div>
                <div class="reply_text_wrap">
                    <el-input
                            type="textarea"
                            :rows="5"
                            placeholder="what are your thoughts"
                            v-model="dynamic_info.data.reply_content">
                    </el-input>
                    <div class="reply_btn">
                        <el-button class="btn" :disabled="reply_info.loading" @click="replyAdd('','',dynamic_info.data.reply_content)">Reply</el-button>
                    </div>
                </div>
            </div>
        </div>
        <!--列表右侧-->
        <div class="side">
            <!--author_info-->
            <div class="side_item author_info">
                <h2 class="title">OP</h2>
                <div class="author_bg" v-if="dynamic_info.data.broadcast_info" :style="{backgroundImage:'url(' + dynamic_info.data.broadcast_info.background + ')'}"></div>
                <div class="author_avatar flex justify_between">
                    <img :src="dynamic_info.data.avatar || '/en/static/image/avatar.jpg'" class="author_img">
                    <a href="javascript:" v-if="dynamic_info.data.broadcast_info" :class="{'active': dynamic_info.data.broadcast_info.is_attention == '1'}" @click="followMember(dynamic_info.data.member_id)">{{dynamic_info.data.broadcast_info.is_attention == '1' ? 'followed' : 'follow'}}</a>
                </div>
                <div class="author_name flex align_center">
                    <p>{{dynamic_info.data.nickname}}</p>
                    <img src="/en/static/image/female.png" v-if="dynamic_info.data.is_girl == '1'">
                    <img src="/en/static/image/male.png" v-else>
                    <span>Lv.{{dynamic_info.data.rank}}</span>
                </div>
                <p class="author_desc">{{dynamic_info.data.member_demo}}</p>
                <div class="author_total flex justify_between">
                    <p class="author_total_item">Post<span v-if="dynamic_info.data.broadcast_info">{{dynamic_info.data.broadcast_info.bar_count}}</span></p>
                    <p class="author_total_item">Following<span v-if="dynamic_info.data.broadcast_info">{{dynamic_info.data.broadcast_info.attention_count}}</span></p>
                    <p class="author_total_item">Follower<span v-if="dynamic_info.data.broadcast_info">{{dynamic_info.data.broadcast_info.fans_count}}</span></p>
                </div>
            </div>
            <!--dynamic_hot-->
            <score-hot-list :data="circle_hot_list" v-loading="circle_hot_list.loading" element-loading-text="loading"></score-hot-list>
        </div>
    </div>
    <!--</el-scrollbar>-->
</template>

<script>
	import { emojiToImg } from '../utils/index'
	export default {
		props: {
			data: {
				type: String,
				default: function () {
					return {
						pageTotal: 0,
						count: 0,
						list: [],
						params: {
							limit: 10,
							page: 0
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
		},
		data () {
			return {
				dynamic_info:{
					params: {
						dynamic_id: '',
					},
					data:{},
					loading: false
				},
				audioStop:false,
				currAudioId: '', // 存储当前音频播放ID
				currAudioFromComment: '',
				vote: {
					selectList: [],
					activeItem: null
				},
				hot_replies:{
					params: {
						dynamic_id: '',
						comment_sort:'1',
						limit:'5',
						last_page_key:''
					},
					list:[],
                    count:'',
					no_more: false,
					loading: false
				},
				all_replies:{
					params: {
						dynamic_id: '',
						landlord_only:'0',//0表示显示所有，1表示只显示楼主，默认为0显示所有
						order_switch:'0',//0表示正序，1表示倒序，默认为0正序
						limit:'20',
						last_page_key:''
					},
					list:[],
					count:'',
					no_more: false,
					loading: false
				},
				reply_info:{
					params: {
						dynamic_id: '',
						reply_id:'',
						reply_reply_id:'',
						content_html: ''
					},
					loading: false
				},
				circle_hot_list:{
					params: {
						circle_id: '',
						limit: 8,
						page: 1
					},
					list:[],
					loading: false
				},
			}
		},
		computed: {
			member () {
				return this.$store.state.member
			},
		},
		watch: {
			'data'(data){
				this.hot_replies.params.last_page_key = '';
				this.all_replies.params.last_page_key = '';
				if(data){
					this.dynamicInfo(data);//弹窗贴子详情
					this.hotReplies(data);//热门回复
					this.allReplies(data);//全部回复
                }else{
					this.dynamic_info.data = {};
					// this.all_replies.count = ''
                }
            },

		},
		mounted() {
            this.dynamicInfo(this.data);//弹窗贴子详情
			this.hot_replies.params.last_page_key = '';
			this.all_replies.params.last_page_key = '';
			this.hotReplies(this.data);//热门回复
			this.allReplies(this.data);//全部回复
		},
		methods: {
			isLogin () {
				if (!this.member.info) {
					this.$root.hub.$emit('showLogin')
				}
			},
			loadingMore (status,index) {
				if(status == 'all_replies'){
					let list = this.all_replies.list;
					this.all_replies.params.last_page_key = list[list.length - 1].cache_key
					this.allReplies(this.data);
                }else if(status == 'hot_replies'){
					let list = this.hot_replies.list;
					this.hot_replies.params.last_page_key = list[list.length - 1].cache_key
					this.hotReplies(this.data);
                }else if(status == 'all_replies_replies'){
					let last_page_key = this.all_replies.list[index].reply.list
					console.log(this.all_replies.list[index].dynamic_comment_id,last_page_key[last_page_key.length - 1].cache_key);
					this.api('/services/dynamic/dynamic_comment_reply_list.php',{dynamic_comment_id:this.all_replies.list[index].dynamic_comment_id,last_page_key:last_page_key[last_page_key.length - 1].cache_key,limit:'5'}).then(req => {
						this.$message(req.message);
						if (req.code == 200) {
							let list = req.data.list
							for (let i in list) {
								this.all_replies.list[index].reply.list.push(list[i])
							}
                        }
					})
				}else if(status == 'hot_replies_replies'){
					let last_page_key = this.hot_replies.list[index].reply.list
					console.log(this.hot_replies.list[index].dynamic_comment_id,last_page_key[last_page_key.length - 1].cache_key);
					this.api('/services/dynamic/dynamic_comment_reply_list.php',{dynamic_comment_id:this.hot_replies.list[index].dynamic_comment_id,last_page_key:last_page_key[last_page_key.length - 1].cache_key,comment_sort:'1',limit:'5'}).then(req => {
						this.$message(req.message);
						if (req.code == 200) {
							if(req.data.list.length !== 0){
								let list = req.data.list
								for (let i in list) {
									this.hot_replies.list[index].reply.list.push(list[i])
								}
                            }else{
								this.hot_replies.list[index].reply.count = this.hot_replies.list[index].reply.list.length
                            }

						}
					})
				}

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
			postAction (type,item,index,reply_type,index2) {
				switch (type) {
					case 'reply':
						console.log(this.all_replies.list[index]);
						this.isLogin();
						if (!this.member.info) return
						if(reply_type == 'hot'){
							if(this.hot_replies.list[index].reply_show){
								this.hot_replies.list[index].dislike_count = '0';
								this.hot_replies.list[index].reply_show = false
							}else{
								this.hot_replies.list[index].dislike_count = '1';
								this.hot_replies.list[index].reply_show = true
							}
                        }else{
							if(this.all_replies.list[index].reply_show){
								this.all_replies.list[index].dislike_count = '0';
								this.all_replies.list[index].reply_show = false
							}else{
								this.all_replies.list[index].dislike_count = '1';
								this.all_replies.list[index].reply_show = true
							}
                        }

						break;
					case 'reply_reply':
						this.isLogin();
						if (!this.member.info) return
						if(reply_type == 'hot'){
							if(this.hot_replies.list[index].reply.list[index2].reply_show){
								this.hot_replies.list[index].reply.list[index2].dislike_count = '0';
								this.hot_replies.list[index].reply.list[index2].reply_show = false
							}else{
								this.hot_replies.list[index].reply.list[index2].dislike_count = '1';
								this.hot_replies.list[index].reply.list[index2].reply_show = true
							}
						}else{
							if(this.all_replies.list[index].reply.list[index2].reply_show){
								this.all_replies.list[index].reply.list[index2].dislike_count = '0';
								this.all_replies.list[index].reply.list[index2].reply_show = false
							}else{
								this.all_replies.list[index].reply.list[index2].dislike_count = '1';
								this.all_replies.list[index].reply.list[index2].reply_show = true
							}
						}
						// console.log(this.all_replies.list[index].reply.list[index2].reply_show);
						break;
					case 'like':
						this.isLogin();
						if (!this.member.info) return
						if(this.dynamic_info.data.is_praise == '1'){
							this.api('/services/dynamic/dynamic_praise_cancel.php',{dynamic_id:this.dynamic_info.data.dynamic_id}).then(req => {
								this.$message(req.message);
								if (req.code == 200) {
									this.dynamic_info.data.is_praise = '0';
									this.dynamic_info.data.praise_count = parseInt(this.dynamic_info.data.praise_count) - 1;
								}
							});
						}else{
							this.api('/services/dynamic/dynamic_praise.php',{dynamic_id:this.dynamic_info.data.dynamic_id}).then(req => {
								this.$message(req.message);
								if (req.code == 200) {
									this.dynamic_info.data.is_praise = '1';
									this.dynamic_info.data.praise_count = parseInt(this.dynamic_info.data.praise_count) + 1;
								}
							});
						}

						break;
					case 'replay_like':
						console.log(item);
						this.isLogin();
						if (!this.member.info) return
						if(item.is_praise == '1'){
							this.api('/services/dynamic/dynamic_comment_praise_cancel.php',{dynamic_id:this.dynamic_info.data.dynamic_id,dynamic_comment_id:item.dynamic_comment_id,comment_cache_key:item.cache_key}).then(req => {
								this.$message(req.message);
								if (req.code == 200) {
									if(reply_type == 'hot'){
										this.hot_replies.list[index].is_praise = '0';
										this.hot_replies.list[index].praise_count = parseInt(this.hot_replies.list[index].praise_count) - 1;
                                    }else{
										this.all_replies.list[index].is_praise = '0';
										this.all_replies.list[index].praise_count = parseInt(this.all_replies.list[index].praise_count) - 1;
                                    }

								}
							});
						}else{
							this.api('/services/dynamic/dynamic_comment_praise.php',{dynamic_id:this.dynamic_info.data.dynamic_id,dynamic_comment_id:item.dynamic_comment_id,comment_cache_key:item.cache_key}).then(req => {
								this.$message(req.message);
								if (req.code == 200) {
									if(reply_type == 'hot'){
										this.hot_replies.list[index].is_praise = '1';
										this.hot_replies.list[index].praise_count = parseInt(this.hot_replies.list[index].praise_count) + 1;
									}else{
										this.all_replies.list[index].is_praise = '1';
										this.all_replies.list[index].praise_count = parseInt(this.all_replies.list[index].praise_count) + 1;
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
			dynamicInfo(dynamic_id){
				this.dynamic_info.params.dynamic_id = this.data;
				this.dynamic_info.loading = true;
				this.api('/services/dynamic/dynamic_info.php',this.dynamic_info.params).then(req => {
					if (req.code == 200) {
						// 投票
						if (req.data.vote && req.data.vote.item) {
							req.data.vote.item.forEach((item) => {
								if (req.data.vote.my_vote) {
									req.data.vote.my_vote.forEach((myItem) => {
										if (item.item_id == myItem.item_id) {
											console.log(myItem);
											item.myVoteStatus = true
										}
									})
								}
							})
						}

						this.dynamic_info.data = req.data;

						document.title = this.dynamic_info.data.title || this.dynamic_info.data.summary
						this.dynamic_info.data.title = emojiToImg(this.dynamic_info.data.title)
						this.dynamic_info.data.summary = emojiToImg(this.dynamic_info.data.summary)
						this.dynamic_info.data.content_html = emojiToImg(this.dynamic_info.data.content_html)
						// this.dynamic_info.data.audioStop = false
						this.circleHot(req.data.circle_id);//右侧热贴列表

						this.dynamic_info.loading = false
					}
				})
			},
			hotReplies(dynamic_id){
				this.hot_replies.params.dynamic_id = this.data;
				if(!this.hot_replies.params.last_page_key){
					this.hot_replies.list = [];
				}
				this.hot_replies.loading = true;
				this.api('/services/dynamic/dynamic_comment_all_hot_list.php',this.hot_replies.params).then(req => {
					if (req.code == 200) {
						this.hot_replies.loading = false
						if(req.data.list.length){
							let list = req.data.list
							for (let i in list) {
								this.hot_replies.list.push(list[i])
								this.hot_replies.list[i].content_html = emojiToImg(this.hot_replies.list[i].content_html)
								this.hot_replies.list[i].reply_show = false
								// this.hot_replies.list[i].audioStop = false
								if(req.data.list[i].reply.list.length){
									let list2 = req.data.list[i].reply.list
									for (let n in list2) {
										this.hot_replies.list[i].reply.list[n].content_html = emojiToImg(this.hot_replies.list[i].reply.list[n].content_html)
										this.hot_replies.list[i].reply.list[n].reply_show = false//回复的回复增加输入框显示
										// this.hot_replies.list[i].reply.list[n].audioStop = false
									}
								}
							}
							// this.hot_replies.list = req.data.list;
							this.hot_replies.count = req.data.count;
							this.hot_replies.no_more = false;
						}else{
							this.hot_replies.no_more = true;
						}
					}
				})
			},
			allRepliesType(type){
				if(type == 'landlord_only'){
                    if(this.all_replies.params.landlord_only == '0'){
	                    this.all_replies.params.landlord_only = '1';
                    }else{
	                    this.all_replies.params.landlord_only = '0'
                    }
                }else if(type == 'order_switch'){
					if(this.all_replies.params.order_switch == '0'){
						this.all_replies.params.order_switch = '1';
					}else{
						this.all_replies.params.order_switch = '0'
					}
                }
				this.all_replies.list = [];
				this.allReplies()
            },
			allReplies(){
				this.all_replies.params.dynamic_id = this.data;
				if(!this.all_replies.params.last_page_key){
					this.all_replies.list = [];
				}
				this.all_replies.loading = true;
				this.api('/services/dynamic/dynamic_comment_list.php',this.all_replies.params).then(req => {
					if (req.code == 200) {
						this.all_replies.loading = false
						if(req.data.list.length){
							let list = req.data.list
							for (let i in list) {
								this.all_replies.list.push(list[i])
								this.all_replies.list[i].content_html = emojiToImg(this.all_replies.list[i].content_html)
								this.all_replies.list[i].reply_show = false
								// this.all_replies.list[i].audioStop = false
                if(req.data.list[i].reply.list.length){
                  let list2 = req.data.list[i].reply.list
                  for (let n in list2) {
                    this.all_replies.list[i].reply.list[n].content_html = emojiToImg(this.all_replies.list[i].reply.list[n].content_html)
                    this.all_replies.list[i].reply.list[n].reply_show = false//回复的回复增加输入框显示
                    // this.all_replies.list[i].reply.list[n].audioStop = false
                    }
                }
							}
							// this.all_replies.list = req.data.list;
							this.all_replies.count = req.data.count
							this.all_replies.no_more = false;
                        }else{
							this.all_replies.no_more = true;
                        }
					}
				})
			},
			// 停止当前语音播放
			audioStops (obj) {
				// this.audioStop = true
				// this.currAudioFromComment = obj.type
				// if (!this.currAudioId) {
				// 	this.currAudioId = obj.cid
				// } else {
				// 	if (this.currAudioId !== obj.cid) {
				// 		this.setAudioStatus(obj.type)
				// 		this.currAudioId = obj.cid
				// 	}
				// }
			},
			// 设置当前语音播放状态
			setAudioStatus (type) {
				// this.audioStop = true
				// this[type].list.forEach((item) => {
				// 	if (item.dynamic_comment_id === this.currAudioId) {
				// 		item.audioStop = true
				// 	} else {
				// 		item.audioStop = false
				// 	}
				// })
			},
			// 选择投票项
			selectVoteItem (item) {
				let type = this.dynamic_info.data.vote.vote && this.dynamic_info.data.vote.vote.number
				let status = this.dynamic_info.data.vote.status
				let isVote = this.dynamic_info.data.vote.is_vote
				if ((status != '0') || (isVote == '1') || (type == '0')) return
				if (item.checked) {
					if (type > 1) {
						item.checked = false
						this.vote.selectList.forEach((val, index) => {
							if (item.item_id == val) {
								this.vote.selectList.splice(index, 1)
							}
						})
					}
				} else {
					if (type == '1') {
						this.$set(item, 'checked', true)
						this.vote.selectList.shift()
						this.vote.selectList.push(item.item_id)
						if (this.vote.activeItem) {
							this.$set(this.vote.activeItem, 'checked', false)
						}
						this.vote.activeItem = item
					} else {
						if (this.vote.selectList.length < type) {
							this.$set(item, 'checked', true)
							this.vote.selectList.push(item.item_id)
						} else {
							this.$message('up to ' + type + 'items');
						}
					}
				}
			},
			// 投票
			setVote () {
				this.isLogin();
				if (!this.member.info) return;
				let params = {
					dynamic_id: this.data,
					itemId_string: this.vote.selectList.join(',')
				}
				this.api('/services/dynamic/vote_add.php',params).then(req => {
					if (req.code === '200') {
                        // this.$set(this.details.vote, 'is_vote', '1')
                        setTimeout(() => {
                            this.dynamicInfo()
                        }, 200)
                    }
                    this.$message(req.message);
				})
			},
            //回复贴子&回复楼主&回复的回复
			replyAdd(reply_id,reply_reply_id,reply_content,reply_nickname){
				let _this = this
				this.isLogin();
				if (!this.member.info) return;
				this.reply_info.params.dynamic_id = this.data;
				this.reply_info.params.reply_id = reply_id;
				this.reply_info.params.reply_reply_id = reply_reply_id;
				if(reply_id || reply_reply_id){
					this.reply_info.params.content_html = '回复 @'+ reply_nickname +' ：'+ reply_content;
                }else{
					this.reply_info.params.content_html = reply_content;
                }
				this.reply_info.loading = true;
				this.api('/services/dynamic/dynamic_comment_insert.php',this.reply_info.params).then(req => {
					setTimeout(_ => {
						this.reply_info.loading = false;
					}, 1000)
					this.$message(req.message);
					if(req.code == '200'){
						setTimeout(function () {
							_this.dynamic_info.data.reply_content = '';
							_this.hot_replies.list = [];
							_this.hot_replies.params.last_page_key = '';
							_this.hotReplies()
							_this.all_replies.list = [];
							_this.allReplies()
                        },2000);
                    }
				})
            },
			followMember(attention_member_id){
				this.isLogin();
				if (!this.member.info) return;
				if(this.dynamic_info.data.broadcast_info.is_attention == '1'){
					this.api('/services/member/cancel_attention_member.php',{attention_member_id:attention_member_id}).then(req => {
						this.$message(req.message);
						if (req.code == 200) {
							this.dynamic_info.data.broadcast_info.is_attention = '0'
						}
					})
                }else{
					this.api('/services/member/attention_member.php',{attention_member_id:attention_member_id}).then(req => {
						this.$message(req.message);
						if (req.code == 200) {
							this.dynamic_info.data.broadcast_info.is_attention = '1'
						}
					})
                }

            },
			circleHot(circle_id){
				this.circle_hot_list.params.circle_id = circle_id;
				this.circle_hot_list.loading = true;
				this.api('/services/dynamic/circle_hot_dynamic_list.php',this.circle_hot_list.params).then(req => {
					if (req.code == 200) {
						this.circle_hot_list.list = req.data.list;
						this.circle_hot_list.loading = false
					}
				})
			}
		}
	}
</script>

<style lang="stylus">
    .post{
        padding 20px 24px 12px 24px
        .title{
            line-height:36px;
            font-size:30px;
            font-family:SFProDisplay-Semibold;
            font-weight:600;
            letter-spacing 1px
            margin-bottom 14px
        }
        .member{
            display block
            line-height 20px
            cursor pointer
            margin-bottom 20px
            .avatar{
                cursor pointer
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
                cursor pointer
                color #656973
                font-size:14px;
                /*font-family:PingFangSC-Semibold;*/
                font-weight:600;

                .time{
                    display inline-block
                    color #A8ABB3
                    font-size:12px;
                    font-weight:400;
                    margin-left 12px
                }
            }
        }
        .content{
            color #656973
            font-size:16px;
            font-family:SFProDisplay-Semibold;
            font-weight:300;
            line-height:22px;
            margin-bottom 24px
            p,div{
                color #656973
                font-size:16px;
                font-family:SFProDisplay-Semibold;
                font-weight:300;
                line-height:22px;
                margin-bottom 4px
            }
            a{
                color #0d8dfc
            }
            img{
                max-width 100%
                &.emoji-img {
                    width: 25px;
                    vertical-align: middle;
                    margin-top: -5px;
                }
            }
            iframe{
                width 100%
                min-height 484px
            }
        }

        /*投票样式新加*/
        .editor-vote-list{
            padding 14px 20px 20px
            margin-bottom 24px
            box-shadow: 0 0 0 1px #EBEBED;
            border-radius: 2px;
            .editor-vote-list-top{
                display -webkit-flex
                display flex
                align-items flex-end
                justify-content space-between
                padding-bottom 4px
                .vote-list-left{
                    display -webkit-flex
                    display flex
                    align-items center
                    font-size: 16px;
                    color: #2D2F33;
                    font-weight:bold
                    .icon {
                        width 16px
                        height 16px
                        margin-right 5px
                    }
                }
                .vote-list-right{
                    font-size 14px;
                }
            }
            .editor-vote-list-bottom{
                .editor-vote-items{
                    .editor-vote-first{
                        cursor: pointer;
                        margin-top: 10px
                        background: #F7F8FA;
                        border-radius: 4px;
                        height: 44px
                        line-height: 44px
                        position: relative
                        .editor-vote-first-score{
                            position: absolute
                            font-size: 14px;
                            color: #656973;
                            right: 14px
                            top:0px
                        }
                        .editor-vote-first-border{
                            display: none
                            position: absolute
                            top:0px
                            left:0
                            width:100%
                            height: 44px
                            border: 2px solid #0D8DFC;
                            border-radius: 4px;
                            z-index:0
                        }
                        .editor-vote-first-line{
                            position: absolute
                            background: #0D8DFC;
                            border-radius: 0 8px;
                            height 4px
                            left: 0px
                            bottom:0px
                        }
                        .editor-vote-first-left{
                            border-radius:4px 0 0 4px
                            background: #0D8DFC;
                            // display: inline-block
                            width: 40px
                            padding-left 13px
                            font-size: 14px;
                            color: #FFFFFF;
                            position: relative
                            .zhijiao-down{
                                position: absolute
                                top:0
                                right:0
                                width:0
                                height:0
                                border-color:   transparent #F7F8FA
                                border-width: 0 10px 44px 0;
                                border-style: solid;
                            }
                        }
                        .editor-vote-first-right{
                            width 60%
                            overflow hidden
                            white-space nowrap
                            text-overflow ellipsis
                            font-weight bold
                            //display: inline-block
                            margin-left: 12px
                            line-height: 44px
                            font-size: 14px;
                            color: #656973;
                        }
                    }

                    .editor-vote-first1{
                        .editor-vote-first-left{
                            background: #D2D4D9;
                        }
                        .editor-vote-first-line{
                            background: #D2D4D9;
                        }
                    }
                    .editor-vote-first2{
                        .editor-vote-first-border{
                            display: block
                        }
                    }
                }
                .selected {
                    .editor-vote-first{
                        .editor-vote-first-border {
                            display: block
                        }
                    }
                }
            }
            .toggle-num{
                margin-top: 10px
                .toggle-num-left{
                    font-size: 12px;
                    color: #A8ABB3;
                }
                .toggle-num-right{
                    font-size: 12px;
                    color: #A8ABB3;
                }
            }
            .add-vote-btn{
                margin-top:23px
                .add-vote-button{
                    cursor: pointer;
                    width: 120px
                    height: 34px
                    border: 1px solid #0D8DFC;
                    border-radius: 24px;
                    line-height 32px
                    text-align: center
                    font-size: 14px;
                    color: #0D8DFC;
                }
                .add-vote-btn1{
                    cursor: auto;
                    border-radius: 24px;
                    line-height 32px
                    text-align: center
                    font-size: 14px;
                    color: #FFFFFF;
                    background: #0D8DFC;
                }
                .add-vote-button-jiezhi{
                    border: 1px solid #EBEBED;
                    border-radius: 20px;
                    background: #fff
                    font-size: 13px;
                    color: #656973;
                }
            }
        }
        .video{
            margin-bottom 10px
        }
        .operate{
            a{
                display inline-block
                line-height 20px
                font-size 14px
                color #656973
                margin-right 14px
                &.report{
                    color #A8ABB3
                    margin-right 0
                }
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
    .hot_replies{
        .reolies_title{
            line-height 40px
            font-size 14px
            color #fff
            background-color #e0cb9d
            border-bottom 1px solid #d1bc8e
            padding 0 14px
            .left{
                position relative
                padding-left 8px
                &:after{
                    content ''
                    width 3px
                    height 12px
                    background #fff
                    position absolute
                    left 0px
                    top 14px
                }
            }
            .right{

            }
        }
        .reply-list {
            background-color #fff7e8
            box-shadow: 0px 0px 0px 1px #fae8c3
            .r-list{
                border-bottom 1px solid #fae8c3
                &:last-child{
                    border-bottom none
                }
            }
        }
    }
    .all_replies{
        .reolies_title{
            line-height 40px
            font-size 14px
            border-bottom 1px solid #F0F1F2
            margin 0 12px
            .left{
                font-weight:600;
                position relative
                padding-left 8px
                &:after{
                    content ''
                    width 3px
                    height 12px
                    background #0D8DFC
                    position absolute
                    left 0px
                    top 14px
                }
            }
            .right{
                padding-right 2px
                a{
                    display inline-block
                    color #A8ABB3
                    margin-left 18px
                    &.active{
                        color #0D8DFC
                    }
                }
            }
        }
        .reply-list{
            background-color #fafafa
            box-shadow:0px 0px 0px 1px rgba(240,241,242,1);
            .r-list{
                border-bottom 1px solid #F0F1F2
                &:last-child{
                    border-bottom none
                }
            }
        }
    }

    .c-list {
        .c-item {
            border-bottom 1px dashed #F0F1F2
            padding 12px 0px
            margin 0 24px
            .avatar {
                cursor pointer
                width 36px
                height 36px
                position relative
                margin-right 8px
                .avatar-img {
                    width: 100%
                    height: 100%
                    border-radius 50%
                }
                .sign-icon {
                    width 15px
                    height 15px
                    position absolute
                    right -3px
                    bottom -3px
                }
            }
            .comment-info {
                flex 1
                .c-username {
                    display flex
                    align-items center
                    margin-bottom 3px
                    span {
                        display block
                        height 22px
                        line-height 22px
                        font-size 14px
                        font-weight 600
                        cursor pointer
                        margin-right 6px
                    }
                    .rank {
                        min-width 38px
                        height 16px
                        line-height 16px
                        background linear-gradient(135deg,rgba(25,167,255,1) 0%,rgba(5,138,255,1) 100%)
                        border-radius 3px
                        text-align center
                        font-size 10px
                        color #fff

                    }
                }
                .content {
                    width 100%
                    .text-box {
                        width 100%
                        line-height 20px
                        font-size 14px
                        font-weight 400
                        /*text-align justify*/
                        color #2D2F33
                        word-break break-all
                        margin-bottom 8px
                        img{
                            max-width 100%
                        }
                        .emoji-img {
                              width: 25px;
                              vertical-align: middle;
                              margin-top: -5px;
                        }
                        a{
                            color #0d8dfc
                        }
                    }
                }
                .tools-bar {
                    display flex
                    justify-content space-between
                    align-items center
                    .left {
                        line-height 20px
                        font-size 12px
                        color #A8ABB3
                        .date {
                            display inline-block
                            margin-left 8px
                        }
                    }
                    .right {
                        display flex
                        justify-content flex-end
                        align-items center
                        .operate{
                            display inline-block
                            line-height 20px
                            font-size 12px
                            color #656973
                            margin-left 14px
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
                .reply-list {

                    border-radius:8px;
                    margin-top 10px
                    &.full {
                        border-radius 8px
                    }

                    .r-list {

                        padding 8px 16px
                        +.r-list {
                            /*margin-top 16px*/
                        }
                        .r-username {
                            cursor pointer
                            line-height 20px
                            font-weight:400;
                            margin-bottom 5px
                            img{
                                display block
                                width 20px
                                height 20px
                                border-radius 50%
                                margin-right 8px
                            }
                        }
                        .r-content{
                            line-height:18px;
                            font-size:14px;
                            color #656973
                            font-weight:400;
                            margin-bottom 8px
                            img{
                                max-width 100%
                            }
                            .emoji-img{
                                width 25px
                                vertical-align middle
                                margin-top -5px
                            }
                            a{
                                color #0d8dfc
                            }
                        }
                        .r-date {
                            color #A8ABB3
                            font-size 12px
                            .left{
                                border-right 1px solid #EBEBED
                                padding-right 10px
                                margin-right 10px
                            }
                            .reply-btn{
                                flex 1
                                text-align right
                                span{
                                    cursor pointer
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .author_info{
        padding 0 12px
        .author_bg{
            height 80px
            background center center / cover no-repeat rgb(0, 121, 211)
            border-radius 4px
            margin 10px 0 -34px 0
        }
        .author_avatar{
            padding 0 8px
            margin-bottom 10px
            .author_img{
                display block
                width 70px
                height 70px
                border-radius 50%
                border:3px solid #fff;
                box-shadow: 0 1px 0px 0 rgba(0,0,0,0.04);
                margin-right 12px
            }
            a{
                display block
                width 82px
                line-height 28px
                text-align center
                color #0D8DFC
                border-radius:17px;
                border 1px solid #0D8DFC
                margin-top 44px
                &.active,&:hover{
                    color #fff
                    background #0D8DFC
                }
            }
        }
        .author_name{
            margin-bottom 8px
            p{
                font-size:16px;
                /*font-family:PingFangSC-Semibold;*/
                font-weight:600;
                color:rgba(45,47,51,1);
                line-height:22px;
                margin-right 10px
            }
            img{
                display block
                width 20px
                height 20px
                margin-right 2px
            }
            span{
                display inline-block
                min-width:38px;
                line-height 16px
                text-align center
                font-size:11px;
                /*font-family:PingFangSC-Semibold;*/
                font-weight:600;
                color #fff
                background:linear-gradient(135deg,rgba(25,167,255,1) 0%,rgba(5,138,255,1) 100%);
                border-radius:3px;
            }
        }
        .author_desc{
            color #656973
            font-size:14px;
            font-weight:400;
            margin-bottom 8px
        }
        .author_total{
            padding 0 20px 15px 0
            .author_total_item{
                font-size:13px;
                /*font-family:PingFangSC-Regular;*/
                font-weight:400;
                color #A8ABB3
                line-height:20px;
                span{
                    display inline-block
                    font-size:14px;
                    color #2D2F33
                    font-weight:600;
                    margin-left 6px
                }
            }
        }
    }

    .load-more {
        height 40px
        line-height 40px
        text-align center
        border-radius 20px
        /*font-family TradeGothicLT-Bold*/
        font-size 12px
        color #D2D4D9
        background #FAFBFC
        cursor pointer
        user-select none
        margin 14px 22px
        &.gold{
            color #D2D4D9
            background #fff7e8
        }
        div {
            > span {
                display inline-block
                vertical-align middle
            }
        }

        &:hover {
            .load {
                &:before {
                    animation: scale 2s infinite
                }
            }
        }

        @keyframes scale {
            0% {
                transform scale(1)
                background-color rgba(12, 157, 252, 0.2)
            }
            50% {
                transform scale(1.15)
                background-color rgba(12, 157, 252, 0.3)
            }
            100% {
                transform scale(1)
                background-color rgba(12, 157, 252, 0.2)
            }
        }


        .load {
            width 32px
            height 32px
            position relative
            margin 0 16px
            display inline-block

            .icon {
                width 20px
                height 20px
                color #0c9dfc
                left 6px
                top 6px
                position absolute
                z-index 1
            }

            &:before {
                content ''
                width 32px
                height 32px
                position absolute
                left 0
                top 0
                background-color rgba(12, 157, 252, 0.2)
                border-radius 50%
                z-index 0
            }
        }

    }

    .reply_text_wrap{
        padding 18px 20px
        .reply_btn{
            text-align right
            padding-top 14px
            .btn{
                display inline-block
                width:120px;
                line-height 34px
                font-size:14px;
                font-weight:600;
                text-align center
                color #fff
                background #0D8DFC
                border-radius:24px;
            }
        }
    }
    /*语音*/
    .audio-wrap{
        width 100%
        max-width 380px
        margin-bottom 24px
    }
</style>
