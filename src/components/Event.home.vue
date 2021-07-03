<template>
  <div v-if="errorFlag">
    <el-alert title="Whoops! Something went wrong." type="error">
      <span>Error: {{ error }}</span>
    </el-alert>
  </div>

  <el-row>
    <el-input
      type="text"
      placeholder="Please input keywords"
      v-model="search"
      style="width: 600px; margin-right: 10px"
    ></el-input>
    <el-button
      @click="searchEvent"
      style="margin-right: 10px"
      icon="el-icon-search"
      circle
    ></el-button>
    <el-button @click="getFilterFlag" type="warning" plain
      >Advanced Search</el-button
    >
  </el-row>
  <br />

  <!-- Filter -->
  <div v-if="filter_enable">
    <el-checkbox
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
      >Check all
    </el-checkbox>
    <div style="margin: 15px 0"></div>

    <el-checkbox-group
      v-model="checkedOptions"
      @change="handleCheckedOptionsChange"
    >
      <el-checkbox v-for="option in options" :label="option" :key="option">
        {{ option }}
      </el-checkbox>
    </el-checkbox-group>

    <div style="margin: 15px 0"></div>
    <p>Sort by</p>
    <div style="margin: 15px 0"></div>

    <el-radio-group v-model="sort_by" @change="handleSortOptionChange">
      <el-radio label="DATE_ASC">Date asc</el-radio>
      <el-radio label="DATE_DESC">Date desc</el-radio>
      <el-radio label="ATTENDEES_ASC">Attendees asc</el-radio>
      <el-radio label="ATTENDEES_DESC">Attendees desc</el-radio>
    </el-radio-group>
    <p>
      <el-button
        @click="getEventWithParams"
        type="success"
        style="alignment: center"
        plain
        >Submit</el-button
      >
    </p>
  </div>

  <!-- Card -->
  <div class="card-group">
    <div v-for="event in filteredEvents" v-bind:key="event.eventId">
      <div class="card" style="width: 18rem; height: 100%">
        <img
          :src="event.image_src"
          class="card-img-top"
          alt="event_image"
          @error="event.image_src = require('../assets/logo.png')"
          style="width: 18rem; height: 18rem"
        />
        <div class="card-body">
          <h5 class="card-title">{{ event.title }}</h5>
          <p class="card-text">Date: {{ event.date_str }}</p>
          <p class="card-text">Category: {{ event.cat_str }}</p>
          <p class="card-text">
            Host: {{ event.organizerFirstName }} {{ event.organizerLastName }}
          </p>
          <p class="card-text">
            Number of attendees: {{ event.numAcceptedAttendees }}
          </p>
        </div>
        <div class="card-footer">
          <button
            type="button"
            class="btn btn-primary"
            data-toggle="modal"
            data-target="#eventDetailModal"
            v-on:click="viewEvent(event.eventId)"
          >
            View
          </button>
        </div>
      </div>

      <!-- Modal -->
      <div
        class="modal fade"
        id="eventDetailModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="eventDetailModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="eventDetailModalLabel">
                {{ event_detail.title }}
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>
                <img
                  :src="event_detail.image"
                  class="card-img-top"
                  alt="event_image"
                  @error="event_detail.image = require('../assets/logo.png')"
                />
              </p>
              <p>Date: {{ event_detail.date }}</p>

              <p>
                <img
                  :src="event_detail.organizer_image"
                  class="card-img-top"
                  alt="event_image"
                  @error="
                    event_detail.organizer_image = require('../assets/logo.png')
                  "
                  style="width: 100px; height: 100px"
                />
              </p>

              <p>
                Organizer: {{ event_detail.organizerFirstName }}
                {{ event_detail.organizerLastName }}
              </p>
              <p>Categories: {{ event_detail.cat_str }}</p>
              <p>Description: {{ event_detail.description }}</p>
              <p>Capacity: {{ event_detail.capacity }}</p>
              <p>Number of attendees: {{ event_detail.attendeeCount }}</p>
              <p>Event URL: {{ event_detail.url }}</p>
              <p>Venue: {{ event_detail.venue }}</p>
              <p>Fee: {{ event_detail.fee }}</p>
              <p>Require attendance control: {{ event_detail.control }}</p>
              <p>Seats available: {{ event_detail.seats }}</p>
              <p>Similar events:</p>
              <div v-for="item in event_detail.similar" v-bind:key="item">
                <p>{{ item }}</p>
              </div>
            </div>
            <el-row style="margin-left: 10px">
              <el-button
                type="success"
                title="join"
                @click="joinEvent"
                icon="el-icon-star-off"
                circle
              ></el-button>
              <el-button
                type="danger"
                title="leave"
                @click="leaveEvent"
                icon="el-icon-delete"
                circle
              ></el-button>
            </el-row>

            <el-table :data="attendees" style="width: 100%" height="250">
              <el-table-column label="Role" width="180">
                <template #default="scope">
                  <span style="margin-left: 10px">{{ scope.row.role }}</span>
                </template>
              </el-table-column>

              <el-table-column label="First name" width="180">
                <template #default="scope">
                  <span style="margin-left: 10px">{{
                    scope.row.firstName
                  }}</span>
                </template>
              </el-table-column>

              <el-table-column label="Last name" width="180">
                <template #default="scope">
                  <span style="margin-left: 10px">{{
                    scope.row.lastName
                  }}</span>
                </template>
              </el-table-column>

              <el-table-column label="Profile" width="180">
                <template #default="scope">
                  <el-image
                    :src="scope.row.image"
                    alt="user profile"
                    style="width: 50px; height: 50px"
                  >
                    <template #error>
                      <div class="image-slot">
                        <el-image
                          :src="require('../assets/logo.png')"
                          style="width: 50px; height: 50px"
                        ></el-image>
                      </div>
                    </template>
                  </el-image>
                </template>
              </el-table-column>

              <el-table-column label="Status" width="180">
                <template #default="scope">
                  <span style="margin-left: 10px">{{ scope.row.status }}</span>
                </template>
              </el-table-column>
            </el-table>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="block">
    <el-pagination
      layout="prev, pager, next"
      :total="totalEvent"
      :page-size="pageSize"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
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

// data and functions ---------------------------------------------------------------------------------------------------
export default {
  name: "Event.home",
  data() {
    return {
      error: "",
      errorFlag: false,
      events: [],
      image_src: "",
      event_categories: [] /*eventCategories*/,
      cat_str: "",
      event_detail: {},
      attendees: [],
      authentication: false,
      auth_user: {},
      pageSize: 10,
      currentPage: 1,
      totalEvent: 0,
      search: "",
      filteredEvents: [],
      isIndeterminate: true,
      checkAll: false,
      options: categoryOptions,
      checkedOptions: [],
      sort_by: "DATE_ASC",
      filter_enable: false,
      filter_params: "?",
      similarEvents: [],
    };
  },
  mounted() {
    this.checkAuthentication();
  },
  methods: {
    getEventWithParams() {
      this.getFilterParams();
      this.api.eventFilter(this.filter_params).then(
        (response) => {
          this.events = response.data;
          this.filter_params = "?";
          this.processEventList();
        },
        (error) => {
          this.error = error.response.responseText;
          this.errorFlag = true;
        }
      );
    },

    getFilterFlag() {
      this.filter_enable = !this.filter_enable;
    },

    handleCheckAllChange(val) {
      this.checkedOptions = val ? categoryOptions : [];
      this.isIndeterminate = false;
    },

    handleCheckedOptionsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.options.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.options.length;
      this.checkedOptions = value;
    },
    handleSortOptionChange(value) {
      this.sort_by = value;
    },
    searchEvent() {
      this.api.searchEventWithKeyword(this.search).then(
        (response) => {
          this.events = response.data;
          this.processEventList();
        },
        (error) => {
          this.error = error.response.responseText;
          this.errorFlag = true;
        }
      );
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.pagedEventData();
    },
    pagedEventData() {
      this.filteredEvents = this.events.slice(
        this.pageSize * this.currentPage - this.pageSize,
        this.pageSize * this.currentPage
      );
    },
    getEvents() {
      this.api.listEvents().then(
        (response) => {
          this.events = response.data;
          if (!localStorage.getItem("token")) {
            this.events = this.events.filter(
              (item) => new Date(item.date).getTime() > new Date().getTime()
            );
          }
          this.processEventList();
        },
        (error) => {
          this.error = error.response.responseText;
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

    // function process a single event detail ---------------------------------------------------------------------------------
    viewEvent(id) {
      this.api.getEventById(id).then(
        (res) => {
          this.event_detail = res.data;
          this.event_detail.organizer_image = this.api.getUserImage(
            this.event_detail.organizerId
          );
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
          this.viewAttendees(this.event_detail.id);
          this.findSimilarEvents();
        },
        (error) => {
          this.error = error.response.responseText;
          this.errorFlag = true;
        }
      );
    },
    // ---------------------------------------------------------------------------------------------------------------
    viewAttendees(id) {
      this.api.getEventAttendees(id, localStorage.getItem("token")).then(
        (res) => {
          this.attendees = res.data;

          for (const item of this.attendees) {
            if (item.attendeeId === this.event_detail.organizerId) {
              item.role = "organizer";
            } else {
              item.role = "attendee";
            }
            this.image_src = this.api.getUserImage(item.attendeeId);
            item.image = this.image_src;
          }
        },
        (error) => {
          this.error = error.response.responseText;
          this.errorFlag = true;
        }
      );
    },

    checkAuthentication() {
      if (localStorage.getItem("token") === null) {
        this.authentication = false;
        this.getCategories();
        this.getEvents();
      } else {
        this.authentication = true;
        this.getSingleUser();
        this.getCategories();
        this.getEvents();
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
            this.error = err.response.responseText;
            this.errorFlag = true;
          }
        );
    },
    joinEvent() {
      if (localStorage.getItem("token")) {
        if (
          this.event_detail.capacity === null ||
          this.event_detail.seats !== 0
        ) {
          const event_date = new Date(this.event_detail.date);
          const today = new Date();
          if (today < event_date) {
            let hasJoined = false;
            for (const item of this.attendees) {
              if (
                item.attendeeId.toString() ===
                localStorage.getItem("userId").toString()
              ) {
                hasJoined = true;
              }
            }
            if (!hasJoined) {
              this.api
                .joinAnEvent(
                  this.event_detail.id,
                  localStorage.getItem("token")
                )
                .then(
                  () => {
                    if (this.event_detail.requiresAttendanceControl) {
                      window.$("#eventDetailModal").modal("hide");
                      alert("Applied");
                      this.$router.go(0);
                    } else {
                      window.$("#eventDetailModal").modal("hide");
                      alert("You are all set");
                      this.$router.go(0);
                    }
                  },
                  (err) => {
                    this.error = err.response.responseText;
                    this.errorFlag = true;
                  }
                );
            } else {
              window.$("#eventDetailModal").modal("hide");
              alert("You are already attending");
            }
          } else {
            window.$("#eventDetailModal").modal("hide");
            alert("This event has already happened");
          }
        } else {
          window.$("#eventDetailModal").modal("hide");
          alert("No seats available");
        }
      } else {
        window.$("#eventDetailModal").modal("hide");
        this.$router.push("/users/login");
      }
    },
    leaveEvent() {
      if (localStorage.getItem("token")) {
        const event_date = new Date(this.event_detail.date);
        const today = new Date();
        if (today < event_date) {
          this.api
            .leaveAnEvent(this.event_detail.id, localStorage.getItem("token"))
            .then(
              () => {
                window.$("#eventDetailModal").modal("hide");
                alert("Canceled");
                this.$router.go(0);
              },
              (err) => {
                this.error = err.response.responseText;
                this.errorFlag = true;
              }
            );
        } else {
          window.$("#eventDetailModal").modal("hide");
          alert("The event has already happened");
        }
      } else {
        window.$("#eventDetailModal").modal("hide");
        this.$router.push("/users/login");
      }
    },

    // helper functions ------------------------------------------------------------------------------------
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
    processEventList() {
      for (const event of this.events) {
        this.image_src = this.api.getEventImage(event.eventId.toString());
        event.image_src = this.image_src;
        this.findCategoryString(event.categories, this.event_categories);
        event.cat_str = this.cat_str;
        event.date_str = new Date(event.date).toString().slice(0, 25);
      }
      this.totalEvent = this.events.length;
      this.pagedEventData();
    },
    getFilterParams() {
      this.filter_params = "?";
      if (this.checkedOptions.length !== 0) {
        for (const option of this.checkedOptions) {
          for (const cat of this.event_categories) {
            if (option.toString() === cat.name.toString()) {
              this.filter_params =
                this.filter_params + `categoryIds=${cat.id.toString()}&`;
              break;
            }
          }
        }
      }

      if (this.search !== "") {
        this.filter_params = this.filter_params + `q=${this.search}&`;
      }
      this.filter_params = this.filter_params + `sortBy=${this.sort_by}`;
    },
    findSimilarEvents() {
      this.similarEvents = [];
      for (const cat_id of this.event_detail.categories) {
        for (const event of this.events) {
          if (
            event.categories.includes(cat_id) &&
            !this.similarEvents.includes(event.title) &&
            this.event_detail.id !== event.eventId
          ) {
            this.similarEvents[this.similarEvents.length] = event.title;
          }
        }
      }
      this.event_detail.similar = this.similarEvents;
    },
  },
};
</script>

<style scoped></style>
