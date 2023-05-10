<template>
	<div class="fater-body-show">
        <Card>
            <template #title>
				信息查询
			</template>
			<div>
				<Form :model="qryForm" inline>
					<FormItem prop="name">
						<Input type="text" v-model="qryForm.manName" placeholder="管理员姓名……"></Input>
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
				<Button @click="showAddWin()" type="primary">
					<Icon type="md-add" />
				</Button>
			</template>
			<div>
				<Table border :columns="columns" :loading="loading" :data="pageInfos">
					<template #action="{ row }">
						<Button size="small" type="warning" icon="ios-trash" @click="delInfo(row.id)"></Button>
					</template>
				</Table>
				<Page style="margin-top: 15px;" v-if="pageTotal > 1" :current="pageIndex"
					@on-change="handleCurrentChange" :total="totalInfo" show-total/>
			</div>
		</Card>

        <Modal width="800" v-model="showAddFlag"
			title="信息编辑" ok-text="提交" cancel-text="取消" @on-ok="addInfo()">
			<Form :label-width="90" :model="manageForm">
				<FormItem label="管理员工号">
					<Input v-model="manageForm.id" placeholder="请输入管理员工号..."></Input>
				</FormItem>
                <Row :gutter="15">
                    <Col span="12">
                        <FormItem label="管理员账号">
                            <Input v-model="manageForm.userName" placeholder="请输入管理员账号..."></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="管理员姓名">
                            <Input v-model="manageForm.name" placeholder="请输入管理员姓名..."></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="15">
                    <Col span="12">
                        <FormItem label="管理员年龄">
                            <Input v-model="manageForm.age" placeholder="请输入管理员年龄..."></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="管理员性别">
                            <RadioGroup v-model="manageForm.gender">
                                <Radio label="男">男</Radio>
                                <Radio label="女">女</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                </Row>
			</Form>
		</Modal>
    </div>
</template>

<style></style>

<script>
import {
    getPageManagers,
    addManagers,
    delManagers,
} from '../../api/index.js';
export default{
		
    data(){
        return {
            pageInfos: [],
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
            totalInfo: 0,
            loading: true,
            showAddFlag: false,
            qryForm: {
                manName: "",
            },
            manageForm: {
                id: "",
                userName: "",
                name: "",
                gender: "",
                age: "",
            },
            columns: [
                {title: '序号', type: 'index', width: 70, align: 'center'},
                {title: '管理员账号', key: 'userName', align: 'center'},
                {title: '管理员姓名', key: 'name', align: 'center'},
                {title: '管理员性别', key: 'gender', align: 'center'},
                {title: '管理员年龄', key: 'age', align: 'center'},
                {title: '操作', slot: 'action', align: 'center'}
            ]
        }
    },
    methods: {

        getPageInfo(pageIndex, pageSize) {
			
            getPageManagers(pageIndex, pageSize, 
                    this.qryForm.manName).then(resp => {
                
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
        showAddWin(){

            this.manageForm = {
                id: "",
                userName: "",
                name: "",
                gender: "",
                age: "",
            };
            this.showAddFlag = true;
        },
        addInfo() {
			
            addManagers(this.manageForm).then(resp => {                
                
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
        delInfo(id){

            this.$Modal.confirm({
                title: '系统提示',
                content: '即将删除相关信息, 是否继续?',
                onOk: () => {
                    delManagers(id).then(resp =>{
                        
                        this.$Notice.success({
                            duration: 3,
                            title: resp.msg
                        });
                        
                        this.getPageInfo(1, this.pageSize);
                    });
                },
            });
        }
    },
    mounted(){
        
         this.getPageInfo(1, this.pageSize);
    }
}
</script>