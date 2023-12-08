<template>
  <div class="login">
    <h1>Login</h1>
    <router-link to="/RegistIn"
      style="color: white; background-color: paleturquoise; padding: 10px; border-radius: 5px; text-decoration: none;">Don't
      have an account? Click Register</router-link>
    <form class="login-form" @submit.prevent="login">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" placeholder="Username" />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="Password" />
      </div>

      <button type="submit">Login</button>
    </form>
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import store from '../store/store'
export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage:"",
    };
  },
  methods: {
    login() {
      const url = `/api/user/login?name=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`;
      axios.post(url)
      .then(response=>{
        if(response.data=='invalid'){
          this.errorMessage='未知用户';
        }else{

          store.commit('changeUid', response.data);
          this.errorMessage='登陆成功'+response.data;
          this.$router.push("/test");
        }
      })
    },
  },
};
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 100px);
  /* 减去顶部导航栏高度 */
  background-color: #f5f5f5;
}

.login h1 {
  font-size: 36px;
  margin-bottom: 20px;
}

.login-form {
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
}</style>