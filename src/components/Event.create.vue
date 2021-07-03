<template>
  <div v-if="errorFlag">
    <el-alert title="Whoops! Something went wrong." type="error">
      <span>Error: {{ error }}</span>
    </el-alert>
  </div>

  <nav class="navbar navbar-light bg-faded">
    <span class="navbar-text"> Create An Event </span>
  </nav>

  <el-form
    ref="ruleForm"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
  >
    <!--  image---------------------------------------------------->
    <el-form-item prop="image">
      Upload event image
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
    <!--------------------------------------------------------->

    <el-form-item prop="title" label="Event Title">
      <el-input v-model="ruleForm.title"></el-input>
    </el-form-item>

    <!---- check box------------------------------------------->
    <el-form-item prop="checkedOptions" label="Event Category">
      <el-checkbox
        :indeterminate="ruleForm.isIndeterminate"
        v-model="ruleForm.checkAll"
        @change="handleCheckAllChange"
      >
        Check all
      </el-checkbox>
      <div style="margin: 15px 0"></div>

      <el-checkbox-group
        v-model="ruleForm.checkedOptions"
        @change="handleCheckedOptionsChange"
      >
        <el-checkbox
          v-for="option in ruleForm.options"
          :label="option"
          :key="option"
        >
          {{ option }}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <!------Date------------------------------------------------>
    <el-form-item prop="date" label="Date">
      <div class="block">
        <el-date-picker
          v-model="ruleForm.date"
          type="datetime"
          placeholder="Select date and time"
        >
        </el-date-picker>
      </div>
    </el-form-item>

    <!--Radio---------------------------------------------------->

    <el-form-item prop="event_type" label="Event type">
      <el-radio-group
        v-model="ruleForm.event_type"
        @change="handleTypeOptionChange"
      >
        <el-radio label="1">Online</el-radio>
        <el-radio label="0">In-person</el-radio>
      </el-radio-group>
    </el-form-item>

    <!------------------------------------------------------------>
    <el-form-item prop="capacity" label="Capacity">
      <el-input v-model="ruleForm.capacity"></el-input>
    </el-form-item>

    <el-form-item prop="url" label="Event URL">
      <el-input
        placeholder="Online events must have URL, but not venue"
        v-model="ruleForm.url"
      ></el-input>
    </el-form-item>

    <el-form-item prop="venue" label="Venue">
      <el-input
        placeholder="In-person events must have a venue"
        v-model="ruleForm.venue"
      ></el-input>
    </el-form-item>

    <!--Radio---------------------------------------------------->

    <el-form-item prop="attendance_control" label="Attendance control">
      <el-radio-group
        v-model="ruleForm.attendance_control"
        @change="handleAttendanceControlOptionChange"
      >
        <el-radio label="1">Yes</el-radio>
        <el-radio label="0">No</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="fee" label="Fee">
      <el-input v-model="ruleForm.fee"></el-input>
    </el-form-item>

    <el-form-item prop="desc" label="Description">
      <el-input type="textarea" v-model="ruleForm.desc"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button @click="resetForm('ruleForm')">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// event category----------------------------------------------------------------------------------------
const categoryOptions = [
  "Arts",
  "Beliefs",
  "Book Clubs",
  "Career & Business",
  "Dance",
  "Family",
  "Fashion & Beauty",
  "Film",
  "Food & Drink",
  "Health & Wellness",
  "Hobbies & Crafts",
  "Language & Culture",
  "Learning",
  "LGBTQ",
  "Movements",
  "Music",
  "Outdoors & Adventure",
  "Pets",
  "Photography",
  "Sci-Fi & Games",
  "Social",
  "Sports & Fitness",
  "Tech",
  "Writing",
];

const imageType = ["image/jpeg", "image/png", "image/gif"];

export default {
  name: "Event.create",
  data() {
    return {
      error: "",
      errorFlag: false,
      ruleForm: {
        title: "",
        date: "",
        desc: "",
        capacity: null,
        url: "",
        venue: "",
        fee: "0.00",
        event_type: "0",
        attendance_control: "0",
        dialogImageUrl: "",
        dialogVisible: false,
        options: categoryOptions,
        checkedOptions: ["Arts"],
        isIndeterminate: true,
        checkAll: false,
      },
      event_categories: [] /*eventCategories*/,
      inputData: {},
      cat_ids: [],
      eventImage: "",
      auth_user: {},
      authentication: false,
      rules: {
        title: [
          {
            required: true,
            message: "Please input your event title",
            trigger: "blur",
          },
          {
            min: 1,
            max: 128,
            message: "Length should be 1 to 128",
            trigger: "blur",
          },
        ],
        checkedOptions: [{ required: true }],
        desc: [
          {
            required: true,
            message: "Please input event description",
            trigger: "blur",
          },
          {
            min: 1,
            max: 2048,
            message: "Length should be 1 to 2048",
            trigger: ["blur", "change"],
          },
        ],
        date: [{ required: true }],
      },
    };
  },
  mounted() {
    this.checkAuthentication();
  },
  methods: {
    onSubmit() {
      this.getInputData();
      this.api.creatEvent(this.inputData, localStorage.getItem("token")).then(
        (res) => {
          this.api.putEventImage(
            res.data.eventId,
            this.eventImage,
            localStorage.getItem("token")
          );
          alert("successful");
          this.resetForm("ruleForm");
        },
        (error) => {
          this.error = error.response.responseText;
          this.errorFlag = true;
        }
      );
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    checkAuthentication() {
      if (localStorage.getItem("token") === null) {
        this.authentication = false;
        alert("Please go to login");
        this.$router.push("/users/login");
      } else {
        this.authentication = true;
        this.getCategories();
        this.getSingleUser();
      }
    },
    getSingleUser: async function () {
      await this.api
        .listSingleUser(
          localStorage.getItem("userId"),
          localStorage.getItem("token")
        )
        .then(
          (res) => {
            this.auth_user = res.data;
          },
          (err) => {
            this.error = err.response.responseText;
            this.errorFlag = true;
          }
        );
    },
    getCategories() {
      this.api.findCategories().then(
        (res) => {
          this.event_categories = res.data;
        },
        (err) => {
          this.error = err.response.responseText;
          this.errorFlag = true;
        }
      );
    },
    setImage(file) {
      if (!imageType.includes(file.raw.type)) {
        alert("Invalid image type!");
      } else {
        this.eventImage = file.raw;
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.ruleForm.dialogImageUrl = file.url;
      this.ruleForm.dialogVisible = true;
    },
    handleCheckAllChange(val) {
      this.ruleForm.checkedOptions = val ? categoryOptions : [];
      this.ruleForm.isIndeterminate = false;
    },

    handleCheckedOptionsChange(value) {
      let checkedCount = value.length;
      this.ruleForm.checkAll = checkedCount === this.ruleForm.options.length;
      this.ruleForm.isIndeterminate =
        checkedCount > 0 && checkedCount < this.ruleForm.options.length;
      this.ruleForm.checkedOptions = value;
    },
    handleTypeOptionChange(value) {
      this.ruleForm.type = value;
    },
    handleAttendanceControlOptionChange(value) {
      this.ruleForm.attendance_control = value;
    },

    // helper functions---------------------------------------------------------
    isInt(str) {
      return !isNaN(str) && Number.isInteger(parseFloat(str));
    },
    checkInput() {
      let check = true;
      const event_date = new Date(this.ruleForm.date);
      const today = new Date();
      if (
        this.ruleForm.capacity !== null &&
        (!this.isInt(this.ruleForm.capacity) ||
          parseInt(this.ruleForm.capacity) < 1)
      ) {
        check = false;
        alert("Invalid capacity");
      }
      if (this.ruleForm.fee.length && !this.isInt(this.ruleForm.fee)) {
        check = false;
        alert("Invalid fee");
      }
      if (today > event_date) {
        check = false;
        alert("Invalid date");
      }
      if (
        parseInt(this.ruleForm.event_type) === 1 &&
        (this.ruleForm.url === "" || this.ruleForm.venue !== "")
      ) {
        check = false;
        alert("Online events must have URL, but not venue");
      }
      if (
        parseInt(this.ruleForm.event_type) === 0 &&
        this.ruleForm.venue === ""
      ) {
        check = false;
        alert("In-person events must have a venue");
      }
      return check;
    },
    getCategoryList() {
      this.cat_ids = [];
      for (const item of this.ruleForm.checkedOptions) {
        for (const object of this.event_categories) {
          if (item === object.name) {
            this.cat_ids[this.cat_ids.length] = object.id;
            break;
          }
        }
      }
    },
    formatDate(date) {
      let d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();
      if (month.length < 2) {
        month = "0" + month;
      }
      if (day.length < 2) {
        day = "0" + day;
      }
      let t = date.toString().split(" ")[4];

      return [year, month, day].join("-") + " " + t;
    },
    getInputData() {
      if (this.checkInput()) {
        this.getCategoryList();
        this.inputData.title = this.ruleForm.title;
        this.inputData.description = this.ruleForm.desc;
        this.inputData.categoryIds = this.cat_ids;
        this.ruleForm.date = this.formatDate(this.ruleForm.date);
        this.inputData.date = this.ruleForm.date;
        this.inputData.isOnline = !!parseInt(this.ruleForm.event_type);
        this.inputData.url = this.ruleForm.url;
        this.inputData.venue = this.ruleForm.venue;
        this.inputData.capacity = parseInt(this.ruleForm.capacity);
        this.inputData.requiresAttendanceControl = !!parseInt(
          this.ruleForm.attendance_control
        );
        this.inputData.fee = parseFloat(this.ruleForm.fee);
      } else {
        this.resetForm("ruleForm");
      }
    },
  },
};
</script>

<style scoped></style>
