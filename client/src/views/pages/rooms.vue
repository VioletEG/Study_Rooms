<template>
	<div class="fater-body-show">
        <Card>
            <template #title>
				信息查询
			</template>
			<div>
				<Form :model="qryForm" inline>
					<FormItem prop="name">
						<Input type="text" v-model="qryForm.name" placeholder="自习室名称……"></Input>
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
			<template v-if="userInfo.type != 2" #title>
				<Button @click="showAddWin()" type="primary">
					<Icon type="md-add" />
				</Button>
			</template>
			<div>
				<Table border :columns="columns" :loading="loading" :data="pageInfos">
					<template #struct="{ row }">
                        <span>{{ row.rNums + " x " + row.cNums }}</span>
					</template>
					<template #action="{ row }">
						<Button v-if="userInfo.type != 2" style="margin-right: 5px;" 
                                size="small" type="info" icon="md-create" @click="showUpdWin(row)"></Button>
						<Button v-if="userInfo.type != 2" size="small" type="warning" icon="ios-trash" @click="delInfo(row.id)"></Button>
                        <Button v-if="userInfo.type == 2" size="small" type="primary" @click="showRoomWin(row.id, row.rNums, row.cNums)">预定</Button>
					</template>
				</Table>
				<Page style="margin-top: 15px;" v-if="pageTotal > 1" :current="pageIndex"
					@on-change="handleCurrentChange" :total="totalInfo" show-total/>
			</div>
		</Card>

        <Modal width="800" v-model="showAddFlag"
			title="信息编辑" ok-text="提交" cancel-text="取消" @on-ok="addInfo()">
			<Form :label-width="90" :model="roomForm">
				<FormItem label="自习室名称">
					<Input v-model="roomForm.name" placeholder="请输入自习室名称..."></Input>
				</FormItem>
                <Row :gutter="15">
                    <Col span="12">
                        <FormItem label="座位行数">
                            <Input v-model="roomForm.rNums" placeholder="请输入座位行数..."></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="座位列数">
                            <Input v-model="roomForm.cNums" placeholder="请输入座位列数..."></Input>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="最大预约">
                    <Input v-model="roomForm.maxTotal" placeholder="请输入最大预约..."></Input>
                </FormItem>
                <FormItem label="自习室介绍">
                    <Input v-model="roomForm.intro" type="textarea"  rows="6" placeholder="请输入自习室介绍..."></Input>
                </FormItem>
			</Form>
		</Modal>

        <Modal width="800" v-model="showUpdFlag"
			title="信息编辑" ok-text="提交" cancel-text="取消" @on-ok="updInfo()">
			<Form :label-width="90" :model="roomForm">
				<FormItem label="自习室名称">
					<Input v-model="roomForm.name" placeholder="请输入自习室名称..."></Input>
				</FormItem>
                <Row :gutter="15">
                    <Col span="12">
                        <FormItem label="座位行数">
                            <Input v-model="roomForm.rNums" placeholder="请输入座位行数..."></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="座位列数">
                            <Input v-model="roomForm.cNums" placeholder="请输入座位列数..."></Input>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="最大预约">
                    <Input v-model="roomForm.maxTotal" placeholder="请输入最大预约..."></Input>
                </FormItem>
                <FormItem label="自习室介绍">
                    <Input v-model="roomForm.intro" type="textarea"  rows="6" placeholder="请输入自习室介绍..."></Input>
                </FormItem>
			</Form>
		</Modal>

        <Modal width="800" v-model="showRoomFlag"
			title="座位预约" ok-text="提交" cancel-text="取消" @on-ok="makeSeat()">
            <Form :label-width="90" :model="makeForm">
                <FormItem label="预约时间">
                    <RadioGroup v-model="makeForm.makeTime" type="button">
                        <Radio @change="switchTime(makeForm.makeTime)" v-for="(item, index) in days" :key="index" :label="item">{{ item }}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="预约位置">
                    <table class="fater-seats">
                        <tr v-for="rIndex of struct.rs" :key='rIndex'>
                            <td @click="selectSet(rIndex, cIndex)" v-for="cIndex of struct.cs" :key='cIndex'> 
                                <span v-if="isSelect(rIndex, cIndex)" style="background-color: #009999"></span>
                                <span v-else-if="validitySeat(rIndex, cIndex)" style="background-color: #F2F2F2"></span>
                                <span v-else style="background-color: #19be6b"></span>
                            </td>
                        </tr>
                    </table>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<style></style>

<script>
import { 
    getNextDays 
} from '../../utils/date.js';

import {
    getRoomList,
    getLoginUser,
    getPageRooms,
    addRoom,
    updRoom,
    delRoom,
    addMakeLog
} from '../../api/index.js';
export default{
		
    data(){
        return {
            rooms: [],
            days: [],
            struct: {},
            userInfo: {},
            pageInfos: [],
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
            totalInfo: 0,
            loading: true,
            showRoomFlag: false,
            showAddFlag: false,
            showUpdFlag: false,
            qryForm: {
                name: "",
            },
            roomForm: {
                id: "",
                name: "",
                intro: "",
                rNums: "",
                cNums: "",
                total: "",
                maxTotal: "",
            },
            makeForm: {
                roomId: "",
                makeTime: "",
                studentId: "",
                x: "",
                y: "",
                place: "",
            },
            columns: [
                {title: '序号', type: 'index', width: 70, align: 'center'},
                {title: '自习室名称', key: 'name', align: 'center'},
                {title: '自习室结构', slot: 'struct', align: 'center'},
                {title: '最大预约数', key: 'maxTotal', align: 'center'},
                {title: '自习室描述', key: 'intro', align: 'left'},
                {title: '操作', slot: 'action', align: 'center'}
            ]
        }
    },
    methods: {

        getPageInfo(pageIndex, pageSize) {
			
            getPageRooms(pageIndex, pageSize, 
                    this.qryForm.name).then(resp => {
                
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
        switchTime(makeTime){

            getRoomList(this.makeForm.roomId, makeTime).then(resp =>{

                this.rooms = resp.data;
                this.makeForm.x = "";
                this.makeForm.y = "";
                this.makeForm.place = "";
            });
        },
        selectSet(rIndex, cIndex){

            this.makeForm.x = rIndex;
            this.makeForm.y = cIndex;
            this.makeForm.place = rIndex+","+cIndex;
        },
        isSelect(rIndex, cIndex){

            if(rIndex == this.makeForm.x && cIndex == this.makeForm.y){

                return true;
            }else{

                return false;
            }
        },
        validitySeat(rIndex, cIndex){

            let flag = false;
            for(let i = 0; i < this.rooms.length; i++){

                let item = this.rooms[i];

                if(item.rIndex == rIndex && item.cIndex == cIndex){

                    flag = item.flag;
                    break;
                }
            }

            return flag;
        },
        showRoomWin(id, rNums, cNums){

            this.struct = {
                rs: rNums,
                cs: cNums
            };
            this.days = getNextDays();
            
            this.makeForm = {
                roomId: id,
                makeTime: this.days[0],
                studentId: this.userInfo.id,
                x: "",
                y: "",
                place: "",
            }
            getRoomList(id, this.days[0]).then(resp =>{

                this.rooms = resp.data;
                this.showRoomFlag = true;
            });
        },
        showAddWin(){

            this.roomForm = {
                name: "",
                intro: "",
                rNums: 0,
                cNums: 0,
                total: 0,
                maxTotal: 0,
            };
            this.showAddFlag = true;
        },
        showUpdWin(row) {
			
            this.roomForm = row;
            this.showUpdFlag = true;
        },
        makeSeat(){

            addMakeLog(this.makeForm).then(resp =>{

                if(resp.code == 0){
                    this.$Notice.success({
                        duration: 3,
                        title: resp.msg
                    });
                    
                    this.showRoomFlag = false;
                }else{
                    
                    this.$Notice.warning({
                        duration: 3,
                        title: resp.msg
                    });
                    
                    this.showRoomFlag = true;
                }
            });
        },
        addInfo() {
			
            addRoom(this.roomForm).then(resp => {
                
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
                }
            });
        },
        updInfo() {
        
            updRoom(this.roomForm).then(resp => {
        
                if(resp.code == 0){
                    this.$Notice.success({
                        duration: 3,
                        title: resp.msg
                    });
                    
                    this.getPageInfo(1, this.pageSize);
                
                    this.showUpdFlag = false;
                }else{
                    
                    this.$Notice.warning({
                        duration: 3,
                        title: resp.msg
                    });
                }
            });
        },
        delInfo(id){

            this.$Modal.confirm({
                title: '系统提示',
                content: '即将删除相关信息, 是否继续?',
                onOk: () => {
                    delRoom(id).then(resp =>{
                        
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
        
        getLoginUser(this.$store.state.token).then(resp =>{

            this.userInfo = resp.data;
        });
        this.getPageInfo(1, this.pageSize);
    }
}
</script>