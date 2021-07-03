<template>
  <div v-if="errorFlag">
    <el-alert title="Whoops! Something went wrong." type="error">
      <span>Error: {{ error }}</span>
    </el-alert>
  </div>

  <nav class="navbar navbar-light bg-faded">
    <span class="navbar-text"> CREATE AN ACCOUNT </span>
  </nav>

  <el-form
    :model="ruleForm"
    status-icon
    :rules="rules"
    ref="ruleForm"
    label-width="120px"
    class="demo-ruleForm"
  >
    <el-form-item prop="first_name" label="First name">
      <el-input v-model="ruleForm.first_name"></el-input>
    </el-form-item>

    <el-form-item prop="last_name" label="Last name">
      <el-input v-model="ruleForm.last_name"></el-input>
    </el-form-item>

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

    <el-form-item label="Confirm" prop="checkPass">
      <el-input
        type="password"
        v-model="ruleForm.checkPass"
        autocomplete="off"
      ></el-input>
    </el-form-item>

    <el-form-item label="Profile image" prop="image">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-change="setImage"
      >
        <i class="el-icon-plus"></i>
      </el-upload>

      <el-dialog v-model="ruleForm.dialogVisible">
        <img width="100%" :src="this.ruleForm.dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')"
        >Create</el-button
      >
      <el-button @click="resetForm('ruleForm')">Reset</el-button>
      <el-button type="primary" @click="goToLogin()">Go to Login</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
const imageType = ["image/jpeg", "image/png", "image/gif"];

export default {
  name: "Users.register",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "" || value.length < 8) {
        callback(
          new Error("The password must be at least 8 characters in length.")
        );
      } else {
        if (
          this.ruleForm.checkPass !== "" &&
          this.ruleForm.checkPass.length >= 8
        ) {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password again"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        first_name: "",
        last_name: "",
        email: "",
        pass: "",
        checkPass: "",
        image: "",
        dialogImageUrl: "",
        dialogVisible: false,
      },
      error: "",
      errorFlag: false,
      rules: {
        first_name: [
          {
            required: true,
            message: "Please input your name",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "Length should be 3 to 5",
            trigger: "blur",
          },
        ],
        last_name: [
          {
            required: true,
            message: "Please input your name",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "Length should be 2 to 5",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "Please input email address",
            trigger: "blur",
          },
          {
            type: "email",
            min: 1,
            max: 128,
            message: "Please input correct email address",
            trigger: ["blur", "change"],
          },
        ],
        pass: [
          { required: true, message: "Please input password", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
        ],
        checkPass: [
          {
            required: true,
            message: "Please confirm password",
            trigger: "blur",
          },
          { validator: validatePass2, trigger: "blur" },
        ],
        image: [{ required: false }],
      },

      userImage: "",
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.api
            .register({
              firstName: this.ruleForm.first_name,
              lastName: this.ruleForm.last_name,
              email: this.ruleForm.email,
              password: this.ruleForm.pass,
            })
            .then(
              () => {
                this.api
                  .login({
                    email: this.ruleForm.email,
                    password: this.ruleForm.pass,
                  })
                  .then((res) => {
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("userId", res.data.userId);
                    this.api.putUserImage(
                      res.data.userId,
                      this.userImage,
                      res.data.token
                    );
                    this.$router.push("/events");
                  });
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    goToLogin() {
      this.$router.push("/users/login");
    },
    setImage(file) {
      if (!imageType.includes(file.raw.type)) {
        alert("Invalid image type!");
      } else {
        this.userImage = file.raw;
      }
    },
  },
};
</script>

<style></style>
