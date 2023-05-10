<template>
  <div class="fater-body-show">

    <Row :gutter="16">
      <Col span="16" >
        <Card >
          <Carousel autoplay ="true" loop height="400px" weight="600px">
            <CarouselItem>
              <Image :src="imglist.url" fit="fill" height="100%" width="100%"/>
            </CarouselItem>
            <CarouselItem>
              <Image :src="imglist.url1" fit="fill" height="100%" width="100%"/>
            </CarouselItem>
            <CarouselItem>
              <Image :src="imglist.url2" fit="fill" height="100%" width="100%"/>
            </CarouselItem>
            <CarouselItem>
              <Image :src="imglist.url3" fit="fill" height="100%" width="100%"/>
            </CarouselItem>
          </Carousel>
        </Card>
        <Card>
          <div class="fater-calendar-panel">
            <Calendar cell-height="50"/>
          </div>
        </Card>
      </Col>
      <Col span="8">
        <Card>
          <template #title>
            自习室使用
          </template>
          <div ref="barUseVsFree" style="width: 100%;height: 360px;"></div>
        </Card>
        <Card>
          <template #title>
            学生状态
          </template>
          <div ref="barNormalVsBlack" style="width: 100%;height: 360px;"></div>
        </Card>
      </Col>
    </Row>
  </div>
</template>



<script>
import {
  getDayStatisSeatUSeVSFree,
  getMonthStatisSeatUse,
  getMonthStatisSeatMake,
  getDayStatisStuNormalVSBlack,
} from '../../api/index.js';
import * as echarts from "echarts";
import {Card, Col, Image, Row} from "view-ui-plus";
export default{
  components: {Row, Col, Image, Card},
  data(){
    return {
      value: 0,
      imglist:
          {
            url: require('../../img/test0.jpg'),
            url1: require('../../img/test1.jpg'),
            url2: require('../../img/test2.jpg'),
            url3: require('../../img/test3.jpg')
          },
      useSeatData: {
        items: [],
        vals: []
      },
      makeSeatData: {
        items: [],
        vals: []
      },
      daySeatUSeVSFreeData: [],
      dayStuNormalVSBlack: [],

    }
  },
  methods: {

    drawLineSeatUse(){

      let lineUseSeat = echarts.init(this.$refs.lineUseSeat);

      lineUseSeat.setOption({
        xAxis: {
          type: 'category',
          data: this.useSeatData.items
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.useSeatData.vals,
            type: 'line',
            smooth: true
          }
        ]
      });
    },
    drawLineSeatMake(){

      let lineMakeSeat = echarts.init(this.$refs.lineMakeSeat);

      lineMakeSeat.setOption({
        xAxis: {
          type: 'category',
          data: this.makeSeatData.items
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.makeSeatData.vals,
            type: 'line',
            smooth: true
          }
        ]
      });
    },
    drawBarSeatUseVSFree(){

      let barUseVsFree = echarts.init(this.$refs.barUseVsFree);
      barUseVsFree.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 25,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: this.daySeatUSeVSFreeData
        }]
      });
    },
    drawBarStuNormalVSBlack(){

      let barNormalVsBlack = echarts.init(this.$refs.barNormalVsBlack);
      barNormalVsBlack.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 25,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: this.dayStuNormalVSBlack
        }]
      });
    },
  },
  mounted(){

    getMonthStatisSeatUse().then(resp =>{

      resp.data.forEach(item =>{

        this.useSeatData.items.push(item.day);
        this.useSeatData.vals.push(item.total);
      })
      this.drawLineSeatUse();
    });
    getMonthStatisSeatMake().then(resp =>{

      resp.data.forEach(item =>{

        this.makeSeatData.items.push(item.day);
        this.makeSeatData.vals.push(item.total);
      })
      this.drawLineSeatMake();
    });
    getDayStatisSeatUSeVSFree().then(resp =>{

      this.daySeatUSeVSFreeData = [
        { value: resp.data.useTotal, name: "使用位置"},
        { value: resp.data.freeTotal, name: "空闲位置"},
      ];
      this.drawBarSeatUseVSFree();
    });
    getDayStatisStuNormalVSBlack().then(resp =>{

      this.dayStuNormalVSBlack = [
        { value: resp.data.normal, name: "正常学生"},
        { value: resp.data.black, name: "限制学生"},
      ];
      this.drawBarStuNormalVSBlack();
    });
  }
}
</script>