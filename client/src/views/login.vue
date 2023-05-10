<template>
    <div class="login-body">
        <div class="login-win">
            <div class="login-form">
                <Form ref="loginForm" :rules="rules" :model="loginForm" :label-width= "100">
                  <FormItem style="margin-left: 35px">
                    <Icon type="md-home" size="28"></Icon>
                    <text style="font-size: large">自习室预约系统</text>
                  </FormItem>
                    <FormItem prop="userName">
                        <Input v-model="loginForm.userName" placeholder="请输入账号..."></Input>
                    </FormItem>
                    <FormItem prop="passWord">
                        <Input type="password" v-model="loginForm.passWord" placeholder="请输入密码..."></Input>
                    </FormItem>
                    <FormItem style="margin-top: 50px;">
                        <Button style="width:250px;"
                            @click="submitForm('loginForm')"  class="login-btn" type="primary">用户登录</Button>
                    </FormItem>

                  <FormItem style="margin-top: 20px;margin-left: 200px">
                    <Button :size="buttonSize" type="text" @click="RegisForm = true" >用户注册</Button>
                  </FormItem>
                </Form>
<!--******************************注册********************************************-->
              <Modal v-model="RegisForm" title="学生注册" ok-text="提交" cancel-text="取消" @on-ok="addInfo()">
                <Form :label-width="80" :model="RegisterForm">
                  <Row :gutter="15">
                    <Col span="12">
                      <FormItem label="账号">
                        <Input v-model="RegisterForm.userName" placeholder="请输入账号..."></Input>
                      </FormItem>
                    </Col>
                    <Col span="12">
                      <FormItem label="密码">
                        <Input v-model="RegisterForm.passWord" placeholder="请输入密码..."></Input>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row :gutter="15">
                    <Col span="12">
                      <FormItem label="学号">
                        <Input v-model="RegisterForm.id" placeholder="请输入学号..."></Input>
                      </FormItem>
                    </Col>
                    <Col span="12">
                      <FormItem label="姓名">
                        <Input v-model="RegisterForm.name" placeholder="请输入姓名..."></Input>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row :gutter="15">
                    <Col span="12">
                      <FormItem label="所属学院">
                        <Select v-model="RegisterForm.collegeId" placeholder="选择学院……">
                          <Option v-for="(item, index) in colleges"
                                  :key="index" :value="item.id">{{ item.name }}</Option>
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span="12">
                      <FormItem label="所属班级">
                        <Select v-model="RegisterForm.gradeId" placeholder="选择班级……">
                          <Option v-for="(item, index) in grades"
                                  :key="index" :value="item.id">{{ item.name }}</Option>
                        </Select>
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </Modal>

            </div>
        </div>
    </div>
</template>

<script>
import initMenu from "../utils/menus.js";
import {
  login,
  getLoginUser,
  updSessionInfo,
  updSessionPwd,
  getAllColleges,
  getAllGrades,
  addStudents,
} from '../api/index.js';
import {FormItem, Icon, Modal, Text} from "view-ui-plus";
export default {
  components: {Text, Icon, FormItem, Modal},
  data() {

        return {
          buttonSize: 'small',
          RegisForm:false,
          colleges: [],
          grades: [],
            loginForm: {
                userName: '',
                passWord: '',
            },
            rules: {
                userName: [
                    { required: true, message: '用户账号必须输入', trigger: 'blur' }
                ],
                passWord: [
                    { required: true, message: '用户密码必须输入', trigger: 'blur' }
                ],
            },
          RegisterForm: {
            id: "",
            userName: "",
            passWord: "",
            name: "",
            collegeId: "",
            gradeId: "",
          },
        }
    },
    methods: {
        submitForm (formName) {

            this.$refs[formName].validate((valid) => {
                if (valid) {

                    login(this.loginForm).then(res => {
                        
                        if(res.code == 0){

                            this.$store.commit('setToken', res.data);
                            sessionStorage.setItem("token", res.data);
                            initMenu(this.$router, this.$store);
                            this.$router.push('/welcome');
                        }else{

                            this.$Message.warning(res.msg);
                        }
                    });
                } else {

                    return false;
                }
            })
        },
      //注册
        addInfo() {
        addStudents(this.RegisterForm).then(resp => {

          if(resp.code == 0){

            this.$Notice.success({
              duration: 3,
              title: resp.msg
            });

            // this.getPageInfo(1, this.pageSize);

            this.showAddFlag = false;
          }else{

            this.$Notice.warning({
              duration: 3,
              title: resp.msg
            });

            this.showAddFlag = true;
          }
        });
      },
    },

  //获取学院与班级
    mounted() {
      getAllColleges().then(resp =>{

        this.colleges = resp.data;
      });

      getAllGrades().then(resp =>{

        this.grades = resp.data;
      });
    }
}
</script>

<style>
.login-body{
  background-color: #008080;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
.login-win{
  background-color: #F8F8FF;
  position: absolute;
  top: 45%;
  left: 48%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 330px;
  /*padding: 15px;*/
  border-radius: 5px;
  border: 2px solid #fff;

  background-size: cover;
}
.login-form{
  position: absolute;

  top: 10%;
  width: 350px;
}
</style>
