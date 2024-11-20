<template>
  <div class="messages-demonstrator">
    <v-snackbar v-if="toast"
                v-model="showToast"
                :color="toast.color"
                :timeout="toast.timeout">
      <div class="d-flex flex-column">
        <div class="text-button font-weight-bold mb-4">
          <div class="float-left">{{toast.title}}</div>
          <div class="float-right">
            <v-icon icon="$close"
                    title="Закрыть"
                    @click="showToast = false" />
          </div>
        </div>
        <div>{{toast.message}}</div>
      </div>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        toast: null,
        showToast: false,
        isChanging: false
      };
    },

    mounted() {
      this.setNextToast();
    },

    computed: {
      toasts() {
        return this.$store.state.toasts;
      },
      toastsCount() {
        return this.$store.state.toasts.length;
      }
    },

    watch: {
      toasts(newValue) {
        this.setNextToast(newValue);
      },
      showToast(newValue) {
        if (newValue === true) {
          return;
        }

        this.setNextToast();
      }
    },

    methods: {
      setNextToast(toasts) {
        if (this.isChanging) {
          return;
        }
        if (this.showToast === true) {
          return;
        }
        if (toasts === undefined) {
          toasts = this.toasts;
        }
        if (!toasts || toasts.length === 0) {
          return;
        }

        this.isChanging = true;

        this.toast = toasts[0];
        this.showToast = true;

        const newToasts = toasts.filter(t => t !== this.toast);

        this.$store.commit("setToasts", newToasts);

        this.isChanging = false;
      }
    }
  };
</script>

<style lang="scss">
  .messages-demonstrator {
  }
</style>
