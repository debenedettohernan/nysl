var app = new Vue({
    el: "#app",
    data: {
        usuario: null,
        pw: null,
        mensaje: null,
        foros: [],
        categorias: null,
        usuarioActual: null,
    },
    methods: {
        crearMensaje: function() {
            firebase.database().ref('mensaje' + app.categorias).push({
                usuario: app.usuarioActual,
                mensaje: app.mensaje
            })
            app.mensaje = null
        },
        verMensaje: function() {
            firebase.database().ref('mensaje' + app.categorias).off()
            firebase.database().ref('mensaje' + app.categorias).on('child_added', function(dataSnapshot) {
                app.foros.push(dataSnapshot.val())
            })
        },
        crearUsuario: function() {
            firebase.auth().createUserWithEmailAndPassword(app.usuario, app.pw)
                .catch(function(error) {
                    var mensajeError = error.mensaje;
                    if (mensajeError == 'auth/weak-password') {
                        alert('The password is too weak.');
                    } else {
                        alert(mensajeError)
                    }

                })
        },

        iniciarSesion: function() {
            firebase.auth().signInWithEmailAndPassword(app.usuario, app.pw)
                .catch(function(error) {
                    var mensajeError = error.mensaje;
                    if (mensajeError == 'user already exists') {
                        alert('User already exists.');
                    } else {
                        alert(mensajeError)
                    }
                })
            alert('Welcome')
            document.getElementById('home').style.display = "block"
        },
        registroGoogle: function() {
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            firebase.auth().signInWithPopup(provider).then(function(result) {
                var token = result.credential.accessToken;
                var user = result.user;
            });
        },


        cerrarSesion: function() {
            firebase.auth().signOut()
        },
        configurarAuth: function() {
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    app.usuarioActual = user.email;
                } else {
                    app.usuarioActual = null;
                }
            });
        },
        mostrarConClick: function(pagina, categorias) {
            app.categorias = categorias
            app.foros = []
            document.getElementById('home').style.display = "none"
            document.getElementById('matches').style.display = "none"
            document.getElementById('notices').style.display = "none"
            document.getElementById('contact').style.display = "none"
            document.getElementById('foro').style.display = "none"
            document.getElementById(pagina).style.display = "block"
            app.verMensaje()
        },
        configurarFirebase: function() {
            var firebaseConfig = {
                apiKey: "AIzaSyDWNHYGCJlzm4iCsANBweskr0h5p0D7rm0",
                authDomain: "nysl-movile.firebaseapp.com",
                databaseURL: "https://nysl-movile-default-rtdb.firebaseio.com",
                projectId: "nysl-movile",
                storageBucket: "nysl-movile.appspot.com",
                messagingSenderId: "1082322028766",
                appId: "1:1082322028766:web:5b50168c727744150b9a4f",
                measurementId: "G-8G0LGPBCQP"
            };
            firebase.initializeApp(firebaseConfig);
        },


    }
})
app.configurarFirebase();
app.configurarAuth();
app.mostrarConClick('home');