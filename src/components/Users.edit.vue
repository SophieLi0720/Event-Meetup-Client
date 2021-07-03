<template>
  <div v-if="errorFlag">
    <el-alert title="Whoops! Something went wrong." type="error">
      <span>Error: {{ error }}</span>
    </el-alert>
  </div>

  <nav class="navbar navbar-light bg-faded">
    <span class="navbar-text"> My Profile </span>
  </nav>

  <el-form
    :model="ruleForm"
    status-icon
    :rules="rules"
    ref="ruleForm"
    label-width="120px"
    class="demo-ruleForm"
  >
    <el-form-item prop="image">
      <img
        :src="this.ruleForm.image_src"
        class="card-img-top"
        alt="user_image"
        style="width: 150px; height: 150px"
        @error="this.ruleForm.image_src = require('../assets/logo.png')"
      />
    </el-form-item>

    <el-button @click="handleDeleteImage" type="text" size="small"
      >Delete Profile</el-button
    >

    <el-form-item prop="userImage">
      Upload Your New Profile
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
        <img width="100%" :src="ruleForm.dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>

    <el-form-item prop="first_name">
      <h5>First Name : {{ auth_user.firstName }}</h5>
      <el-input
        placeholder="Update your first name"
        v-model="ruleForm.first_name"
      ></el-input>
    </el-form-item>

    <el-form-item prop="last_name">
      <h5>Last Name : {{ auth_user.lastName }}</h5>
      <el-input
        placeholder="Update your last name"
        v-model="ruleForm.last_name"
      ></el-input>
    </el-form-item>

    <el-form-item prop="email">
      <h5>Email : {{ auth_user.email }}</h5>
      <el-input
        placeholder="Update your first email"
        v-model="ruleForm.email"
      ></el-input>
    </el-form-item>

    <el-form-item prop="pass">
      Change Your Password:
      <el-input
        type="password"
        v-model="ruleForm.pass"
        autocomplete="off"
      ></el-input>
    </el-form-item>

    <el-form-item prop="checkPass">
      Please Confirm Your New Password:
      <el-input
        type="password"
        v-model="ruleForm.checkPass"
        autocomplete="off"
      ></el-input>
    </el-form-item>

    <el-form-item prop="currentPass">
      Please Provide Your Current Password:
      <el-input
        type="password"
        v-model="ruleForm.currentPass"
        autocomplete="off"
      ></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm()">Edit</el-button>
      <el-button @click="resetForm('ruleForm')">Reset</el-button>
      <el-button type="primary" @click="goToEvents()">Exit</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
const imageType = ["image/jpeg", "image/png", "image/gif"];

export default {
  name: "Users.register",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value !== "" && value.length < 8) {
        callback(
          new Error("The password must be at least 8 characters in length.")
        );
      } else if (value !== "" && value.length >= 8) {
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
      if (value !== this.ruleForm.pass) {
        callback(new Error("Two inputs don't match!"));
        this.ruleForm.pass = "";
        this.ruleForm.is_match = false;
      } else {
        this.ruleForm.is_match = true;
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
        currentPass: "",
        image: "",
        dialogImageUrl: "",
        dialogVisible: false,
        authentication: false,
        image_src: "",
        data: {},
        is_match: true,
      },
      auth_user: {},
      userImage: "",
      error: "",
      errorFlag: false,
      rules: {
        first_name: [
          {
            required: false,
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
            required: false,
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
            required: false,
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
          {
            required: false,
            message: "Please input password",
            trigger: "blur",
          },
          { validator: validatePass, trigger: "blur" },
        ],
        checkPass: [
          {
            required: false,
            message: "Please confirm password",
            trigger: "blur",
          },
          { validator: validatePass2, trigger: "blur" },
        ],
        image: [{ required: false }],
      },
    };
  },
  mounted() {
    this.checkAuthentication();
  },
  methods: {
    getInputData() {
      if (this.ruleForm.is_match) {
        if (this.ruleForm.first_name) {
          this.ruleForm.data.firstName = this.ruleForm.first_name;
        }
        if (this.ruleForm.last_name) {
          this.ruleForm.data.lastName = this.ruleForm.last_name;
        }
        if (this.ruleForm.email) {
          this.ruleForm.data.email = this.ruleForm.email;
        }
        if (this.ruleForm.pass && this.ruleForm.currentPass) {
          this.ruleForm.data.password = this.ruleForm.pass;
          this.ruleForm.data.currentPassword = this.ruleForm.currentPass;
        }
      }
    },
    handleDeleteImage() {
      this.api
        .deleteUserImage(
          localStorage.getItem("userId"),
          localStorage.getItem("token")
        )
        .then(
          () => {
            alert("Profile Deleted");
            this.$router.go(0);
          },
          (err) => {
            this.error = err.response.responseText;
            this.errorFlag = true;
          }
        );
    },
    submitForm: async function () {
      this.getInputData();
      if (
        Object.keys(this.ruleForm.data).length !== 0 ||
        this.userImage !== ""
      ) {
        if (Object.keys(this.ruleForm.data).length !== 0) {
          await this.api
            .changeUserDetail(
              localStorage.getItem("userId"),
              this.ruleForm.data,
              localStorage.getItem("token")
            )
            .then(
              () => {
                alert("User information updated");
              },
              (error) => {
                this.resetForm("ruleForm");
                this.error = error.response.responseText;
                this.errorFlag = true;
              }
            );
        }

        if (this.userImage !== "") {
          await this.api
            .putUserImage(
              localStorage.getItem("userId"),
              this.userImage,
              localStorage.getItem("token")
            )
            .then(
              () => {
                alert("User profile image updated");
              },
              (error) => {
                this.error = error.response.responseText;
                this.errorFlag = true;
              }
            );
        }
        this.$router.go(0);
      } else {
        alert("Must provide some details to update");
      }
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
    goToEvents() {
      this.$router.push("/events");
    },
    checkAuthentication() {
      if (localStorage.getItem("token") === null) {
        this.ruleForm.authentication = false;
        alert("Please go to login");
        this.$router.push("/users/login");
      } else {
        this.ruleForm.authentication = true;
        this.getSingleUser();
        this.ruleForm.image_src = this.api.getUserImage(
          localStorage.getItem("userId")
        );
      }
    },
    getSingleUser() {
      this.api
        .listSingleUser(
          localStorage.getItem("userId"),
          localStorage.getItem("token")
        )
        .then(
          (res) => {
            this.auth_user = res.data;
          },
          (err) => {
            this.ruleForm.error = err;
            this.ruleForm.errorFlag = true;
          }
        );
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
