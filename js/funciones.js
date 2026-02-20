const app = Vue.createApp({
    data() {
        return {
            personajes: [],
            categoriaSeleccionada: '',
            personajeSeleccionado: {}
        }
    },
    mounted() {
        this.cargarDatos();
    },
    computed: {
        categoriasUnicas() {
            const categorias = this.personajes.map(p => p.gender);
            return [...new Set(categorias)];
        },
        personajesFiltrados() {
            if (this.categoriaSeleccionada === '') {
                return this.personajes;
            }
            return this.personajes.filter(p => p.gender === this.categoriaSeleccionada);
        },
        porcentajeProgreso() {
            if (this.personajes.length === 0) return 0;
            return (this.personajesFiltrados.length / this.personajes.length) * 100;
        },
        calculoEstadistico() {
            return this.personajesFiltrados.reduce((suma, personaje) => {
                const edad = personaje.age ? parseInt(personaje.age) : 0;
                return suma + edad;
            }, 0);
        }
    },
    methods: {
        cargarDatos() {
            const datosLocales = localStorage.getItem('simpsonsData');
            if (datosLocales) {
                this.personajes = JSON.parse(datosLocales);
            } else {
                axios.get('https://thesimpsonsapi.com/api/characters')
                    .then(respuesta => {
                        this.personajes = respuesta.data.results;
                        localStorage.setItem('simpsonsData', JSON.stringify(this.personajes));
                    })
                    .catch(error => console.error(error));
            }
        },
        generarImagen(personaje) {
            if (!personaje) return '';
            return 'https://cdn.thesimpsonsapi.com/500/' + personaje.portrait_path;
        },
        abrirModal(personaje) {
            this.personajeSeleccionado = personaje;
            const miModal = new bootstrap.Modal(document.getElementById('modalPersonaje'));
            miModal.show();
        }
    }
});
app.mount("#app");