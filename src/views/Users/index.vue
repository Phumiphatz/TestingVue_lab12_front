<template>
  <div>
    <b-button variant="success" class="float-right" @click="addNewUser"
      >Add New</b-button
    >

    <b-modal
      id="modal-form-user"
      ref="modal-form-user"
      :title="title"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Name"
          label-for="name"
          :invalid-feedback="invalidFeedbackName"
          :valid-feedback="validFeedbackName"
          :state="stateName"
        >
          <b-form-input id="name" v-model="form.name" required></b-form-input>
        </b-form-group>

        <b-form-group label="Gender:" label-for="gender">
          <b-form-select
            id="gender"
            v-model="form.gender"
            :options="genderOption"
            :invalid-feedback="invalidFeedbackGender"
            :valid-feedback="validFeedbackGender"
            :state="stateGender"
            required
          ></b-form-select>
        </b-form-group>
      </form>
      <b-card class="mt-3" header="Form Data Result">
        <pre class="m-0">{{ form }}</pre>
      </b-card>
    </b-modal>

    <b-table striped hover :items="userList" :fields="fields">
      <template v-slot:cell(operation)="data">
        <b-button @click="editUser(data.item)">Edit</b-button>
        &nbsp;
        <b-button variant="danger" @click="delUser(data.item)">Delete</b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
// import userService from './UserService'
import axios from 'axios'
export default {
  data () {
    return {
      title: 'เพิ่มผู้ใช้ใหม่',
      form: { name: '', gender: null, id: -1 },
      genderOption: [
        {
          value: null,
          text: 'Select One'
        },
        {
          value: 'M',
          text: 'ผู้ชาย'
        },
        {
          value: 'F',
          text: 'ผู้หญิง'
        }
      ],
      userList: [],

      fields: [
        {
          key: 'id',
          label: 'ไอดี'
        },
        'name',
        'gender',
        'operation'
      ]
    }
  },
  methods: {
    editUser (user) {
      console.log(user)
      this.title = 'แก้ไขผู้ใช้'
      this.$bvModal.show('modal-form-user')
      this.form = { ...user }
    },
    delUser (user) {
      this.$bvModal
        .msgBoxConfirm('ท่านต้องการลบ ' + user.name + ' หรือไม่!!!', {
          title: 'กรุณายืนยัน',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value) {
            // userService.deleteUser(this.form)
            axios
              .delete(`http://localhost:3000/users/` + user._id)
              .then(res => {
                this.getUsers()
              })
              .catch(err => {
                console.log(err)
              })
            this.getUsers()
          }
        })
    },
    addNewUser () {
      this.title = 'เพิ่มผู้ใช้'
      this.$bvModal.show('modal-form-user')
    },
    resetModal () {
      this.form = {
        _id: -1,
        name: '',
        gender: null
      }
    },
    handleOk (bvNodalEvt) {
      bvNodalEvt.preventDefault()
      this.handleSubmit()
    },
    handleSubmit () {
      if (this.stateName && this.stateGender) {
        if (this.form._id !== '') {
          axios
            .put('http://localhost:3000/users', this.form)
            .then(res => {
              this.getUsers()
            })
            .catch(err => {
              console.log(err)
            })
          this.getUsers()
        } else {
          delete this.form._id
          axios
            .post('http://localhost:3000/users', this.form)
            .then(res => {
              this.getUsers()
            })
            .catch(err => {
              console.log(err)
            })
          this.getUsers()
        }
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-form-user')
        })
      }
    },
    addUser (user) {
      user._id = this.lastId++
      this.userList.push(user)
    },
    updateUser (user) {
      const index = this.userList.findIndex(item => item._id === user._id)
      this.userList.splice(index, 1, user)
    },
    deleteUser (user) {
      const index = this.userList.findIndex(item => item._id === user._id)
      this.userList.splice(index, 1)
    },
    getUsers () {
      axios
        .get('http://localhost:3000/users')
        .then(res => {
          this.userList = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  computed: {
    stateName () {
      return this.form.name.length >= 2
    },
    invalidFeedbackName () {
      if (this.form.name.length > 2) {
        return ''
      } else if (this.form.name.length > 0) {
        return 'ชื่อต้องมีขนาดอย่างน้อย 2 ตัวอักษร'
      } else {
        return 'ต้องใส่ชื่อ'
      }
    },
    validFeedbackName () {
      return this.stateName === true ? 'สำเร็จ' : ''
    },

    stateGender () {
      return this.form.gender != null
    },
    invalidFeedbackGender () {
      if (this.form.gender != null) {
        return ''
      } else {
        return 'กรุณาเลือกเพศ'
      }
    },
    validFeedbackGender () {
      return this.stateGender === true ? 'สำเร็จ' : ''
    }
  },
  mounted () {
    console.log('VUe component is mounted')
    this.getUsers()
  }
}
</script>

<style></style>
