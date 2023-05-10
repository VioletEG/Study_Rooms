import http from "../utils/http.js";


/** 系统接口 */
export function login(param){
	
	return http.post('/login/', param);
}

export function exit(token){
	
	return http.post('/exit/', {token: token});
}
export function getLoginUser(token){
	
	return http.get('/info/', {params: {token: token}});
}
export function updSessionInfo(param){
	
	return http.post('/info/', param);
}
export function updSessionPwd(param){
	
	return http.post('/pwd/', param);
}

/** 统计数据接口 */
export function getDayStatisSeatUSeVSFree(){

	return http.get("/statistics/seat/day/usevfree");
}
export function getMonthStatisSeatUse(){

	return http.get("/statistics/seat/month/use");
}
export function getMonthStatisSeatMake(){

	return http.get("/statistics/seat/month/make");
}
export function getDayStatisStuNormalVSBlack(){

	return http.get("/statistics/student/normalvsblack");
}


/** 学院信息处理接口 */
export function getAllColleges(){

	return http.get('/colleges/all/');
}
export function getPageColleges(pageIndex, pageSize, name){

	return http.get('/colleges/page/', 
        {params: {pageIndex: pageIndex, pageSize: pageSize, name: name}});
}
export function addColleges(params){
	
	return http.post('/colleges/add/', params);
}
export function updColleges(params){
	
	return http.post('/colleges/upd/', params);
}
export function delColleges(id){
	
	return http.post('/colleges/del/', {id: id});
}

/** 班级信息处理接口 */
export function getAllGrades(){

	return http.get('/grades/all/');
}
export function getPageGrades(pageIndex, pageSize, name){

	return http.get('/grades/page/', 
        {params: {pageIndex: pageIndex, pageSize: pageSize, name: name}});
}
export function addGrades(params){
	
	return http.post('/grades/add/', params);
}
export function updGrades(params){
	
	return http.post('/grades/upd/', params);
}
export function delGrades(id){
	
	return http.post('/grades/del/', {id: id});
}

/** 学生信息处理接口 */
export function getPageStudents(pageIndex, pageSize, stuName, collegeId, gradeId){

	return http.get('/users/page/student', 
        {params: {pageIndex: pageIndex, pageSize: pageSize, stuName: stuName, collegeId: collegeId, gradeId: gradeId}});
}
export function addStudents(params){
	
	return http.post('/students/add/', params);
}
export function updStudents(params){
	
	return http.post('/students/upd/', params);
}
export function delStudents(id){
	
	return http.post('/students/del/', {id: id});
}

/** 管理员信息处理接口 */
export function getPageManagers(pageIndex, pageSize, manName){

	return http.get('/users/page/manage', 
        {params: {pageIndex: pageIndex, pageSize: pageSize, manName: manName}});
}
export function addManagers(params){
	
	return http.post('/users/add/', params);
}
export function delManagers(id){
	
	return http.post('/users/del/', {id: id});
}

/** 自习室信息处理接口 */
export function getPageRooms(pageIndex, pageSize, name){

	return http.get('/rooms/page/', 
        {params: {pageIndex: pageIndex, pageSize: pageSize, name: name}});
}
export function getRoomList(roomId, makeTime){

	return http.get('/rooms/makelist/', {params: {roomId: roomId, makeTime: makeTime}});
}
export function addRoom(params){
	
	return http.post('/rooms/add/', params);
}
export function updRoom(params){
	
	return http.post('/rooms/upd/', params);
}
export function delRoom(id){
	
	return http.post('/rooms/del/', {id: id});
}

/** 自习室预约 */
export function getPageMakeLogs(pageIndex, pageSize, stuId, stuName, roomName){

	return http.get('/makelogs/page/', 
        {params: {pageIndex: pageIndex, pageSize: pageSize, stuId: stuId, stuName: stuName, roomName: roomName}});
}
export function addMakeLog(params){

	return http.post('/makelogs/add/', params);
}
export function startMakeLog(params){

	return http.post('/makelogs/start/', params);
}
export function endMakeLog(params){

	return http.post('/makelogs/end/', params);
}
export function cancelMakeLog(params){

	return http.post('/makelogs/cancel/', params);
}
export function deleteMakeLog(params){
	return http.post('/makelogs/delete/',params);
}

/** 黑名单记录 */
export function getPageBlackLogs(pageIndex, pageSize, stuId){

	return http.get('/blacklogs/page/', 
        {params: {pageIndex: pageIndex, pageSize: pageSize, stuId: stuId}});
}
export function outBlack(params){

	return http.post('/blacklogs/out/', params);
}
