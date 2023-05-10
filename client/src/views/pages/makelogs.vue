<template>
	<div class="fater-body-show">
        <Card>
            <template #title>
				信息查询
			</template>
			<div>
				<Form :model="qryForm" inline>
					<FormItem v-if="userInfo.type != 2" prop="stuName">
						<Input type="text" v-model="qryForm.stuName" placeholder="学生姓名……"></Input>
					</FormItem>
					<FormItem prop="roomName">
						<Input type="text" v-model="qryForm.roomName" placeholder="自习室名称……"></Input>
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
			<div>
				<Table border :columns="columns" :loading="loading" :data="pageInfos">
					<template #makePosition="{ row }">
                        <span>{{ "第 " + row.rIndex + " 行 " + row.cIndex + " 排"}}</span>
					</template>
          <template #action2="{ row }">
                        <Button v-if ="row.flag == 0" @click="cancel(row.id, row.studentId)" size="small" type="primary">取消预约</Button>
                        <Button v-else-if="row.flag == 1" @click="startUse(row.id, row.studentId)" size="small" type="primary">开始使用</Button>
                        <Button v-else-if="row.flag == 2" @click="endUse(row.id, row.studentId, row.startTime)"  size="small" type="primary">结束使用</Button>
                        <span v-else-if="row.flag == 3">结束使用</span>
                        <span v-else-if="row.flag == 4">预约过期</span>
                        <span v-else-if="row.flag == 5">过期取消</span>


          </template>
					<template #action1="{ row }">
                        <span v-if="row.flag == 0">预约等待</span>
                        <Button v-else-if="row.flag == 1" @click="startUse(row.id, row.studentId)" size="small" type="primary">开始使用</Button>
                        <Button v-else-if="row.flag == 2" @click="endUse(row.id, row.studentId, row.startTime)"  size="small" type="primary">结束使用</Button>
                        <span v-else-if="row.flag == 3">结束使用</span>
                        <Button v-else-if="row.flag == 4" @click="cancle(row.id, row.studentId)" size="small" type="primary">取消预约</Button>
                        <span v-else-if="row.flag == 5">过期取消</span>
					</template>
					<template #status="{ row }">
                        <span v-if="row.flag == 0">预约等待</span>
                        <span v-else-if="row.flag == 1">等待使用</span>
                        <span v-else-if="row.flag == 2">使用中</span>
                        <span v-else-if="row.flag == 3">结束使用</span>
                        <span v-else-if="row.flag == 4">预约取消</span>
                        <span v-else-if="row.flag == 5">过期被拉黑</span>
					</template>
				</Table>
				<Page style="margin-top: 15px;" v-if="pageTotal > 1" :current="pageIndex"
					@on-change="handleCurrentChange" :total="totalInfo" show-total/>
			</div>
		</Card>
    </div>
</template>

<style></style>

<script>
import { 
    contrastNow 
} from '../../utils/date.js';
import {
  getLoginUser,
  getPageMakeLogs,
  startMakeLog,
  endMakeLog,
  cancelMakeLog, deleteMakeLog,
} from '../../api/index.js';
import {Button} from "view-ui-plus";
export default{
  components: {Button},
  data(){
        return {
            userInfo: {},
            pageInfos: [],
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
            totalInfo: 0,
            loading: true,
            qryForm: {
                stuId: "", 
                stuName: "", 
                roomName: ""
            },
            columns: []
        }
    },
    methods: {
        getPageInfo(pageIndex, pageSize) {
			
            getPageMakeLogs(pageIndex, pageSize, 
                    this.qryForm.stuId, this.qryForm.stuName, this.qryForm.roomName).then(resp => {
                
                resp.data.data.forEach(item =>{

                    let temp = item.place.split(",");
                    item["rIndex"] = temp[0];
                    item["cIndex"] = temp[1];

                    if(item.status == 0){

                        if(contrastNow(item.makeTime) == -1){

                            item["flag"] = 4;
                        }else if(contrastNow(item.makeTime) == 0){

                            item["flag"] = 1;
                        }else if(contrastNow(item.makeTime) == 1){

                            item["flag"] = 0;
                        }
                    }else if(item.status == 1){

                        item["flag"] = 2;
                    }else if(item.status == 2){

                        item["flag"] = 3;
                    }else if(item.status == 3){

                        item["flag"] = 5;
                    }
                });

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
        startUse(id, studentId){

            this.$Modal.confirm({
                title: '系统提示',
                content: '确认开始使用?',
                onOk: () => {
                    startMakeLog({
                        id: id,
                        studentId: studentId,
                        status: 1
                    }).then(resp =>{

                        this.$Notice.success({
                            duration: 3,
                            title: resp.msg
                        });
                        this.getPageInfo(1, this.pageSize);
                    });
                }
            });
            
        },
        endUse(id, studentId, startTime){

            this.$Modal.confirm({
                title: '系统提示',
                content: '确认结束使用?',
                onOk: () => {
                    endMakeLog({
                        id: id,
                        studentId: studentId,
                        startTime: startTime,
                        status: 2
                    }).then(resp =>{

                        this.$Notice.success({
                            duration: 3,
                            title: resp.msg
                        });
                        this.getPageInfo(1, this.pageSize);
                    });
                }
            });
        },
        cancel(id,studentId){
          this.$Modal.confirm({
              title:'系统提示',
              content:'取消后无法恢复,确认取消?',
              onOk: () => {
                deleteMakeLog({
                  id: id,
                  studentId: studentId,
                  status: 0
                }).then(resp =>{

                  this.$Notice.success({
                    duration: 3,
                    title: resp.msg
                  });
                  this.getPageInfo(1, this.pageSize);
                });
              }
          })
        },
        cancle(id, studentId){

            this.$Modal.confirm({
                title: '系统提示',
                content: '过期未使用的学生将被暂时拉入黑名单，确认继续吗？',
                onOk: () => {
                    cancelMakeLog({
                        id: id,
                        studentId: studentId,
                        status: 3
                    }).then(resp =>{

                        this.$Notice.success({
                            duration: 3,
                            title: resp.msg
                        });
                        this.getPageInfo(1, this.pageSize);
                    });
                }
            });
            
        }
    },
    mounted(){

        getLoginUser(this.$store.state.token).then(resp =>{

            this.userInfo = resp.data;

            if(this.userInfo.type == 2){

                this.qryForm.stuId = this.userInfo.id;
                this.columns = [
                    {title: '序号', type: 'index', width: 70, align: 'center'},
                    {title: '自习室名称', key: 'roomName', align: 'center'},
                    {title: '预约位置', slot: 'makePosition', align: 'center'},
                    {title: '申请时间', key: 'createTime', align: 'center'},
                    {title: '预约时间', key: 'makeTime', align: 'center'},
                    {title: '操作', slot: 'action2', align: 'center'},
                    {title: '处理状态', slot: 'status', align: 'center'}
                ];
            }else{

                this.columns = [
                    {title: '序号', type: 'index', width: 70, align: 'center'},
                    {title: '自习室名称', key: 'roomName', align: 'center'},
                    {title: '预约位置', slot: 'makePosition', align: 'center'},
                    {title: '申请时间', key: 'createTime', align: 'center'},
                    {title: '预约时间', key: 'makeTime', align: 'center'},
                    {title: '预约学生', key: 'stuName', align: 'center'},
                    {title: '操作', slot: 'action1', align: 'center'}
                ];
            }
            this.getPageInfo(1, this.pageSize);
        });
    }
}
</script>