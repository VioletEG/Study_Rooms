//将num左补0为len长度的字符串
export function lpadNum(num, len) {
    var l = num.toString().length;
    while(l < len) {
        num = "0" + num;
        l++;
    }
    return num;
}

//将传入的Date格式化为"yyyy-MM-dd HH:mm:ss"
export function formatDate(d){

    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var resStr = year + "-" +  lpadNum(month, 2) + "-" + lpadNum(day, 2) 
                    + " " + lpadNum(hours,2) + ":" + lpadNum(minutes,2) 
                    + ":" + lpadNum(seconds,2);
    return resStr;
}

export function formatDate_1(d){

    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var resStr = year + "-" +  lpadNum(month, 2) + "-" + lpadNum(day, 2);
    return resStr;
}

// 字符串转换为时间
export function parseDate(str){

    str = str.replace(/-/g, "/");
    return new Date(str);
}

// 获取指定时间的对象
export function getDateObj(d){

    return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate()
    }
}

/**
 * 获取未来5天的日期
 */
export function getNextDays(){

    let days = [];

    let temp = new Date();

    for (let i = 24 * 1; i <= 24 * 5; i += 24) {

        let dateItem = new Date(temp.getTime() + i * 60 * 60 * 1000);

        days.push(formatDate_1(dateItem));
    }

    return days;
}

/**
 * 比较两个数字的大小
 * num1 < num2 返回 -1
 * num1 == num2 返回 0
 * num1 > num2 返回 1
 * */ 
 export function contrastNums(num1, num2){

    if(num1 < num2){

        return -1;
    }else if(num1 == num2){

        return 0;
    }else{

        return 1;
    }
}

/**
 * 指定时间和当前时间对比
 * -1 早 指定时间小于当前时间
 * 0  指定时间等于当前时间
 * 1 晚 指定时间大于当前时间
 *  */ 
export function contrastNow(str){

    let time1 = getDateObj(parseDate(str));
    let time2 = getDateObj(new Date());

    let year = contrastNums(time1.year, time2.year);

    if(year==0){

        let month = contrastNums(time1.month+1, time2.month+1);
        if(month==0){

            return contrastNums(time1.day, time2.day);
        }else{
            return month;
        }
    }else{
        return year;
    }
}