<template>
    <div id="header">
        <div class="flex align_center">
            <a href="/en/" class="nav-logo"><img src="static/image/logo.png" class=""></a>
            <el-dropdown class="nav-select">
                <span class="el-dropdown-link">
                    <img src="https://img1.famulei.com/z/554377/p/185/1711052783158.png">LOL Tournaments<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><a href="https://famulei.com">Home</a></el-dropdown-item>
                    <el-dropdown-item><a href="https://famulei.com/schedule">Schedule</a></el-dropdown-item>
                    <el-dropdown-item>LOL Tournaments</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <div class="nav-link" v-if="!member.info">
                <a href="javascript:" class="login active" @click="$root.hub.$emit('showLogin')">Login</a>
                <a :href="domain + '/register?redirect_url=' + redirect_url" class="login">Sign up</a>
            </div>
            <div class="user flex justify_end align_center" v-if="member.info">
                <a :href="domain + '/direct_messages'" class="item"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-chat"></use></svg></a>
                <a :href="domain + '/message#notice'" class="item"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-notice"></use></svg></a>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <img :src="member.info.avatar || '/en/static/image/avatar.jpg'" class="avatar" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <a :href="domain + '/homepage'" class="dropdown_item"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-my"></use></svg>My Profile</a>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <a :href="domain + '/account'" class="dropdown_item"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-setting"></use></svg>User Settings</a>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <a href="javascript:" @click="logout" class="dropdown_item"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-logout"></use></svg>Log Out</a>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                nav: ['/','/my/room','/mall','/ranking'],
                navPath: [['/room'],[],[],[]],
	            navSelect: [
		            {label: 'Home', value: 0},
		            {label: 'Schedule', value: 1},
		            {label: 'LOL Tournaments', value: 2}
	            ]
            }
        },
        methods: {
            logout () {
                this.api('/services/member/member_out.php').then(req => {
                    if (req.code == 200) {
                        this.$root.hub.$emit('removeMember')
                        this.$message.success(req.message)
                        this.$router.replace('/')
                    } else {
                        this.$message.error(req.message)
                    }
                })
            },
        },
        computed: {
	        domain () {
		        let url = ''
		        let host = {
			        'localhost': 'staging-1',
			        'lfl.gg': 'www',
			        'dev.lfl.gg': 'dev',
			        'staging-1.lfl.gg': 'staging-1',
			        'staging-2.lfl.gg': 'staging-2',
			        'staging-3.lfl.gg': 'staging-3',
		        }
		        url = 'https://' + host[location.hostname] + '.famulei.com'
		        return url
	        },
	        redirect_url () {
		        return location.href
	        },
            hostname () {
                return location.hostname
            },
            member () {
                return this.$store.state.member
            },
            navIndex () {
                let nav = {
                    'home': 0,
                    'room': 0,
                    'room-order': 0,
                    'room-match': 0,
                    'room-custom': 0,
                    'room-custom-choose': 0,
                    'my-room-detail': 1,
                    'my-room': 1,
                    'my-room-0': 1,
                    'my-room-1': 1,
                    'my-room-2': 1,
                    'mall': 2,
                    'ranking': 3,
                }
                let index = nav[this.$route.name] > -1 ? nav[this.$route.name] : -1
                return index
            },
            navLeft () {
                return (this.navIndex * 115) + 'px'
            },
            navBottom () {
                return this.navIndex != -1 ? 0 : '-4px'
            }
        }
    }
</script>

<style lang="stylus">

    #header {
        width 100%
        height 50px;
        background-color #fff
        padding 0 90px
        position fixed
        left 0
        right 0
        z-index 2000
        top 0
        transition-duration .3s
        box-shadow:0px 0px 0px 1px rgba(0,0,0,0.04);
        .nav-logo{
            display block
            width 110px
            height 50px
            margin-right 18px
            a{
                display block
                width 110px
                height 50px
            }
        }
        .nav-select{
            width:240px;
            height:32px;
            line-height 32px
            background:rgba(247,248,250,1);
            border-radius:24px;
            padding 0 14px
            .el-dropdown-link{
                display block
                width 100%
                img{
                    display inline-block
                    width 16px
                    height 16px
                    margin-right 10px
                    margin-top 7px
                    float left
                }
                .el-icon-arrow-down{
                    color #656973
                    margin-top 10px
                    float right
                }
            }
        }
        .nav-link{
            flex: 1;
            text-align right
            a{
                display inline-block
                width:100px;
                height:28px;
                line-height 26px
                text-align center
                color #0D8DFC
                font-size:13px;
                font-family:PingFangSC-Medium;
                font-weight:500;
                border-radius:17px;
                border 1px solid #0D8DFC
                margin-left 10px
                &.active{
                    color #fff
                    background #0D8DFC
                }
            }
        }

        .user {
            flex: 1;
            .el-dropdown{
                margin-left 20px
                .icon{
                    width 20px
                    height 20px
                    color #2D2F33
                    margin-right 12px
                }
            }
            .item{
                margin-left 15px
                .icon{
                    width 24px
                    height 24px
                    color #A8ABB3
                }
            }
            .avatar {
                width 36px
                height 36px
                display inline-block
                border-radius 50%
                box-shadow 0 0 2px 0 #cecece
                position relative
            }
        }

    }
</style>
