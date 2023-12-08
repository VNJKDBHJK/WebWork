<template>
  <div>
    <router-link to="/LogIn" class="login-link">退出</router-link>
    <h1>Shopping</h1>
    <el-tabs type="border-card">
      <el-tab-pane label="商品">
        <h2>商品</h2>
        <el-table :data="resData" stripe style="width: 100%">
          <el-table-column prop="index" label="序号" width="100"></el-table-column>
          <!-- <el-table-column prop="goodsId" label="商品Id" width="200"></el-table-column> -->
          <el-table-column prop="pname" label="商品名称" width="200"></el-table-column>
          <el-table-column prop="price" label="价格" width="100"></el-table-column>
          <el-table-column prop="image" label="商品图片">
            <template slot-scope="scope">
              <img :src="scope.row.image" height="250" alt="">
            </template>
          </el-table-column>

          <el-table-column prop="choice" label="数量" >
            <template slot-scope="scope">
              <el-input-number v-model="nums[scope.row.index]" controls-position="right" @change="handleChange" :min="1"
                :max="20" label="描述文字"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="choice" label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="medium" type="checkboxGroup2" icon="el-icon-plus"
                @click="addToCart(scope.row)">加入购物车</el-button></template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="我的购物车">
        <h2>我的购物车</h2>
        <el-checkbox :indeterminate="isItems" v-model="checkAll1" @change="handleCheckAllChange1">全选</el-checkbox>
        <el-table :data="responseData" stripe style="width: 100%">
          <el-table-column prop="choice" label="选择">
            <template slot-scope="scope">
              <el-checkbox v-model="selectedItems" :label="scope.row" @change="ChoiceToCart(scope.row)">{{ '选择'
              }}</el-checkbox>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="userId" label="用户Id" width="100"></el-table-column> -->
          <el-table-column prop="index" label="序号" width="50"></el-table-column>
          <!-- <el-table-column prop="goodsId" label="商品Id" width="100"></el-table-column>
          <el-table-column prop="cardid" label="cardid" width="100"></el-table-column> -->
          <el-table-column prop="name" label="商品名称" width="100"></el-table-column>
          <el-table-column prop="price" label="价格" width="100"></el-table-column>
          <el-table-column prop="num" label="数量" width="100"></el-table-column>
          <el-table-column prop="image" label="商品图片">
            <template slot-scope="scope">
              <img :src="scope.row.image" height="250" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="fond" label="操作">
            <template slot-scope="scope">
              <el-button size="medium" type="checkboxGroup2" icon="el-icon-delete"
                @click="ConcelToCart(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div style="margin-top: 20px">
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </div> -->
        <template>
          <div>
            <el-divider content-position="left" @change="amountAll">总计：{{ amount }}</el-divider>
            <el-button size="medium" type="checkboxGroup2" icon="el-icon-s-goods" @click="generatOder">生成订单</el-button>
          </div>
        </template>
      </el-tab-pane>

      <el-tab-pane label="我的订单">
        <h2>我的订单</h2>
        <el-table :data="responseDa" stripe style="width: 100%">
          <el-table-column prop="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="id" label="订单号"></el-table-column>
          <el-table-column prop="orderTime" label="生成时间"></el-table-column>
          <el-table-column prop="orderDetail" label="商品详情">
            <template slot-scope="scope">
              <el-button type="text" @click="table = true, getGoodsList(scope.row.index)">订单详情</el-button>
              <el-drawer title="订单:" :visible.sync="table" direction="rtl" size="50%">
                <el-table :data="tableData">
                  <el-table-column prop="goodsId" label="商品id"></el-table-column>
                  <el-table-column prop="goodsName" label="商品名"></el-table-column>
                  <el-table-column prop="nums[0]" label="数量"></el-table-column>
                  <el-table-column prop="numss" label="结算价格"></el-table-column>
                </el-table>
              </el-drawer>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
import store from '../store/store';
const instance = axios.create({
  baseURL: '/api',
  timeout: 1000,
})

export default {
  name: 'TestOne',
  data() {
    return {
      table: false,
      drawer: false,
      checkedIn: false,
      checkedOut: false,
      checkedOne: false,
      allChecked: false,
      resData: [],
      responseData: [],
      responseDa: [],
      nums: [].map(() => 1),
      numss:[],
      total: 0,
      userId: "",
      goodsId: "",
      cardid: "",
      price: "",
      num: "",
      isItems: false,
      selectedItems: [],
      allItems: [],
      amount: 0,
      cartid: [],
      cardIdsString: '',
      orderTime: "",
      id: '',
      orderDetail: [],
      OrderDetailid: "",
      dealPrice: '',
      numda: "",
      iidx: '',
      tableData: []
    }
  },

  mounted() {
    this.requestData()
    this.requestList()
    this.amountAll()
    this.getList()
    console.log(this.allItems.length);
    for(let i=0;i<this.allItems.length;i++){
      this.getGoodsList(i)
    }
    
  },

  methods: {
    getList() {
      const uid = store.state.uid;
      const url = `/api/order/listByUser?userId=${uid}`;
      axios.get(url)
        .then(response => {
          //console.log(response.data);
          this.responseDa = response.data.map((item, idx) => {
            //console.log( item.orderDetail);
            return {
              index: idx + 1,
              id: item.id,
              orderTime: item.orderTime,
              orderDetail: item.orderDetail,
            }

          })
          //console.log(this.responseDa);
        })
    },
    getGoodsList(row) {
      console.log(this.responseDa);
      console.log(row);
      for (let i = 0; i < this.responseDa[row-1].orderDetail.length; i++) {
        this.OrderDetailid = this.responseDa[row-1].orderDetail[i].OrderDetailid;
        this.goodsId = this.responseDa[row-1].orderDetail[i].goodsId;
        this.goodsName = this.responseDa[row-1].orderDetail[i].goodsName;
        this.nums = this.responseDa[row-1].orderDetail[i].nums;
      }
      this.tableData = this.responseDa[row-1].orderDetail.map((item) => {
      return {
        OrderDetailid: item.OrderDetailid,
        goodsId: item.goodsId,
        goodsName: item.goodsName,
        nums: item.nums,
        numss:[...item.nums.slice(13)]
      };
    });
    console.log(this.tableData);
    },
    generatOder() {
      const uid = store.state.uid;
      const url = `/api/order/addCastOrder?userId=${uid}&cartList=${encodeURIComponent(this.cardIdsString)}`;
      axios.get(url)
        .then(response => {
          console.log(response)

          for (let i = 0; i < this.selectedItems.length; i++) {
            this.ConcelWithoutMess(i);
          }
          this.selectedItems.splice(0);
          this.cartid.splice(0);
          this.cardIdsString = "";
          if (response != '') {
            this.$message({
              type: 'success',
              message: '成功构建订单！'
            });
          }
          console.log(response);

          for(let i=0;i<response.length;i++){
            this.getGoodsList(i);
          }
        })
        this.getList();
        
    },
    amountAll() {
      this.amount = 0;
      for (let i = 0; i < this.selectedItems.length; i++) {
        this.amount += this.selectedItems[i].price * this.selectedItems[i].num;
        this.cartid[i] = this.selectedItems[i].cardid;
      }
      this.cardIdsString = this.cartid.join(',');
      // console.log(this.cardIdsString);
    },
    ChoiceToCart(row) {
      if (this.selectedItems.includes(row)) {
        const index = this.selectedItems.indexOf(row);
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(row);
      }
      this.$forceUpdate();
      this.amountAll();
    },
    ConcelWithoutMess(row) {
      const uid = store.state.uid;
      const url = `/api/cart/deleteById?userId=${uid}&cartId=${encodeURIComponent(row.cardid)}`;
      axios.get(url)
        .then(response => {
          this.responseData = response.data.map((item, idx) => {
            return {
              index: idx + 1,
              cardid: item.cardid,
              userId: item.userId,
              goodsId: item.goodsId,
              num: item.num,
              price: item.price,
              image: `http://10.60.82.146:8080/${item.thumbnail}`,
              name: item.name,
            }
          })
        })
    },
    ConcelToCart(row) {
      const uid = store.state.uid;
      const url = `/api/cart/deleteById?userId=${uid}&cartId=${encodeURIComponent(row.cardid)}`;
      axios.get(url)
        .then(response => {
          this.responseData = response.data.map((item, idx) => {
            return {
              index: idx + 1,
              cardid: item.cardid,
              userId: item.userId,
              goodsId: item.goodsId,
              num: item.num,
              price: item.price,
              image: `http://10.60.82.146:8080/${item.thumbnail}`,
              name: item.name,
            }
          })
        })
      this.$message({
        type: 'success',
        message: '成功删除该选项！'
      });
    },
    addToCart(row) {
      if(this.nums[row.index]!=undefined){
      const uid = store.state.uid;
      const url = `/api/cart/add?userId=${encodeURIComponent(uid)}&goodsId=${encodeURIComponent(row.goodsId)}&num=${encodeURIComponent(this.nums[row.index])}&price=${encodeURIComponent(row.price)}`;
      axios.get(url)
        .then(response => {
          for(let i=0;i<response.length;i++){
            this.getGoodsList(i);
          }
          this.responseData = response.data.map((item, idx) => {
            return {
              index: idx + 1,
              cardid: item.cardid,
              userId: item.userId,
              goodsId: item.goodsId,
              num: item.num,
              price: item.price,
              image: `http://10.60.82.146:8080/${item.thumbnail}`,
              name: item.name,
            }
          })
        })
      this.$message({
        type: 'success',
        message: '成功添加至购物车！'
      });
      this.amountAll();
      this.getList();
    }else{
      this.$message({
        type: 'failed',
        message: '请添加数量！'
      });
    }
    },
    requestList() {
      const uid = store.state.uid;
      const url = `/api/cart/listByUser?userId=${encodeURIComponent(uid)}`;
      axios.get(url)
        .then(response => {
          this.allItems = this.responseData = response.data.map((item, idx) => {
            return {
              index: idx + 1,
              cardid: item.cardid,
              userId: item.userId,
              goodsId: item.goodsId,
              num: item.num,
              price: item.price,
              image: `http://10.60.82.146:8080/${item.thumbnail}`,
              name: item.name,

            }
          })
        })
      this.amountAll()
    },
    requestData() {
      instance
        .get('goods/list')
        .then((res) => {
          this.resData = res.data.map((item, idx) => {
            return {
              goodsId: item.id,
              index: idx + 1,
              pname: item.name,
              price: item.price1,
              cardid: item.cardid,
              image: `http://10.60.82.146:8080/${item.pthumbnail}`,
            }
          })
        })
        .catch((err) => {
          console.warn(err)
        })
    },
    handleAllCheckChange() {
      this.yourCheckboxList.forEach((item) => {
        item.checked = this.allChecked;
      });
    },
    handleChange(value) {
      this.num = value;
    },
    handleCheckAllChange1(val) {

      this.selectedItems = val ? this.allItems : [];

      if (this.selectedItems == [] || this.selectedItems == this.allItems) {
        this.isItems = false;
      }
      this.amountAll();
    },
  }
}
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.login-link {
  color: white;
  padding: 10px;
  border-radius: 5px;
  text-decoration: none;
  background-color: #b6b8b739;
  border: none;
  position: fixed;
  top: 0;
  left: 0;
}

.login-link:hover {
  background-color: #767474;
  cursor: pointer;
}
</style>