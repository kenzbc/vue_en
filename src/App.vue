<template>

  <div id="app" :data-page="$route.name" :class="{'scroll': scrollTop > 0}" @mousemove="mouseMoveHandler">
    <score-header v-if="$route.name != '404'"></score-header>

    <router-view></router-view>

    <el-dialog id="login" top="20%" :lock-scroll="false" :visible.sync="login.dialogShow" :close-on-click-modal="!login.loading && !$route.meta.auth" :close-on-press-escape="!login.loading">
      <div class="main fl" v-loading="login.loading">
        <div class="tabs">
          <div class="tab">Login</div>
        </div>
        <div class="form">
          <div class="form-input area-select-form">
            <lfl-icon icon="earth"></lfl-icon>
            <el-select class="area-select" filterable v-model="login.params.area_code" placeholder="请选择区号">
              <el-option v-for="(item,index) in login.areaCodeList" :key="index" :label="item.country" :value="item.area_code">
                <span style="float: left">{{item.country}}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">+ {{item.area_code}}</span>
              </el-option>
            </el-select>
            <span class="area-number">+ {{login.params.area_code}}</span>
          </div>
          <div class="form-input">
            <lfl-icon icon="username"></lfl-icon>
            <input name="username" v-model="login.params.uuid" placeholder="Phone" @keydown.enter="submitLogin"/>
          </div>
          <div class="form-input">
            <lfl-icon icon="password"></lfl-icon>
            <input ref="password" @focus="passwordFocusEvent" v-model="login.params.key" placeholder="Password" @keydown.enter="submitLogin" autocomplete="off"/>
          </div>
        </div>
        <!-- 第三方登录增加 class third-platform -->
        <div class="actions">
          <el-button class="button submit" @click="submitLogin" :disabled="!checkInput">Login</el-button>
        </div>
        <div class="actions third-platform">
          <!--<a :href="domain + '/services/weibo/login.php' + goUrl" class="button">-->
          <!--<lfl-icon icon="weibo" class="weibo"></lfl-icon>-->
          <!--</a>-->
          <!--<a :href="domain + '/services/qq/login.php' + goUrl" class="button">-->
          <!--<lfl-icon icon="qq" class="qq"></lfl-icon>-->
          <!--</a>-->
          <a :href="domain + '/services/weixin/login.php' + goUrl" class="button">
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-wechat1"></use></svg>
          </a>
          <a href="https://pass.famulei.com/google_login.php?redirect_url=/en" class="button">
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-google"></use></svg>
          </a>
          <a href="https://pass.famulei.com/reddit_login.php?redirect_url=/en" class="button">
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-reddit"></use></svg>
          </a>
          <a href="https://pass.famulei.com/instagram_login.php?redirect_url=/en" class="button">
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-instagram"></use></svg>
          </a>
          <a href="https://pass.famulei.com/facebook_login.php?redirect_url=/en" class="button">
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-facebook"></use></svg>
          </a>
        </div>
        <div class="links">
          <a :href="domain + '/register?redirect_url=' + redirect_url" class="fl">Register</a>
          <a :href="domain + '/password'" target="_blank" class="fr">Forget？</a>
        </div>
      </div>
      <!--<div class="bg fr" @click="backHome"></div>-->
      <!--<div class="clearfix"></div>-->
    </el-dialog>
  </div>

</template>

<script>

  export default {
    data () {
      return {
        areaNumber: '+ 86',
        settings: {
          wheelSpeed: .8,
          minScrollbarLength: 10,
          wheelPropagation: false
        },
        scrollTop: 0,
        refreshTimeout: null,
        login: {
          params: {
            uuid: '',
            key: '',
            type: '999',
            area_code: '86'
          },
          areaCodeList: [],
          focus: false,
          loading: false,
          dialogShow: false
        },
        share: {
          dialogShow: false,
          title: '分享房间',
          room: {
            id: '',
            name: '',
            code: ''
          }
        },
        pop: {
          isShow: false,
          dialogShow: false,
          data: {
            image_url: '',
            type: -1,
            jump_url_web: ''
          }
        }
      }
    },
    watch: {
      // '$route' (data) {
      //     let scrollbar = document.getElementById('scrollbar');
      //     scrollbar.scrollTop = 0
      // }
      'login.dialogShow' (isShow) {
        if (isShow) {
          if (!this.login.areaCodeList.length) {
            this.getAreaCodeList()
          }
        }
      }
    },
    mounted () {
      let loading = document.getElementById('loading')
      setTimeout(_=>{
        loading.setAttribute('class', 'hide');
        setTimeout(_=>{
          loading.style.display = 'none'
        }, 800)
      }, 500)

      this.$root.hub.$on('scrollDown', _ => {
        this.scrollDown()
      })

      this.$root.hub.$on('refreshToken', _ => {
        this.refreshToken()
      })

      this.$root.hub.$on('showLogin', _ => {
        this.login.dialogShow = true
      })

      this.$root.hub.$on('showShare', room => {
        this.share.room = room
        this.share.dialogShow = true
      })

      this.$root.hub.$on('showPop', pop => {
        this.pop.data = pop
        this.popDataHandler()
      })

      this.$root.hub.$on('removeMember', room => {
        this.$store.commit('setMemberItem', {key: 'info', val: null})
        this.$store.commit('setMemberItem', {key: 'bank', val: null})
        this.$store.commit('setMemberItem', {key: 'token', val: null})
        this.$store.commit('setMemberItem', {key: 'member_id', val: null})
        this.storage.removeItem('member')
      })

      this.$root.hub.$on('updateBank', _ => {
        this.getMemberBank()
      })

      this.getMemberInfo()
      // this.getMemberBank()
    },
    created () {
      let params = this.$route.query
      if (params.token != null && params.member_id != null) {
        this.$store.commit('setMemberItem', {key: 'token', val: params.token})
        this.$store.commit('setMemberItem', {key: 'member_id', val: params.member_id})
      } else if (params.key != null && params.uuid != null && params.type != null) {
        this.submitLogin(params)
      } else {
        let member = this.storage.getItem('member')
        if (member) {
          this.$store.commit('setMemberItem', {key: 'info', val: member.data})
          this.$store.commit('setMemberItem', {key: 'token', val: member.token})
          this.$store.commit('setMemberItem', {key: 'member_id', val: member.member_id})
        }
      }
    },
    computed: {
      member () {
        return this.$store.state.member
      },
      shareContent () {
        return '你的好友喊你来幻联赛《'+ this.share.room.name +'》PK，比拼LOL游戏理解，链接 '
      },
      shareLink () {
        return location.origin + '/room/' + this.share.room.id
      },
      clipboardText () {
        return this.shareContent + this.shareLink
      },
      domain () {
        let url = ''
        let host = {
          'localhost': 'staging-1',
        }
        if(host[location.hostname] ){
          url = '//' + host[location.hostname] + '.famulei.com'
        }
        return url
      },
      redirect_url () {
        return location.href
      },
      goUrl () {
        return '?go_url=' + this.base64.encode(location.origin + location.pathname)
      },
    },
    methods: {
      getAreaCodeList () {
        this.login.loading = true
        this.api('/services/member/country_code_list.php').then(req => {
          if (req.code == 200) {
            this.login.areaCodeList = req.data
          }
          this.login.loading = false
        })
      },
      passwordFocusEvent () {
        this.$refs['password'].type = 'password'
      },
      getMemberInfo () {
        if (!this.member.member_id) return
        let member_id = this.member.member_id
        this.api('/services/member/get_user_info.php', {broadcast_id: member_id, member_id}).then(req => {
          if (req.code == 200) {
            this.saveMember(req.data)
          }
        })
      },
      getMemberBank () {
        if (!this.member.token) return
        this.api('/services/userCenter/my_bank.php').then(req => {
          if (req.code == 200) {
            this.$store.commit('setMemberItem', {key: 'bank', val: req.data})
          }
        })
      },
      popDataHandler () {
        if (this.pop.isShow) return
        let oldData = this.storage.getItem('pop')
        let newData = this.pop.data
        if (newData.id) {
          switch (newData.type) {
            case '0': {
              this.pop.dialogShow = true
            }
            case '1': {
              let today = this.moment().format('YYYY-MM-DD')
              if (!oldData || (oldData && oldData.id == newData.id && (!oldData.day || oldData.day != today))) {
                this.pop.dialogShow = true
              }
              newData.day = today
              break
            }
            case '2': {
              if (!oldData || (oldData && oldData.id == newData.id && !oldData.show)) {
                this.pop.dialogShow = true
              }
              newData.show = true
              break
            }
          }
          if (!oldData || (oldData && oldData.id != newData.id)) {
          }
          this.storage.setItem('pop', newData)
        }
        this.pop.isShow = true
      },
      refreshToken () {
        if (this.refreshTimeout) {
          clearTimeout(this.refreshTimeout)
        }
        let member = this.storage.getItem('member')
        this.refreshTimeout = setTimeout( _=> {
          this.api('/services/webAPI/refresh_token.php', req => {
            this.$root.hub.$emit('removeMember')
            this.$message.error(req.message)
          }).then(req=> {
            this.$store.commit('setMemberItem', {key: 'token', val: req.data.w_token})
            member.token = req.data.w_token
            this.storage.setItem('member', member)
          })

        }, 1000 * 60 * 30)
      },
      scrollEvent () {
        this.$store.commit('scrollTop', event.target.scrollTop)
//                this.scrollTop = event.target.scrollTop
      },
      scrollDown () {
        let scrollbar = document.getElementById('scrollbar');
        scrollbar.scrollTop = scrollbar.scrollHeight
      },
      submitLogin (params) {
        if (!params.uuid) {
          if (!this.checkInput) return
        }

        let _params = params.uuid ? params : this.login.params
        if (!_params.uuid.length) {
          this.$message.error('账号不能为空')
          return
        }
        if (!_params.key.length) {
          this.$message.error('密码不能为空')
          return
        }

        this.login.loading = true

        this.api('/services/webAPI/login.php', _params).then(req => {
          if (req.code == 200) {
            this.login.dialogShow = false
            this.saveMember(req.data)
            // this.getMemberBank()
            this.login.params.key = ''
            this.$message.success(req.message)
          } else {
            this.$message.error(req.message)
            this.$root.hub.$emit('removeMember')
          }
          //this.$router.replace(this.$route.path)//登录后除去路由的后缀，527隐藏
          this.login.loading = false
        })
      },
      saveMember (data) {
        //兼容cookie存储
        this.setCookie('member_id',data.member_id,7);
        if (data.w_token) {
          this.setCookie('token',data.w_token,7);
        }
        this.setCookie('member_avatar',data.avatar,7);

        this.$store.commit('setMemberItem', {key: 'info', val: data})
        this.$store.commit('setMemberItem', {key: 'member_id', val: data.member_id})
        if (data.w_token) {
          this.$store.commit('setMemberItem', {key: 'token', val: data.w_token})
        }
        if (data.f_token) {
          this.$store.commit('setMemberItem', {key: 'f_token', val: data.f_token})
        }
        this.storage.setItem('member', {
          data: data,
          token: data.w_token || this.member.token,
          member_id: data.member_id,
          expire_time: this.moment(this.moment().add(1,'h')).format('YYYY-MM-DD HH:mm:ss'),
          expire_second: this.moment(this.moment().add(1,'h')).unix(),
        });


        if (this.$route.query.token != null) {
          this.$router.replace(this.$route.path)
        }
      },
      checkInput () {
        let bool = true
        if (this.login.params.uuid.length == 0 || this.login.params.key.length == 0) {
          bool = false
        }
        return bool
      },
      backHome () {
        this.login.dialogShow = false
        this.$router.replace('/')
      },
      mouseMoveHandler (e) {
        if (this.$route.name == 'invitation') {
          this.$root.hub.$emit('mousemove',e)
        }
      },
      // elScrollTop(top) {
      // alert(2);
      //    this.$refs['myScrollbar'].wrap.scrollTop = 0
      // }
    }
  }
</script>

<style lang="stylus">
  /*@import '../static/css/element.css'*/
  /*@import '../static/css/element-ui.css'*/
  @import '../static/css/style.styl'
  @import '../static/css/app.styl'
</style>
