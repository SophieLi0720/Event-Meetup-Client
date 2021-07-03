<template>
  <div v-if="errorFlag">
    <el-alert title="Whoops! Something went wrong." type="error">
      <span>Error: {{ error }}</span>
    </el-alert>
  </div>

  <nav class="navbar navbar-light bg-faded">
    <span class="navbar-text"> USER LOGIN </span>
  </nav>

  <el-form
    :model="ruleForm"
    status-icon
    :rules="rules"
    ref="ruleForm"
    label-width="120px"
    class="demo-ruleForm"
  >
    <el-form-item prop="email" label="Email">
      <el-input v-model="ruleForm.email"></el-input>
    </el-form-item>

    <el-form-item label="Password" prop="pass">
      <el-input
        type="password"
        v-model="ruleForm.pass"
        autocomplete="off"
      ></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')"
        >Login</el-button
      >
      <el-button @click="resetForm('ruleForm')">Reset</el-button>
      <el-button type="primary" @click="goToCreate()"
        >Create an account</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "Users.login",
  inject: ["reload"],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    return {
      ruleForm: {
        email: "",
        pass: "",
      },
      error: "",
      errorFlag: false,
      rules: {
        email: [
          {
            required: true,
            message: "Please input email address",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Please input correct email address",
            trigger: ["blur", "change"],
          },
        ],
        pass: [
          { required: true, message: "Please input password", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    goToCreate() {
      this.$router.push("/users/register");
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.api
            .login({
              email: this.ruleForm.email,
              password: this.ruleForm.pass,
            })
            .then(
              (res) => {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userId", res.data.userId);
                this.$router.push("/events");
                this.reload();
              },
              (error) => {
                this.error = error.response.responseText;
                this.errorFlag = true;
              }
            );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped></style>
