<template>
    <div class="login">
        <v-layout class="login-layout" column align-center>
            <v-img class="ap-logo" src="@/assets/ap_logo.jpg" alt="" width="100" />
            <v-flex xs12>
                <v-btn @click="loginWithAPCred" class="apLoginBtn white--text" color="#E30514">login with AP account</v-btn>
            </v-flex>
            <v-flex>
                <v-btn class="externLoginBtn white--text" color="#444447">LOGIN EXTERN</v-btn>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>

export default {
    methods: {
        loginWithAPCred() {
            this.$msal.signIn();
        }
    },
}
</script>

<style>
    .login {
        height: 100vh;
        padding-top: 350px;
    }

    .login-layout {
        background-color: rgba(255, 255, 255, 0.8);
        width: 500px;
        margin: 0 auto;
        padding: 50px;
        border: solid 1px rgba(0, 0, 0, 0.2);
    }

    .ap-logo {
        margin-bottom: 50px
    }
    .apLoginBtn {
        margin-bottom: 20px;
    }

</style>