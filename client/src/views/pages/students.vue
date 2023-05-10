<template>
	<div class="fater-body-show">
        <Card>
            <template #title>
				信息查询
			</template>
			<div>
				<Form :model="qryForm" inline>
					<FormItem>
						<Input type="text" v-model="qryForm.stuName" placeholder="学生姓名……"></Input>
					</FormItem>
					<FormItem>
						<Select style="width:200px;" v-model="qryForm.gradeId" placeholder="选择班级……">
                            <Option value="">查看全部</Option>
                            <Option v-for="(item, index) in grades" 
                                :key="index" :value="item.id">{{ item.name }}</Option>
                        </Select>
					</FormItem>
					<FormItem>
						<Select style="width:200px;" v-model="qryForm.collegeId" placeholder="选择学院……">
                            <Option value="">查看全部</Option>
                            <Option v-for="(item, index) in colleges" 
                                :key="index" :value="item.id">{{ item.name }}</Option>
                        </Select>
					</FormItem>
					<FormItem>
						<Button type="primary" @click="getPageInfo(1, 10)">
							<Icon type="ios-search" />
						</Button>
					</FormItem>
				</Form>
			</div>
		</Card>

        <Card>
			<template #title>
				<Button  v-if="userInfo.type == 0" @click="showAddWin()" type="primary">
					<Icon type="md-add" />
				</Button>
			</template>
			<div>
				<Table border :columns="columns" :loading="loading" :data="pageInfos">
					<template #useTotal="{ row }">
						<span v-if="row.total > 0">{{ row.total + "个小时" }}</span>
                        <span v-else>暂无记录</span>
					</template>
					<template #status="{ row }">
						<span v-if="row.status == 0">正常</span>
                        <span v-else>异常</span>
					</template>
					<template #black="{ row }">
						<Button v-if="row.blackTotal > 0" size="small" type="info" @click="showBlackWin(row.id)">黑名单记录</Button>
                        <span v-else>暂无相关记录</span>
					</template>
					<template #action="{ row }">
						<Button style="margin-right: 5px;" 
                                size="small" type="info" icon="md-create" @click="showUpdWin(row)"></Button>
						<Button size="small" type="warning" icon="ios-trash" @click="delInfo(row.id)"></Button>
					</template>
				</Table>
				<Page style="margin-top: 15px;" v-if="pageTotal > 1" :current="pageIndex"
					@on-change="handleCurrentChange" :total="totalInfo" show-total/>
			</div>
		</Card>

        <Modal width="700" v-model="showAddFlag" title="信息编辑" ok-text="提交" cancel-text="取消" @on-ok="addInfo()">
            <Form :label-width="80" :model="studentForm">
                <FormItem label="学生学号" >
                    <Input v-model="studentForm.id" placeholder="请输入学生学号..." ></Input>
                </FormItem>
                <Row :gutter="15">
                    <Col span="12">
                        <FormItem label="学生账号">
                            <Input v-model="studentForm.userName" placeholder="请输入学生账号..."></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="学生姓名">
                            <Input v-model="studentForm.name" placeholder="请输入学生姓名..."></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="15">
                    <Col span="12">
                        <FormItem label="学生性别">
                            <RadioGroup v-model="studentForm.gender">
                                <Radio label="男">男</Radio>
                                <Radio label="女">女</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="学生年龄">
                            <Input v-model="studentForm.age" placeholder="请输入学生年龄..."></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="15">
                    <Col span="12">
                        <FormItem label="所属学院">
                            <Select v-model="studentForm.collegeId" placeholder="选择学院……">
                                <Option v-for="(item, index) in colleges" 
                                    :key="index" :value="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="所属班级">
                            <Select v-model="studentForm.gradeId" placeholder="选择班级……">
                                <Option v-for="(item, index) in grades" 
                                    :key="index" :value="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
		</Modal>

        <Modal v-model="showUpdFlag"
			title="信息编辑" ok-text="提交" cancel-text="取消" @on-ok="updInfo()">
			<Form :label-width="80" :model="studentForm">
                <FormItem label="所属学院">
                    <Select v-model="studentForm.collegeId" placeholder="选择学院……">
                        <Option v-for="(item, index) in colleges" 
                            :key="index" :value="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="所属班级">
                    <Select v-model="studentForm.gradeId" placeholder="选择班级……">
                        <Option v-for="(item, index) in grades" 
                            :key="index" :value="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
			</Form>
		</Modal>

        <Modal v-model="showBlackFlag" fullscreen="true" footer-hide="true" title="黑名单记录">
			<Card>
                <div>
                    <Table border :columns="blackCols" :data="pageBlack.infos">
                        <template #action="{ row }">
                            <Button v-if="row.isRemove" size="small" type="warning"  @click="removeBlack(row.id)">恢复正常</Button>
                            <Button v-else size="small" type="warning" disabled>恢复正常</Button>
                        </template>
                    </Table>
                    <Page style="margin-top: 15px;" v-if="pageBlack.total > 1" :current="pageBlack.index"
                        @on-change="handleBlackPage" :total="pageBlack.total" show-total/>
                </div>
            </Card>
		</Modal>
    </div>
</template>

<style></style>

<script>
import {
    getPageBlackLogs,
    getLoginUser,
    getAllColleges,
    getAllGrades,
    getPageStudents,
    addStudents,
    updStudents,
    delStudents,
    outBlack
} from '../../api/index.js';
export default{
		
    data(){
        return {
            showBlackFlag: false,
            pageBlack: {
                index: 1,
                size: 20,
                total: 0,
                infos: []
            },
            blackCols: [
                {title: '序号', type: 'index', width: 70, align: 'center'},
                {title: '拉黑时间', key: 'intoTime', align: 'center'},
                {title: '解除时间', key: 'outTime', align: 'center'},
                {title: '拉黑理由', key: 'reason', align: 'center'},
                {title: '操作', slot: 'action', align: 'center'}
            ],
            userInfo: {},
            colleges: [],
            grades: [],
            pageInfos: [],
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
            totalInfo: 0,
            loading: true,
            showAddFlag: false,
            showUpdFlag: false,
            qryForm: {
                stuName: "",
                collegeId: "",
                gradeId: "",
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
            columns: []
        }
    },
    methods: {

        getPageInfo(pageIndex, pageSize) {
			
            getPageStudents(pageIndex, pageSize, 
                this.qryForm.stuName, this.qryForm.collegeId, this.qryForm.gradeId).then(resp => {
                
                this.pageInfos = resp.data.data;
                this.pageIndex = resp.data.pageIndex;
                this.pageSize = resp.data.pageSize;
                this.pageTotal = resp.data.pageTotal;
                this.totalInfo = resp.data.count;
        
                this.loading = false;
            });
        },
        handleCurrentChange(pageIndex) {
        
            this.getPageInfo(pageIndex, this.pageSize);
        },
        removeBlack(id){
            
             this.$Modal.confirm({
                title: '系统提示',
                content: '确认要恢复学生正常状态吗？',
                onOk: () => {
                    outBlack({id: id, studentId: this.pageBlack.stuId}).then(resp =>{

                        this.$Message.success(resp.msg);
                        this.getPageBlackByStuyId(1, this.pageBlack.size);
                    });
                },
            });
        },
        getPageBlackByStuyId(pageIndex, pageSize){

            getPageBlackLogs(pageIndex, pageSize, this.pageBlack.stuId).then(resp =>{

                resp.data.data.forEach(item =>{

                    if(item.outTime == "-----"){

                       item['isRemove'] = true; 
                    }else{

                        item['isRemove'] = false;
                    }
                });

                this.pageBlack.infos = resp.data.data;
            });
        },
        handleBlackPage(pageIndex){

            this.getPageBlackByStuyId(pageIndex, this.pageBlack.size);
        },
        showBlackWin(stuId){

            this.pageBlack = {
                index: 1,
                size: 20,
                total: 0,
                infos: [],
                stuId: stuId
            }

            this.getPageBlackByStuyId(1, this.pageBlack.size);
            this.showBlackFlag =true;
        },
        showAddWin(){

            this.studentForm = {
                id: "",
                userName: "",
                name: "",
                gender: "",
                age: "",
                collegeId: "",
                gradeId: ""
            };
            this.showAddFlag = true;
        },	
        showUpdWin(row) {
			
            this.studentForm = row;
            this.showUpdFlag = true;
        },
        addInfo() {
			
            addStudents(this.studentForm).then(resp => {
                
                if(resp.code == 0){

                    this.$Notice.success({
                        duration: 3,
                        title: resp.msg
                    });
                    
                    this.getPageInfo(1, this.pageSize);
                    
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
        updInfo() {
        
            updStudents(this.studentForm).then(resp => {
        
                this.$Notice.success({
                    duration: 3,
                    title: resp.msg
                });
        
                this.getPageInfo(1, this.pageSize);
        
                this.showUpdFlag = false;
            });
        },
        delInfo(id){

            this.$Modal.confirm({
                title: '系统提示',
                content: '即将删除相关信息, 是否继续?',
                onOk: () => {
                    delStudents(id).then(resp =>{
                        
                        if(resp.code == 0){
                            this.$Notice.success({
                                duration: 3,
                                title: resp.msg
                            });
                            
                            this.getPageInfo(1, this.pageSize);
                        }else{
                            
                            this.$Notice.warning({
                                duration: 3,
                                title: resp.msg
                            });
                        }
                    });
                },
            });
        }	
    },
    mounted(){
        
        getAllColleges().then(resp =>{
            
            this.colleges = resp.data;
        });
        
        getAllGrades().then(resp =>{
            
            this.grades = resp.data;
        });

        getLoginUser(this.$store.state.token).then(resp =>{

            this.userInfo = resp.data;

            if(this.userInfo.type == 0){

                this.columns = [
                    {title: '序号', type: 'index', width: 70, align: 'center'},
                    {title: '学生账号', key: 'userName', align: 'center'},
                    {title: '学生姓名', key: 'name', align: 'center'},
                    {title: '学生性别', key: 'gender', align: 'center'},
                    {title: '学生年龄', key: 'age', align: 'center'},
                    {title: '所属学院', key: 'collegeName', align: 'center'},
                    {title: '所属专业', key: 'gradeName', align: 'center'},
                    {title: '学生状态', slot: 'status', align: 'center'},
                    {title: '学习时长', slot: 'useTotal', align: 'center'},
                    {title: '黑名单记录', slot: 'black', align: 'center'},
                    {title: '操作', slot: 'action', align: 'center'}
                ]
            }else{

                this.columns = [
                    {title: '序号', type: 'index', width: 70, align: 'center'},
                    {title: '学生账号', key: 'userName', align: 'center'},
                    {title: '学生姓名', key: 'name', align: 'center'},
                    {title: '学生性别', key: 'gender', align: 'center'},
                    {title: '学生年龄', key: 'age', align: 'center'},
                    {title: '所属学院', key: 'collegeName', align: 'center'},
                    {title: '所属专业', key: 'gradeName', align: 'center'},
                    {title: '学生状态', slot: 'status', align: 'center'},
                    {title: '学习时长', slot: 'useTotal', align: 'center'},
                    {title: '黑名单记录', slot: 'black', align: 'center'},
                ]
            }
            this.getPageInfo(1, this.pageSize);
        });
    }
}
</script>