<template>
  <div v-if="errorFlag">
    <el-alert title="Whoops! Something went wrong." type="error">
      <span>Error: {{ error }}</span>
    </el-alert>
  </div>

  <nav class="navbar navbar-light bg-faded">
    <span class="navbar-text"> Events Involved </span>
  </nav>

  <el-table :data="involved_list" style="width: 100%">
    <el-table-column label="Hero Image" width="150">
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

    <el-table-column label="Title" width="250">
      <template #default="scope">
        <span style="margin-left: 10px">{{ scope.row.title }}</span>
      </template>
    </el-table-column>

    <el-table-column label="Category" width="250">
      <template #default="scope">
        <span style="margin-left: 10px">{{ scope.row.cat_str }}</span>
      </template>
    </el-table-column>

    <el-table-column label="Host" width="250">
      <template #default="scope">
        <span style="margin-left: 10px">{{ scope.row.host }}</span>
      </template>
    </el-table-column>

    <el-table-column label="Host Profile" width="150">
      <template #default="scope">
        <el-image
          :src="scope.row.organizer_image"
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

    <el-table-column label="Attendees" width="150">
      <template #default="scope">
        <span style="margin-left: 10px">{{ scope.row.attendeeCount }}</span>
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="Operations" width="200">
      <template #default="scope">
        <!--  @click="handleClick"  -->
        <el-button
          @click="handleClick(scope.row)"
          data-toggle="modal"
          data-target="#eventDetailModal"
          type="text"
          size="small"
          >Detail
        </el-button>
        <el-button @click="handleLeave(scope.row)" type="text" size="small"
          >Leave</el-button
        >
      </template>
    </el-table-column>
  </el-table>

  <p></p>
  <nav class="navbar navbar-light bg-faded">
    <span class="navbar-text"> Events I created </span>
  </nav>

  <el-table :data="created_list" style="width: 100%">
    <el-table-column label="Hero Image" width="150">
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

    <el-table-column label="Title" width="250">
      <template #default="scope">
        <span style="margin-left: 10px">{{ scope.row.title }}</span>
      </template>
    </el-table-column>

    <el-table-column label="Category" width="250">
      <template #default="scope">
        <span style="margin-left: 10px">{{ scope.row.cat_str }}</span>
      </template>
    </el-table-column>

    <el-table-column label="Host" width="250">
      <template #default="scope">
        <span style="margin-left: 10px">{{ scope.row.host }}</span>
      </template>
    </el-table-column>

    <el-table-column label="Host Profile" width="150">
      <template #default="scope">
        <el-image
          :src="scope.row.organizer_image"
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

    <el-table-column label="Attendees" width="150">
      <template #default="scope">
        <span style="margin-left: 10px">{{ scope.row.attendeeCount }}</span>
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="Operations" width="200">
      <template #default="scope">
        <div v-if="scope.row.requiresAttendanceControl">
          <el-button
            @click="handleAttendanceControl(scope.row)"
            data-toggle="modal"
            data-target="#attendanceControlModal"
            type="text"
            size="small"
            >Control Attendance
          </el-button>
        </div>
        <el-button
          @click="handleClick(scope.row)"
          data-toggle="modal"
          data-target="#eventDetailModal"
          type="text"
          size="small"
          >Detail
        </el-button>
        <el-button @click="handEdit(scope.row)" type="text" size="small"
          >Edit</el-button
        >
        <el-button @click="openModal(scope.row)" type="text" size="small"
          >Delete</el-button
        >
      </template>
    </el-table-column>
  </el-table>

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

        <el-table :data="attendees" style="width: 100%" height="250">
          <el-table-column label="Role" width="180">
            <template #default="scope">
              <span style="margin-left: 10px">{{ scope.row.role }}</span>
            </template>
          </el-table-column>

          <el-table-column label="First name" width="180">
            <template #default="scope">
              <span style="margin-left: 10px">{{ scope.row.firstName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Last name" width="180">
            <template #default="scope">
              <span style="margin-left: 10px">{{ scope.row.lastName }}</span>
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
          <button type="button" class="btn btn-secondary" data-dismiss="modal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- modal for delete button-->

  <div
    class="modal fade"
    id="deleteEventModal"
    data-backdrop="static"
    data-keyboard="false"
    tabindex="-1"
    aria-labelledby="deleteEventModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteEventModalLabel">Delete Event</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">Do you want to delete this event now?</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="handleDeleteEvent"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>

  <!--  modal for attendance control-->

  <div
    class="modal fade"
    id="attendanceControlModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="attendanceControlModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="attendanceControlModalLabel">
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

        <el-table :data="attendees" style="width: 100%" height="600">
          <el-table-column label="First name" width="120">
            <template #default="scope">
              <span style="margin-left: 10px">{{ scope.row.firstName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Last name" width="120">
            <template #default="scope">
              <span style="margin-left: 10px">{{ scope.row.lastName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Profile" width="120">
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

          <el-table-column label="Status" width="120">
            <template #default="scope">
              <span style="margin-left: 10px">{{ scope.row.status }}</span>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="Operations" width="150">
            <template #default="scope">
              <el-button
                @click="handleAccept(event_detail.id, scope.row)"
                type="text"
                size="small"
                >Accept</el-button
              >
              <el-button
                @click="handleReject(event_detail.id, scope.row)"
                type="text"
                size="small"
                >Reject</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <div class="modal-footer">
          <button
            @click="refreshPage"
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
</template>

<script>
export default {
  name: "Event.mine",
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
      similarEvents: [],
      detail_list: [],
      involved_list: [],
      created_list: [],
    };
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage: async function () {
      await this.checkAuthentication();
      await this.getCategories();
      await this.getEvents();
    },
    handEdit(event) {
      this.event_detail = event;
      this.$router.push({
        name: `edit-event`,
        params: { id: this.event_detail.id },
      });
    },
    handleAccept(event_id, user) {
      const event_date = new Date(this.event_detail.date);
      const today = new Date();
      if (today < event_date) {
        if (user.status !== "accepted") {
          this.api
            .controlAttendee(
              event_id,
              user.attendeeId,
              { status: "accepted" },
              localStorage.getItem("token")
            )
            .then(
              () => {
                alert(`Accepted`);
                this.viewAttendees(this.event_detail.id);
              },
              (err) => {
                this.error = err.response.responseText;
                this.errorFlag = true;
              }
            );
        } else {
          alert("This user is already attending");
        }
      } else {
        alert("The event has already happened");
      }
    },
    handleReject(event_id, user) {
      const event_date = new Date(this.event_detail.date);
      const today = new Date();
      if (today < event_date) {
        if (user.status !== "rejected") {
          this.api
            .controlAttendee(
              event_id,
              user.attendeeId,
              { status: "rejected" },
              localStorage.getItem("token")
            )
            .then(
              () => {
                alert(`Rejected`);
                this.viewAttendees(this.event_detail.id);
              },
              (err) => {
                this.error = err.response.responseText;
                this.errorFlag = true;
              }
            );
        } else {
          alert("This user has already been rejected");
        }
      } else {
        alert("The event has already happened");
      }
    },
    refreshPage() {
      window.$("#attendanceControlModal").modal("hide");
      this.$router.go(0);
    },
    handleAttendanceControl(event) {
      this.event_detail = event;
      this.viewAttendees(this.event_detail.id);
    },
    openModal(event) {
      this.event_detail = event;
      window.$("#deleteEventModal").modal("show");
    },
    handleClick(event) {
      this.event_detail = event;
      this.viewAttendees(this.event_detail.id);
      this.findSimilarEvents(this.event_detail);
    },
    handleLeave(event) {
      this.event_detail = event;
      const event_date = new Date(this.event_detail.date);
      const today = new Date();
      if (today < event_date) {
        this.api
          .leaveAnEvent(this.event_detail.id, localStorage.getItem("token"))
          .then(
            () => {
              alert("Canceled");
              this.$router.go(0);
            },
            (err) => {
              this.error = err.response.responseText;
              this.errorFlag = true;
            }
          );
      } else {
        alert("The event has already happened");
      }
    },
    handleDeleteEvent() {
      const event_date = new Date(this.event_detail.date);
      const today = new Date();
      if (today < event_date) {
        this.api
          .deleteEvent(this.event_detail.id, localStorage.getItem("token"))
          .then(
            () => {
              alert("Deleted");
              window.$("#deleteEventModal").modal("hide");
              this.$router.go(0);
            },
            (err) => {
              this.error = err.response.responseText;
              this.errorFlag = true;
            }
          );
      } else {
        alert("Error. The event has already happened");
        window.$("#deleteEventModal").modal("hide");
      }
    },

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

    async getEvents() {
      await this.api.listEvents().then((response) => {
        this.events = response.data;
        //this.processEventList();
      });

      await Promise.all(
        this.events.map(async (event) => {
          await this.api.getEventById(event.eventId).then(async (res) => {
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
            this.event_detail.host =
              this.event_detail.organizerFirstName +
              " " +
              this.event_detail.organizerLastName;

            this.detail_list[this.detail_list.length] = this.event_detail;
          });
        })
      );

      await Promise.all(
        this.detail_list.map(async (event) => {
          await this.api
            .getEventAttendees(event.id, localStorage.getItem("token"))
            .then((res) => {
              this.attendees = res.data;
              event.attendees = this.attendees;
            });
        })
      );

      await this.splitEventList();
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
    checkAuthentication() {
      if (localStorage.getItem("token") === null) {
        this.authentication = false;
        alert("Please go to login");
        this.$router.push("/users/login");
      } else {
        this.authentication = true;
        this.getSingleUser();
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

    splitEventList() {
      for (const event of this.detail_list) {
        if (
          localStorage.getItem("userId").toString() ===
          event.organizerId.toString()
        ) {
          this.created_list[this.created_list.length] = event;
        }

        for (const people of event.attendees) {
          if (
            localStorage.getItem("userId").toString() ===
            people.attendeeId.toString()
          ) {
            this.involved_list[this.involved_list.length] = event;
            break;
          }
        }
      }
    },
    findSimilarEvents(event) {
      this.similarEvents = [];
      for (const cat_id of event.categories) {
        for (const item of this.detail_list) {
          if (
            item.categories.includes(cat_id) &&
            !this.similarEvents.includes(item.title) &&
            event.id !== item.eventId
          ) {
            this.similarEvents[this.similarEvents.length] = item.title;
          }
        }
      }

      event.similar = this.similarEvents;
    },
  },
};
</script>

<style></style>
