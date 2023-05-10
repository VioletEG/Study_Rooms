<template>
  <div class="fater-body-show">
      <Card>
        <Row :gutter="8" align="bottom">
          <Col flex="40px">
            <Image :src="url" :fit="fill" width="100px" height="100px" />
          </Col>
          <Col flex="80px">
            <p style="height: 60px">
              学号/工号:
            </p>
          </Col>
          <Col flex="auto">
            <p style="height: 65px">
              <Input v-model="infoForm.id" :border="false" :disabled="true"/>
            </p>
          </Col>
          <Col flex="80px" >
            <Button :size="buttonSize" type="primary" @click="showInfoWin">信息编辑</Button>
          </Col>
          <Col flex="80px">
            <Button :size="buttonSize" type="primary" @click="showPwdWin">更改密码</Button>
          </Col>
        </Row>
      </Card>

    <Card>
      <Divider size="small" orientation="left">个人基本信息</Divider>
      <Row :gutter="8" align="bottom">
        <Col flex="100px" style="align-content: center" >
          <p style="height: 26px">
            姓名
          </p>
        </Col>
        <Col flex="auto">
          <Input v-model="infoForm.name" :border="false" :disabled="true"/>
        </Col>
      </Row>
      <Divider />
      <Row :gutter="8" align="bottom">
        <Col flex="100px" style="align-content: center">
          <p style="height: 26px">
            性别
          </p>
        </Col>
        <Col flex="auto">
          <Input v-model="infoForm.gender" :border="false" :disabled="true"/>
        </Col>
      </Row>
      <Divider />
      <Row :gutter="8" align="bottom">
        <Col flex="100px" style="align-content: center">
          <p style="height: 26px">
            年龄
          </p>
        </Col>
        <Col flex="auto">
          <Input v-model="infoForm.age" :border="false" :disabled="true"/>
        </Col>
      </Row>
      <Divider />
      <Row :gutter="8" align="bottom">
        <Col flex="100px" style="align-content: center">
          <p style="height: 26px">
            学院
          </p>
        </Col>
        <Col flex="auto">
          <Input v-model="infoForm.collegeId" :border="false" :disabled="true"/>
        </Col>
      </Row>
      <Divider />
      <Row :gutter="8" align="bottom">
        <Col flex="100px" style="align-content: center">
          <p style="height: 26px">
            专业
          </p>
        </Col>
        <Col flex="auto">
          <Input v-model="infoForm.gradeId" :border="false" :disabled="true"/>
        </Col>
      </Row>
      <Divider />
      <Row :gutter="8" align="bottom">
        <Col flex="100px" style="align-content: center">
          <p style="height: 26px">
           状态
          </p>
        </Col>
        <Col flex="auto">
          <Input v-model="infoForm.status" :border="false" :disabled="true"/>
        </Col>
      </Row>
      <Divider />
      <Row :gutter="8" align="bottom">
        <Col flex="100px" style="align-content: center">
          <p style="height: 26px">
            预约次数
          </p>
        </Col>
        <Col flex="auto">
          <Input v-model="infoForm.total" :border="false" :disabled="true"/>
        </Col>
      </Row>
    </Card>

    <Modal v-model="showInfoFlag"
           title="信息编辑" ok-text="提交" cancel-text="取消" @on-ok="updInfo()">
      <Form :label-width="80" :model="infoForm">
        <FormItem label="用户账号">
          <Input v-model="updForm.userName" placeholder="请输入用户账号..."></Input>
        </FormItem>
        <FormItem label="用户姓名">
          <Input v-model="updForm.name" placeholder="请输入用户姓名..."></Input>
        </FormItem>
        <FormItem label="用户年龄">
          <Input v-model="updForm.age" placeholder="请输入用户年龄..."></Input>
        </FormItem>
        <FormItem label="用户头像">
          <Input v-model="tempurl" placeholder="请输入图片链接"></Input>
        </FormItem>
        <FormItem label="用户性别">
          <RadioGroup v-model="infoForm.gender">
            <Radio label="男">男</Radio>
            <Radio label="女">女</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="showPwdFlag"
           title="信息编辑" ok-text="提交" cancel-text="取消" @on-ok="updPwd()">
      <Form :label-width="80" :model="pwdForm">
        <FormItem label="原始密码">
          <Input v-model="pwdForm.oldPwd" type="password" placeholder="请输入原始密码..."></Input>
        </FormItem>
        <FormItem label="修改密码">
          <Input v-model="pwdForm.newPwd" type="password" placeholder="请输入修改密码..."></Input>
        </FormItem>
        <FormItem label="确认密码">
          <Input v-model="pwdForm.rePwd" type="password" placeholder="请输入确认密码..."></Input>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>

<script>
import {
  getLoginUser,
  updSessionInfo,
  updSessionPwd,
} from "../api";
import {Button, Card, Col, FormItem, Input, Table, Text} from "view-ui-plus";

export default {
  components: {Input, Button, Table, Card, Col, Text, FormItem},
  data() {
    return {
      showInfoFlag: false,
      showPwdFlag: false,
      tempurl: 'https://i.postimg.cc/CLMmC6R0/photomode-27012021-132506.png',
      url: 'https://i.postimg.cc/vTF2SjDb/D2-C048-FAB11904-E44-FD2-BC36-DAF783-CB.jpg',
      userInfo: {},
      border:true,
      buttonSize: 'large',


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
        collegeId: "",
        gradeId: "",
        status:"",
        total:" ",
      },
      studentForm: {
        id: "",
        userName: "",
        name: "",
        gender: "",
        age: "",
        collegeId: "",
        gradeId: "",
      },
      updForm:{
        id: "",
        userName: "",
        name: "",
        gender: "",
        age: "",
      },
    }
  },
  methods: {
    showInfoWin(){

      getLoginUser(this.$store.state.token).then(resp =>{

        this.updForm.id = resp.data.id;
        this.updForm.userName = resp.data.userName;
        this.updForm.name = resp.data.name;
        this.updForm.gender = resp.data.gender;
        this.updForm.age = resp.data.age;

        this.showInfoFlag = true;
      });
    },
    showPwdWin(){

      this.pwdForm = {
        token: this.$store.state.token,
        newPwd: "",
        rePwd: "",
        oldPwd: ""
      };
      this.showPwdFlag = true;
    },

    updInfo(){

      updSessionInfo(this.updForm).then(resp =>{

        if(resp.code == 0){

          this.$Message.success({
            background: true,
            content: '用户信息修改完成'
          });
        }else{

          this.$Message.warning({
            background: true,
            content: resp.msg
          });
        }
      });
    },
    updPwd(){

      updSessionPwd(this.pwdForm).then(resp =>{

        if(resp.code == 0){

          this.$Message.success({
            background: true,
            content: '用户密码修改完成'
          });
        }else{

          this.$Message.warning({
            background: true,
            content: resp.msg
          });
        }
      });
    },
  },
  mounted() {
    getLoginUser(this.$store.state.token).then(resp =>{
      this.url=this.tempurl;
      this.userInfo=resp.data;
      this.infoForm.id = resp.data.id;
      this.infoForm.userName = resp.data.userName;
      this.infoForm.name = resp.data.name;
      this.infoForm.gender = resp.data.gender;
      this.infoForm.age = resp.data.age;
      this.infoForm.collegeId=resp.data.collegeId;
      this.infoForm.gradeId=resp.data.gradeId;
      this.infoForm.total=resp.data.total;

      if(this.userInfo.type == 2){
        this.infoForm.collegeId=resp.data.collegeId;
        this.infoForm.gradeId=resp.data.gradeId;
        this.infoForm.total=resp.data.total;
      }
      else{
        this.infoForm.collegeId="暂无";
        this.infoForm.gradeId="暂无";
        this.infoForm.total="暂无";
      }
      if(this.userInfo.status== 0){
        this.infoForm.status="正常";
      }
      else{
        this.infoForm.status="异常";
      }

    });
  }
}

</script>