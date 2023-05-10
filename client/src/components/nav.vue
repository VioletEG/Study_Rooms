<template>
	<Header class="fater-header-user">
    <Button type="text" @click="exitSystem">退出登录</Button>

	</Header>
</template>

<style>
</style>

<script>
import {
	exit,
	getLoginUser,
	updSessionInfo,
	updSessionPwd,
} from "../api";
import {Button} from "view-ui-plus";

export default {
  components: {Button},
  data() {
		return {
			pwdForm: {
				token: this.$store.state.token,
				newPwd: "",
				rePwd: "",
				oldPwd: ""
			},
			infoForm: {
				id: "",
				userName: "",
				name: "",
				gender: "",
				age: "",
			},
		}
	},
	methods: {
    exitSystem(){
      this.$Modal.confirm({
        title: '系统提示',
        content: '即将退出系统, 是否继续?',
        onOk: () => {

          exit(this.$store.state.token).then(() => {
            this.$store.commit("clearToken");
            this.$store.commit("clearMenus");
            sessionStorage.clear();
            window.location.href="/";
          });
        },
      });
    },
	},
}
</script>
