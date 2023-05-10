import {getLoginUser} from "../api";

export const adminMenus = {
    path: '/home',
    name: 'home',
    component: require("../views/home.vue").default,
    children: [
        {
            path: '/welcome',
            name: '首页',
            icon: "ios-home",
            component: require("../views/pages/welcome.vue").default
        },
        {
            path: '/colleges',
            name: '学院信息',
            icon: "ios-ribbon",
            component: require("../views/pages/colleges.vue").default
        },
        {
            path: '/grades',
            name: '专业信息',
            icon: "ios-appstore",
            component: require("../views/pages/grades.vue").default
        },
        {
            path: '/managers',
            name: '教师信息',
            icon: "md-people",
            component: require("../views/pages/managers.vue").default
        },
        {
            path: '/students',
            name: '学生信息',
            icon: "ios-people",
            component: require("../views/pages/students.vue").default
        },
        {
            path: '/rooms',
            name: '自习室管理',
            icon: "ios-easel",
            component: require("../views/pages/rooms.vue").default
        },
        {
            path: '/makelogs',
            name: '预约管理',
            icon: "ios-keypad",
            component: require("../views/pages/makelogs.vue").default
        },
        {
            path: '/center',
            name: '个人主页',
            icon: "ios-man",
            component: require("../views/center.vue").default
        }
    ]
}

export const managerMenus = {
    path: '/home',
    name: 'home',
    component: require("../views/home.vue").default,
    children: [
        {
            path: '/welcome',
            name: '首页',
            icon: "ios-home",
            component: require("../views/pages/welcome.vue").default
        },
        {
            path: '/students',
            name: '学生信息浏览',
            icon: "ios-people",
            component: require("../views/pages/students.vue").default
        },
        {
            path: '/rooms',
            name: '自习室管理',
            icon: "ios-easel",
            component: require("../views/pages/rooms.vue").default
        },
        {
            path: '/makelogs',
            name: '预约管理',
            icon: "ios-keypad",
            component: require("../views/pages/makelogs.vue").default
        },
        {
            path: '/center',
            name: '个人主页',
            icon: "ios-man",
            component: require("../views/center.vue").default
        },
    ]
}

export const studentMenus = {
    path: '/home',
    name: 'home',
    component: require("../views/home.vue").default,
    children: [
        {
            path: '/welcome',
            name: '首页',
            icon: "ios-home",
            component: require("../views/pages/welcome.vue").default
        },
        {
            path: '/rooms',
            name: '自习室浏览',
            icon: "ios-easel",
            component: require("../views/pages/rooms.vue").default
        },
        {
            path: '/makelogs',
            name: '学生预约记录',
            icon: "ios-keypad",
            component: require("../views/pages/makelogs.vue").default
        },
        {
            path: '/center',
            name: '个人主页',
            icon: "ios-man",
            component: require("../views/center.vue").default
        },
    ]
}

export default function initMenu(router, store){

    let token = null;
	if(store.state.token){

		token = store.state.token;
	}else{

		token = sessionStorage.getItem("token");
		store.state.token = sessionStorage.getItem("token");
	}

	getLoginUser(token).then(resp =>{

		if(resp.data.type == 0){
			router.addRoute(adminMenus);
			store.commit("setMenus", adminMenus);
		}
	
		if(resp.data.type == 1){
			router.addRoute(managerMenus);
			store.commit("setMenus", managerMenus);
		}
		
		if(resp.data.type == 2){
			router.addRoute(studentMenus);
			store.commit("setMenus", studentMenus);
		}

        router.push('/welcome');
	});
}