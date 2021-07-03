<template>
  <div v-if="errorFlag">
    <el-alert title="Whoops! Something went wrong." type="error">
      <span>Error: {{ error }}</span>
    </el-alert>
  </div>

  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Navbar</a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="nav-link" href="http://localhost:8080/events"
            >Event Home<span class="sr-only">(current)</span></a
          >
        </li>
        <li class="nav-item">
          <a class="nav-link" href="http://localhost:8080/events/create"
            >Create Event</a
          >
        </li>

        <li class="nav-item">
          <a class="nav-link" href="http://localhost:8080/events/mine"
            >View My Event</a
          >
        </li>
      </ul>

      <div style="float: right">
        <div v-if="authentication">
          <img
            :src="image_src"
            class="card-img-top"
            alt="user_image"
            style="width: 35px; height: 35px; margin-right: 10px"
            @error="image_src = require('../assets/logo.png')"
          />
          <el-link
            type="success"
            href="http://localhost:8080/users/profile"
            title="edit"
            style="margin-right: 10px"
          >
            {{ auth_user.firstName }}
            {{ auth_user.lastName }}
          </el-link>
          <el-button
            class="btn btn-primary"
            @click="openModal"
            style="margin-right: 10px"
            title="Login/Logout"
            type="info"
            icon="el-icon-user"
            circle
          ></el-button>
        </div>
        <div v-else>
          <el-button
            class="btn btn-primary"
            @click="openModal"
            style="margin-right: 10px"
            title="Login/Logout"
            type="info"
            icon="el-icon-user"
            circle
          ></el-button>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="staticBackdrop"
      data-backdrop="static"
      data-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Log out</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">Log out of this system now?</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary" @click="userLogout">
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  inject: ["reload"],
  data() {
    return {
      error: "",
      errorFlag: false,
      auth_user: {},
      authentication: false,
      image_src: "",
    };
  },
  mounted() {
    this.checkAuthentication();
  },
  methods: {
    openModal() {
      if (localStorage.getItem("token") === null) {
        this.$router.push("/users/login");
      } else {
        window.$("#staticBackdrop").modal("show");
      }
    },
    checkAuthentication() {
      if (localStorage.getItem("token") === null) {
        this.authentication = false;
      } else {
        this.authentication = true;
        this.getSingleUser();
        this.image_src = this.api.getUserImage(localStorage.getItem("userId"));
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

    userLogout() {
      this.api.logout(localStorage.getItem("token")).then(
        () => {
          localStorage.removeItem("token");
          window.$("#staticBackdrop").modal("hide");
          this.$router.go(0);
        },
        (error) => {
          this.error = error.response.responseText;
          this.errorFlag = true;
        }
      );
    },
  },
  watch: {
    $route() {
      if (localStorage.getItem("token")) {
        this.authentication = true;
        this.getSingleUser();
      } else {
        this.authentication = false;
      }
    },
  },
};
</script>

<style scoped></style>
