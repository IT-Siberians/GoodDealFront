<template>
  <v-dialog v-model="showThemeDialog"
            :scrim="false"
            class="theme-changer"
            transition="dialog-bottom-transition"
            width="auto">
    <v-card class="text-primary ma-0">
      <v-card-title>
        Выбор цветовой палитры
      </v-card-title>

      <v-card-text class="pa-4 pb-0">
        <v-radio-group v-model="theme.global.name">
          <v-radio v-for="(value, name) in theme.themes" :key="name"
                   :style="{ 'color': value.colors.primary, 'background-color': value.colors.background}"
                   :label="value.name ? value.name : name"
                   :value="name"
                   class="font-weight-bold" />
        </v-radio-group>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data() {
      return {
        oldThemeName: null
      };
    },

    computed: {
      theme() {
        return this.$vuetify.theme;
      },

      showThemeDialog: {
        get() {
          return this.$store.state.showThemeDialog;
        },
        set(newValue) {
          this.$store.commit("setShowThemeDialog", newValue);
        }
      }
    },

    watch: {
      showThemeDialog(newValue) {
        if (newValue === true) {
          this.oldThemeName = this.theme.global.name;
          return;
        }

        if (newValue === false && this.oldThemeName !== this.theme.global.name) {
          const newSettings = Object.assign({}, this.$store.state.userSettings);

          newSettings.colorThemeName = this.theme.global.name;
        }
      }
    }
  };
</script>

<style lang="scss">
  .theme-changer div.v-card {
    border-color: rgb(var(--v-theme-primary)) !important;
    border-width: 4px !important;
  }
</style>
