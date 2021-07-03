<template>
  <div v-if="errorFlag">
    <el-alert title="Whoops! Something went wrong." type="error">
      <span>Error: {{ error }}</span>
    </el-alert>
  </div>

  <nav class="navbar navbar-light bg-faded">
    <span class="navbar-text"> Edit Event {{ $route.params.id }} </span>
  </nav>

  <el-form
    id="edit"
    ref="ruleForm"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
  >
    <el-form-item prop="image">
      <img
        :src="event_detail.image"
        class="card-img-top"
        alt="event_image"
        style="width: 150px; height: 150px"
        @error="event_detail.image = require('../assets/logo.png')"
      />
    </el-form-item>

    <!--  image---------------------------------------------------->
    <el-form-item prop="image">
      Update event image
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

    <el-form-item prop="title">
      <h5>Event Title: {{ event_detail.title }}</h5>
      <p>Update event title</p>
      <el-input v-model="ruleForm.title"></el-input>
    </el-form-item>

    <!---- check box------------------------------------------->
    <el-form-item prop="checkedOptions">
      <h5>Event Category: {{ event_detail.cat_str }}</h5>
      <p>Update event category</p>
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
    <el-form-item prop="date">
      <h5>Date: {{ event_detail.date }}</h5>
      <p>Update event date</p>
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

    <el-form-item prop="event_type">
      <h5>Is-online: {{ event_detail.isOnline }}</h5>

      <el-button @click="openEventTypeRadio" type="text" size="small"
        >Update event type</el-button
      >

      <div v-if="this.counter_type">
        <el-radio-group
          v-model="ruleForm.event_type"
          @change="handleTypeOptionChange"
        >
          <el-radio label="1">Online</el-radio>
          <el-radio label="0">In-person</el-radio>
        </el-radio-group>
      </div>
    </el-form-item>

    <!------------------------------------------------------------>
    <el-form-item prop="capacity">
      <h5>Capacity: {{ event_detail.capacity }}</h5>
      <p>Update event capacity</p>
      <el-input v-model="ruleForm.capacity"></el-input>
    </el-form-item>

    <el-form-item prop="url">
      <h5>Event URL: {{ event_detail.url }}</h5>
      <p>Update event url</p>
      <el-input
        placeholder="Online events must have URL, but not venue"
        v-model="ruleForm.url"
      ></el-input>
    </el-form-item>

    <el-form-item prop="venue">
      <h5>Venue: {{ event_detail.venue }}</h5>
      <p>Update event venue</p>
      <el-input
        placeholder="In-person events must have a venue"
        v-model="ruleForm.venue"
      ></el-input>
    </el-form-item>

    <!--Radio---------------------------------------------------->

    <el-form-item prop="attendance_control">
      <h5>Attendance control: {{ event_detail.control }}</h5>

      <el-button @click="openControlTypeRadio" type="text" size="small"
        >Change attendance control</el-button
      >

      <div v-if="counter_control">
        <el-radio-group
          v-model="ruleForm.attendance_control"
          @change="handleAttendanceControlOptionChange"
        >
          <el-radio label="1">Yes</el-radio>
          <el-radio label="0">No</el-radio>
        </el-radio-group>
      </div>
    </el-form-item>

    <el-form-item prop="fee">
      <h5>Fee: {{ event_detail.fee }}</h5>
      <p>Update event fee</p>
      <el-input v-model="ruleForm.fee"></el-input>
    </el-form-item>

    <el-form-item prop="desc">
      <h5>Description: {{ event_detail.description }}</h5>
      <p>Update event description</p>
      <el-input type="textarea" v-model="ruleForm.desc"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">Edit</el-button>
      <el-button @click="resetForm('ruleForm')">Reset</el-button>
      <el-button type="primary" @click="handleExit">Exit</el-button>
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
  name: "Event.edit",
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
        fee: "",
        event_type: "0",
        attendance_control: "0",
        dialogImageUrl: "",
        dialogVisible: false,
        options: categoryOptions,
        checkedOptions: [],
        isIndeterminate: true,
        checkAll: false,
      },
      event_categories: [],
      event_detail: {},
      inputData: {},
      cat_ids: [],
      eventImage: "",
      auth_user: {},
      authentication: false,
      counter_type: 0,
      counter_control: 0,
      rules: {
        title: [
          {
            required: false,
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
        checkedOptions: [{ required: false }],
        desc: [
          {
            required: false,
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
        date: [{ required: false }],
      },
    };
  },
  mounted() {
    this.checkAuthentication();
  },
  methods: {
    onSubmit: async function () {
      const event_date = new Date(this.event_detail.date);
      const today = new Date();

      if (today < event_date) {
        this.getInputData();
        if (
          Object.keys(this.inputData).length !== 0 ||
          this.eventImage !== ""
        ) {
          if (Object.keys(this.inputData).length !== 0) {
            await this.api
              .changeEventDetail(
                this.$route.params.id,
                this.inputData,
                localStorage.getItem("token")
              )
              .then(
                () => {
                  alert("Event information updated");
                },
                (error) => {
                  this.resetForm("ruleForm");
                  this.error = error.response.responseText;
                  this.errorFlag = true;
                }
              );
          }

          if (this.eventImage !== "") {
            await this.api
              .putEventImage(
                this.$route.params.id,
                this.eventImage,
                localStorage.getItem("token")
              )
              .then(
                () => {
                  alert("Event image updated");
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
          this.resetForm("ruleForm");
        }
      } else {
        alert("Cannot edit an event that has already occurred");
      }
    },
    handleExit() {
      this.$router.push("/events/mine");
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.counter_type = 0;
      this.counter_control = 0;
    },
    openEventTypeRadio() {
      this.counter_type++;
    },
    openControlTypeRadio() {
      this.counter_control++;
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
        this.viewEvent(this.$route.params.id);
      }
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
    viewEvent(id) {
      this.api.getEventById(id).then(
        (res) => {
          this.event_detail = res.data;
          this.image_src = this.api.getEventImage(this.event_detail.id);
          this.event_detail.image = this.image_src;
          this.findCategoryString(
            this.event_detail.categories,
            this.event_categories
          );
          this.event_detail.cat_str = this.cat_str;
          if (this.event_detail.fee === "0.00") {
            this.event_detail.fee = "free";
          }
          if (this.event_detail.requiresAttendanceControl) {
            this.event_detail.control = "Yes";
          } else {
            this.event_detail.control = "No";
          }
          if (
            this.event_detail.capacity !== null &&
            this.event_detail.attendeeCount !== null
          ) {
            this.event_detail.seats =
              parseInt(this.event_detail.capacity) -
              parseInt(this.event_detail.attendeeCount);
          } else {
            if (
              this.event_detail.capacity !== null &&
              this.event_detail.attendeeCount === null
            ) {
              this.event_detail.seats = parseInt(this.event_detail.capacity);
            } else {
              this.event_detail.seats = "Yes";
            }
          }
          if (this.event_detail.attendeeCount === null) {
            this.event_detail.attendeeCount = 0;
          }
          // convert the date ------------------------------------------
          this.event_detail.date = new Date(this.event_detail.date)
            .toString()
            .slice(0, 25);
          //---------end-----------------------------------------------------------
          this.event_detail.isOnline = !!parseInt(this.event_detail.isOnline);
        },
        (error) => {
          this.error = error.response.responseText;
          this.errorFlag = true;
        }
      );
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
        this.counter_type &&
        parseInt(this.ruleForm.event_type) === 1 &&
        (this.ruleForm.url === "" || this.ruleForm.venue !== "")
      ) {
        check = false;
        alert("Online events must have URL, but not venue");
      }
      if (
        this.counter_type &&
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
        if (this.ruleForm.title.length) {
          this.inputData.title = this.ruleForm.title;
        } else {
          this.inputData.title = this.event_detail.title;
        }
        if (this.ruleForm.desc.length) {
          this.inputData.description = this.ruleForm.desc;
        }
        if (this.ruleForm.checkedOptions.length) {
          this.getCategoryList();
          this.inputData.categoryIds = this.cat_ids;
        }

        if (this.ruleForm.date !== "") {
          this.ruleForm.date = this.formatDate(this.ruleForm.date);
          this.inputData.date = this.ruleForm.date;
        }

        if (this.counter_type) {
          this.inputData.isOnline = !!parseInt(this.ruleForm.event_type);
          this.counter_type = 0;
        }

        if (this.ruleForm.url.length) {
          this.inputData.url = this.ruleForm.url;
        }
        if (this.ruleForm.venue.length) {
          this.inputData.venue = this.ruleForm.venue;
        }
        if (this.ruleForm.capacity !== null) {
          this.inputData.capacity = parseInt(this.ruleForm.capacity);
        }

        if (this.counter_control) {
          this.inputData.requiresAttendanceControl = !!parseInt(
            this.ruleForm.attendance_control
          );
          this.counter_control = 0;
        }

        if (this.ruleForm.fee.length) {
          this.inputData.fee = parseFloat(this.ruleForm.fee);
        }
      }
    },
    findCategoryString(arr1, arr2) {
      this.cat_str = "";
      for (const item of arr1) {
        for (const cat of arr2) {
          if (item.toString() === cat.id.toString()) {
            this.cat_str = this.cat_str + cat.name.toString() + ", ";
            break;
          }
        }
      }
      this.cat_str = this.cat_str.substring(0, this.cat_str.length - 2);
    },
  },
};
</script>

<style></style>
