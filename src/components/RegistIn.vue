<template>
  <div class="registration">
    <h1>Registration</h1>
    <router-link to="/LogIn"
      style="color: white; background-color: powderblue; padding: 10px; border-radius: 5px; text-decoration: none;">Already
      have an account? Click Sign in</router-link>
    <form class="registration-form" @submit.prevent="register">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" placeholder="Username" />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="Password" />
      </div>

      <div class="form-group">
        <label for="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" v-model="confirmPassword" placeholder="Confirm Password" />
      </div>

      <button type="submit">Register</button>
    </form>
    <p>{{ Message }}</p>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      Message: "",
    };
  },
  methods: {
    register() {
      // 判断两次输入的密码是否一致
      if (this.password !== this.confirmPassword) {
        this.Message = '两次输入的密码不一致，请重新输入';
        this.password = '';
        this.confirmPassword = '';
        return; // 终止注册逻辑
      }
      const url = `/api/user/register?name=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`;

      axios.post(url)
        .then(response => {
          // 处理接口返回的数据
          if (response.data=='OK') {
            this.Message = '注册成功';
            this.$router.push("/LogIn");
          } else if(response.data=='isexist'){
            console.log(response.data)
            this.Message = '注册失败: 用户已存在';
            this.username = '';
            this.password = '';
            this.confirmPassword = '';
          }else{
            this.Message='注册失败'+response.data;
          }
        })
        .catch(error => {
          // 处理请求错误的情况
          this.Message = '注册请求错误: ' + error;
          this.username = '';
          this.password = '';
          this.confirmPassword = '';
        });
    }
  },
};
</script>

<style scoped>
.registration {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 100px);
  /* 减去顶部导航栏高度 */
  background-color: #f5f5f5;
}

.registration h1 {
  font-size: 36px;
  margin-bottom: 20px;
}

.registration-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.form-group label {
  font-size: 18px;
  margin-bottom: 5px;
}

.form-group input {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  font-size: 16px;
}

button[type="submit"] {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #0069d9;
}
</style>