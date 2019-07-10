<template>
    <!--<el-scrollbar ref="myScrollbar" id="homeScroll" :native="false" style="height:100vh">-->
    <!--v-infinite-scroll-->
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="circle.loading" infinite-scroll-distance="30">
        <div id="home">
            <!--首页头部-->
            <div class="circle_top">
                <div class="container flex align_center">
                    <img :src="circle.circle_info.circle_picture">
                    <div class="circle_top_name">{{circle.circle_info.circle_name}}</div>
                </div>
            </div>
            <!--列表页面-->
            <div :class="[{'view_mode_big': circle.view_mode_type == 'view_mode_big'},'container flex justify_between']" style="padding-top: 20px">
                <!--列表主要内容-->
                <div class="main">
                    <div class="white_wrap">
                        <div class="score-list-category flex justify_between">
                            <div class="category_type flex align_center">
                                <div :class="{'active': circle.circle_type == 'new'}" @click="circleMode('new')">NEW</div>
                                <div :class="{'active': circle.circle_type == 'hot'}" @click="circleMode('hot')">HOT</div>
                            </div>
                            <div class="view_type flex align_center">
                                <div class="title">VIEW</div>
                                <div class="item flex align_center">
                                    <a href="javascript:" :class="{'active': circle.view_mode_type == 'view_mode_big'}" @click="viewMode('view_mode_big')"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-view_mode_big"></use></svg></a>
                                    <a href="javascript:" :class="{'active': circle.view_mode_type == 'view_mode_mid'}" @click="viewMode('view_mode_mid')"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-view_mode_mid"></use></svg></a>
                                    <a href="javascript:" :class="{'active': circle.view_mode_type == 'view_mode_small'}" @click="viewMode('view_mode_small')"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-view_mode_small"></use></svg></a>
                                </div>
                            </div>
                        </div>

                        <score-circle-list :data="circle" ref="post_show" v-loading="circle.loading" element-loading-text="loading"></score-circle-list>

                    </div>
                </div>
                <!--列表右侧-->
                <div class="side">
                    <!--circle_info-->
                    <div class="side_item circle_info">
                        <div class="circle_bg" :style="{backgroundImage:'url(' + circle.circle_info.circle_app_bg + ')'}"></div>
                        <div class="circle_name flex">
                            <img :src="circle.circle_info.circle_picture" class="circle_img">
                            <p class="">{{circle.circle_info.circle_name}}</p>
                        </div>
                        <div class="circle_desc">
                            <p>{{circle.circle_info.circle_intro}}</p>
                        </div>
                        <div class="circle_total flex justify_between">
                            <div class="circle_total_item">
                                <p class="num">{{circle.circle_info.fans_num}}</p>
                                <p class="name">Subscribers</p>
                            </div>
                            <div class="circle_total_item">
                                <p class="num">{{circle.circle_info.dynamic_num}}</p>
                                <p class="name">Post</p>
                            </div>
                        </div>
                        <div class="circle_btn">
                            <a href="javascript:" :class="{'active': circle.circle_info.is_attention == '1'}" @click="circleSubscribe(circle.circle_info.is_attention)">{{circle.circle_info.is_attention == '1' ? 'Subscribed' : 'Subscribe'}}</a>
                            <a href="javascript:" class="active" @click="editorShow()">Create post</a>
                        </div>
                    </div>
                    <!--dynamic_hot-->
                    <score-hot-list :data="circle_hot_list" v-loading="circle_hot_list.loading" element-loading-text="loading"></score-hot-list>
                </div>

            </div>

            <!--编辑器弹窗-->
            <el-dialog title="Create a post Posting to Score" customClass="editor_dialog" top="50px" :lock-scroll="false" :visible.sync="dialogEditorVisible">
                <div class="create_post_wrap">
                    <el-input v-model="add_post.params.title" placeholder="title"></el-input>
                    <quilleditor
                            v-model="add_post.params.content_html"
                            ref="myQuillEditor"
                            :options="editorOption"
                            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                            @change="onChange()">
                        <div id="toolbar" slot="toolbar">
                            <span class="ql-formats"><button type="button" class="ql-bold"></button></span>
                            <span class="ql-formats"><button type="button" class="ql-italic"></button></span>
                            <span class="ql-formats"><button type="button" class="ql-blockquote"></button></span>
                            <span class="ql-formats"><button type="button" class="ql-list" value="ordered"></button></span>
                            <span class="ql-formats"><button type="button" class="ql-list" value="bullet"></button></span>
                            <span class="ql-formats"><button type="button" class="ql-link"></button></span>
                            <span class="ql-formats">
                            <button type="button" @click="imgClick" style="outline:none">
                            <svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect> <circle class="ql-fill" cx="6" cy="7" r="1"></circle> <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg>
                            </button>
                            </span>
                            <span class="ql-formats"><button type="button" class="ql-video"></button></span>
                        </div>
                    </quilleditor>
                    <div class="create_post_btn">
                        <a href="javascript:" :class="{'active': add_post.params.content_html}" @click="dynamicAdd()">Post</a>
                    </div>
                </div>
            </el-dialog>

            <a href="javascript:" class="btn bk_top" @click="BkTop()">Back To Top</a>

        </div>
    </div>
    <!--</el-scrollbar>-->

</template>

<script>
  import {emojiToImg} from '../utils/index'
  import {quillEditor, Quill} from 'vue-quill-editor'
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import Video from '../utils/video'

  Quill.register(Video, true);
  export default {
    props: {
      value: {
        type: String
      },
      /*上传图片的地址*/
      uploadUrl: {
        type: String,
        default: '/services/upload_file/upload_image.php'
      },
      /*上传图片的file控件name*/
      fileName: {
        type: String,
        default: 'upfile'
      }
    },
    data() {
      return {
        editorOption: {
          modules: {
            toolbar: '#toolbar'
          }
        },
        dialogEditorVisible: false,
        // dialogPostVisible: false,
        scrollSettings: {},
        scrollTop: 0,
        scrollTimeout: null,
        post: {
          params: {
            dynamic_id: '',
          },
          pageTotal: 0,
          count: 0,
          data: {},
          loading: false
        },
        add_post: {
          params: {
            circle_id: '',
            title: '',
            content_html: '',
            video_url: ''
          },
          loading: false
        },
        circle: {
          params: {
            circle_id: '647',// STG221圈子 score.gg 647
            limit: 20,
            page: 1
          },
          pageTotal: 0,
          count: 0,
          list: [],
          circle_type: 'new',
          view_mode_type: 'view_mode_big',
          circle_info: {},
          full: false,
          loading: false
        },
        circle_hot_list: {
          params: {
            circle_id: '',
            limit: 8,
            page: 1
          },
          list: [],
          loading: false
        },
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill;
      },
      member() {
        return this.$store.state.member
      }
    },
    watch: {
      scrollTop: function () {
        // if(){
        //
        // }
        // this.requestList(_this.circle.circle_type)
      }
      // $refs['myScrollbar'].wrap.scrollTop
      // this.$refs['myScrollbar']
    },
    mounted() {
      // this.requestList(this.circle.circle_type)//贴子列表
      this.circleInfo()//右侧圈子info
      this.circleInfo();
    },
    created() {
      // let _this = this
      // window.onscroll = function(){
      //    //变量scrollTop是滚动条滚动时，距离顶部的距离
      //    var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
      //    //变量windowHeight是可视区的高度
      //    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      //    //变量scrollHeight是滚动条的总高度
      //    var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
      //    //滚动条到底部的条件
      //    if(scrollTop+windowHeight==scrollHeight){
      //        //写后台加载数据的函数
      //        console.log("距顶部"+scrollTop+"可视区高度"+windowHeight+"滚动条总高度"+scrollHeight);
      //        _this.circle.params.page++
      //        _this.requestList(_this.circle.circle_type)//贴子列表
      //    }
      // }
    },
    components: {
      'quilleditor': quillEditor,
    },
    methods: {
      isLogin() {
        if (!this.member.info) {
          this.$root.hub.$emit('showLogin')
        }
      },
      onEditorReady(editor) { // 准备编辑器

      },
      onEditorBlur() {
      }, // 失去焦点事件
      onEditorFocus() {
      }, // 获得焦点事件
      onEditorChange() {
      }, // 内容改变事件
      onChange() {
        this.$emit('input', this.content)
      },
      /*选择上传图片切换*/
      onFileChange(e) {
        var self = this
        var fileInput = e.target
        if (fileInput.files.length == 0) {
          return
        }
        this.editor.focus()
        // if(fileInput.files[0].size>1024*1024*100){
        //    this.$alert('图片不能大于600KB', '图片尺寸过大', {
        //        confirmButtonText: '确定',
        //        type: 'warning',
        //    })
        // }
        var data = new FormData
        data.append(this.fileName, fileInput.files[0])
        data.append('appid', '1')
        data.append('member_id', this.$store.state.member.member_id)
        data.append('token', this.$store.state.member.f_token)
        this.axios.post(this.uploadUrl, data).then(function (res) {
          if (res.data) {
//                        console.log(res.data.data.image_url)
            self.editor.insertEmbed(self.editor.getSelection().index, 'image', res.data.url)
          }
        })
      },
      /*点击上传图片按钮*/
      imgClick() {
        if (!this.uploadUrl) {
          console.log('no editor uploadUrl')
          return;
        }
        /*内存创建input file*/
        var input = document.createElement('input')
        input.type = 'file'
        input.name = this.fileName
        input.accept = 'image/jpeg,image/png,image/jpg,image/gif'
        input.onchange = this.onFileChange
        input.click()
      },
      BkTop() {
        console.log(this.$refs['myScrollbar'].wrap.scrollHeight);
        // document.documentElement.scrollTop = document.body.scrollTop = 0
        // this.$emit('elScrollTop','');
        this.$refs['myScrollbar'].wrap.scrollTop = 0
      },
      circleMode(type) {
        this.circle.circle_type = type;
        this.circle.list = [];//清空列表数据
        this.circle.params.page = 1;
        switch (type) {
          case 'new':
            this.requestList(type);
            break;
          case 'hot':
            this.requestList(type);
            break;
        }
      },
      viewMode(type) {
        this.circle.view_mode_type = type;
      },
      requestList(type) {
        this.circle.loading = true
        if (type == 'new') {
          var url = '/services/dynamic/circle_dynamic_list.php';
        } else if (type == 'hot') {
          var url = '/services/dynamic/circle_hot_dynamic_list.php';
        }
        console.log(this.circle.params.page)
        this.api(url, this.circle.params).then(req => {
          if (req.code == 200) {
            console.log(req.data.list)
            if (this.circle.params.page == '1') {//置顶贴子
              let top_list = req.data.top_list
              for (let i in top_list) {
                top_list[i].title = emojiToImg(top_list[i].title)
                top_list[i].summary = emojiToImg(top_list[i].summary)
                top_list[i].is_top = '1';
                this.circle.list.push(top_list[i])
              }
            }
            let list = req.data.list//普通贴子
            for (let i in list) {
              list[i].title = emojiToImg(list[i].title)
              list[i].summary = emojiToImg(list[i].summary)
              this.circle.list.push(list[i])
            }
            // this.circle.list = req.data.list
            this.circle.count = req.data.count
            this.circle.loading = false
            if (req.data.list.length == 0) {
              this.circle.full = true
            } else {
              this.circle.full = false
            }

          }
        })
      },
      loadMore() {
        if (!this.circle.full) {
          this.circle.loading = true // 将无限滚动给禁用
          setTimeout(() => {
            this.requestList(this.circle.circle_type) // 请求数据
            this.circle.params.page++ // 增加页数
          }, 1000)
        }

      },
      circleInfo() {
        // this.circle.loading = true
        this.api('/services/circle/circle_info.php', this.circle.params).then(req => {
          if (req.code == 200) {
            this.circle.circle_info = req.data;
            document.title = this.circle.circle_info.circle_name + ' - Score Esports'
            this.circleHot(req.data.id)//右侧热门列表
            // this.circle.loading = false
          }
        })
      },
      circleHot(circle_id) {
        this.circle_hot_list.params.circle_id = circle_id;
        this.circle_hot_list.loading = true;
        this.api('/services/dynamic/circle_hot_dynamic_list.php', this.circle_hot_list.params).then(req => {
          if (req.code == 200) {
            this.circle_hot_list.list = req.data.list;
            console.log(this.circle_hot_list.list);
            this.circle_hot_list.loading = false
          }
        })
      },
      circleSubscribe(attention) {
        this.isLogin();
        if (!this.member.info) return
        if (attention == '1') {
          this.api('/services/member/cancel_attention_circle.php', {circle_id: this.circle.params.circle_id}).then(req => {
            this.$message(req.message);
            if (req.code == 200) {
              this.circle.circle_info.is_attention = '0';
            }
          });
        } else {
          this.api('/services/member/attention_circle.php', {circle_id: this.circle.params.circle_id}).then(req => {
            this.$message(req.message);
            if (req.code == 200) {
              this.circle.circle_info.is_attention = '1';
            }
          });
        }
      },
      editorShow() {
        this.isLogin();
        if (!this.member.info) return
        this.dialogEditorVisible = true;
        this.add_post.params.circle_id = this.circle.params.circle_id
      },
      dynamicAdd() {
        this.isLogin();
        if (!this.member.info) return
        if (!this.add_post.params.content_html) {
          this.$message('wanna say something');
          return
        }
        // console.log(this.add_post.params.content_html);
        if (this.add_post.params.content_html.includes('<iframe')) {
          var videoReg = /<iframe.*?(?:>|\/>)/gi;
          var srcReg = /video_url=[\'\"]?([^\'\"]*)[\'\"]?/i;
          var arr = this.add_post.params.content_html.match(videoReg);  // arr 为包含所有iframe标签的数组
          for (var i = 0; i < arr.length; i++) {
            var src = arr[i].match(srcReg);
            //获取视频地址
            this.add_post.params.video_url = src[1];
          }
        }
        this.add_post.loading = false
        console.log(this.add_post.params);
        this.api('/services/dynamic/dynamic_add.php', this.add_post.params).then(req => {
          this.$message(req.message);
          if (req.code == 200) {
            this.add_post.params.content_html = '';
            this.add_post.params.title = '';
            this.add_post.loading = false;
            this.dialogEditorVisible = false;
          }
        })
      }
    }
  }
</script>

<style lang="stylus">
    #home {
        padding-top 50px
        .circle_top{
            background:linear-gradient(135deg,rgba(0,113,242,1) 0%,rgba(15,156,250,1) 100%);

            .container{
                height 60px
            }
            img{
                display block
                width 32px
                height 32px
                background-color #fff
                border-radius 50%
                margin-right 12px
            }
            .circle_top_name{
                font-size:18px;
                font-family:SFProDisplay-Semibold;
                font-weight:600;
                color:rgba(255,255,255,1);
                line-height:21px;
                letter-spacing:1px;
            }
        }
        .scrollbar {
            height calc(100vh - 10px)
            position relative
            transition-duration: 0.3s;
        }
        .score-list-category{
            height:54px;
            background #FBFCFD
            border-radius:2px 2px 0px 0px;
            border-bottom 1px solid #F0F1F2
            .category_type{
                padding-left 24px
                div{
                    font-size:16px;
                    font-family:SFProDisplay-Semibold;
                    font-weight:600;
                    color #656973
                    letter-spacing:1px;
                    margin-right 28px
                    cursor pointer
                    &.active{
                        color #2D2F33
                        font-size 20px
                    }
                }
            }
            .view_type{
                .title{
                    color #656973
                    font-size:16px;
                    font-family:SFProDisplay-Semibold;
                    font-weight:600;
                    color #656973
                    margin-right 12px
                }
                .item{
                    padding-right 8px
                    a{
                        margin-right 8px
                        .icon{
                            width 20px
                            height 20px
                            color #A8ABB3
                        }
                        &.active{
                            .icon{
                                color #0D8DFC
                            }
                        }
                    }
                }
            }
        }

        .circle_info{
            padding 0 16px 6px 16px
            .circle_bg{
                height 64px
                background center center / cover no-repeat rgb(0, 121, 211)
                border-radius: 4px 4px 0px 0px;
                margin 0 -16px -34px
            }
            .circle_name{
                padding-left 20px
                margin-bottom 10px
                .circle_img{
                    display block
                    width 70px
                    height 70px
                    background-color #fff
                    border-radius 50%
                    border:3px solid #fff;
                    box-shadow: 0 1px 0px 0 rgba(0,0,0,0.04);
                    margin-right 12px
                }
                p{
                    line-height 20px
                    font-size:16px;
                    color #000
                    font-weight:bold;
                    margin-top 44px
                }
            }
            .circle_desc{
                line-height 18px
                font-size:14px;
                color #A8ABB3
                word-wrap:break-word
                background #F7F8FA
                border-radius:8px;
                padding 8px 14px
                margin-bottom 16px
            }
            .circle_total{
                .circle_total_item{
                    width 50%
                    text-align center
                    margin-bottom 18px
                    &:first-child{
                        border-right: 1px solid #EBEBED;
                    }
                    .num{
                        line-height:20px;
                        font-size:18px;
                        font-family:SFProDisplay-Semibold;
                        font-weight:600;
                        margin-bottom 4px
                    }
                    .name{
                        line-height:16px;
                        color #A8ABB3
                        font-size:14px;
                        font-weight:400;
                    }
                }
            }
            .circle_btn{
                a{
                    display block
                    height:36px;
                    line-height 36px
                    text-align center
                    font-size 14px
                    /*font-family:PingFangSC-Semibold;*/
                    font-weight:600;
                    color #0D8DFC
                    border-radius:24px;
                    border:1px solid #0D8DFC;
                    margin-bottom 10px
                    &.active{
                        color #fff
                        background #0D8DFC
                    }
                }
            }
        }

    }
    .create_post_wrap{
        /*width 800px*/
        .el-input{
            margin-bottom 10px
        }
        .create_post_btn{
            position absolute
            right 20px
            bottom 20px
            text-align right
            padding-top 20px
            a{
                display inline-block
                width:120px;
                height:34px;
                line-height 34px
                text-align center
                font-weight:600;
                font-size 14px
                color #fff
                background:rgba(13,141,252,1);
                border-radius:24px;
                opacity 0.3
                &.active{
                    opacity 1
                }
            }
        }
    }
    .el-dialog__wrapper{
        .el-dialog{
            &.editor_dialog{
                width 80%
                height calc(100% - 100px)
                position relative
                .el-dialog__header{
                    background-color #2D2F33
                    .el-dialog__title{
                        font-weight 400
                        color #fff
                    }
                }
                .quill-editor{
                    width calc(100% - 40px)
                    height calc(100% - 250px)
                    position absolute
                    left 20px
                    top 120px
                }
            }
        }
    }
    .bk_top{
        display block
        line-height 36px
        text-align center
        font-size 14px
        color #fff
        background #0d8dfc
        border-radius 18px
        position fixed
        right 0
        bottom 0
        padding 0 20px
    }
</style>
