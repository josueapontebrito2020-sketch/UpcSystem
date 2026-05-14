namespace UpcSystemApi.Models
{
    public class FakeDatabase
    {
        public static List<User> Users = new List<User>()
        {
            new User { Id = 1, Nombre = "Admin",  Apellido = "",       Email = "admin@test.com",    Password = "123", Telefono = "",                 Ciudad = "Valledupar", Role = "owner" },
            new User { Id = 2, Nombre = "Juan",   Apellido = "Pérez",  Email = "user@gmail.com",    Password = "123", Telefono = "+57 310 456 7890", Ciudad = "Valledupar", Role = "user"  },
            new User { Id = 3, Nombre = "Alan",   Apellido = "Amador", Email = "alan@upc.com",      Password = "123", Telefono = "+57 311 100 0001", Ciudad = "Valledupar", Role = "tecnico" },
            new User { Id = 4, Nombre = "Johsua", Apellido = "Aponte", Email = "johsua@upc.com",    Password = "123", Telefono = "+57 311 100 0002", Ciudad = "Valledupar", Role = "tecnico" },
            new User { Id = 5, Nombre = "Venito", Apellido = "Camelo", Email = "venito@upc.com",    Password = "123", Telefono = "+57 311 100 0003", Ciudad = "Valledupar", Role = "tecnico" },
            new User { Id = 6, Nombre = "Rosa",   Apellido = "Melano", Email = "rosa@upc.com",      Password = "123", Telefono = "+57 311 100 0004", Ciudad = "Valledupar", Role = "tecnico" }
        };

        public static List<Reparacion> Reparaciones = new List<Reparacion>()
        {
            new Reparacion { Id = 1, UsuarioId = 2, Dispositivo = "iPhone 14 Pro",      Problema = "Pantalla rota", Tecnico = "Alan Amador",   Estado = "En reparación", Fecha = "2026-05-01" },
            new Reparacion { Id = 2, UsuarioId = 2, Dispositivo = "Samsung Galaxy S23", Problema = "Batería",       Tecnico = "Johsua Aponte", Estado = "Completado",    Fecha = "2026-04-20" },
            new Reparacion { Id = 3, UsuarioId = 2, Dispositivo = "MacBook Pro",        Problema = "No enciende",   Tecnico = "Venito Camelo", Estado = "Diagnóstico",   Fecha = "2026-05-03" }
        };

        public static List<Mensaje> Mensajes = new List<Mensaje>()
        {
            new Mensaje { Id = 1, ReparacionId = 1, UsuarioId = 2, Autor = "tecnico", Texto = "¡Hola! ¿En qué podemos ayudarte?", Hora = "10:00" }
        };

        public static List<Servicio> Servicios = new List<Servicio>()
        {
            new Servicio { Id = 1, Icono = "fa-mobile-screen",       Titulo = "Teléfonos Móviles", Descripcion = "Cambio de pantallas, batería, conectores y reparación de placa base para iPhone y Android.",          PrecioDesde = "Desde $45.000 COP" },
            new Servicio { Id = 2, Icono = "fa-tablet-screen-button",Titulo = "Tablets",           Descripcion = "Reparamos tablets Android e iPad: pantallas, puertos de carga y problemas de software.",              PrecioDesde = "Desde $50.000 COP" },
            new Servicio { Id = 3, Icono = "fa-laptop",              Titulo = "Computadoras",      Descripcion = "Reparación de portátiles y de escritorio: disco duro, RAM, pantalla, teclado y sistema operativo.",   PrecioDesde = "Desde $80.000 COP" },
            new Servicio { Id = 4, Icono = "fa-gamepad",             Titulo = "Consolas de Juego", Descripcion = "PlayStation, Xbox y Nintendo: lectores, HDMI, joysticks y actualizaciones de firmware.",              PrecioDesde = "Desde $60.000 COP" },
            new Servicio { Id = 5, Icono = "fa-print",               Titulo = "Impresoras",        Descripcion = "Mantenimiento, configuración de red, cambio de cabezales y recarga de cartuchos.",                    PrecioDesde = "Desde $35.000 COP" },
            new Servicio { Id = 6, Icono = "fa-network-wired",       Titulo = "Redes & Configuración", Descripcion = "Instalación de routers, puntos de acceso, cableado estructurado y configuración de redes.",       PrecioDesde = "Desde $30.000 COP" }
        };

        public static List<Tecnico> Tecnicos = new List<Tecnico>()
        {
            new Tecnico { Id = 1, Avatar = "👨‍💻", Nombre = "Alan Amador",   Rol = "Especialista en Móviles",     Bio = "+5 años reparando dispositivos iOS y Android.",          Skills = new List<string>{ "iPhone", "Samsung", "Xiaomi" },            Rating = 5.0, RatingTexto = "★★★★★ 5.0" },
            new Tecnico { Id = 2, Avatar = "👩‍🔧", Nombre = "Johsua Aponte", Rol = "Técnico de Computadoras",     Bio = "Especialista en laptops HP, Dell y MacBook.",            Skills = new List<string>{ "MacBook", "Dell", "Asus", "HP" },           Rating = 4.9, RatingTexto = "★★★★★ 4.9" },
            new Tecnico { Id = 3, Avatar = "👨‍🔬", Nombre = "Vael Camello", Rol = "Redes & Software",            Bio = "Ingeniero de sistemas con experiencia empresarial.",     Skills = new List<string>{ "Redes", "Windows", "Linux" },              Rating = 4.7, RatingTexto = "★★★★☆ 4.7" },
            new Tecnico { Id = 4, Avatar = "👩‍💻", Nombre = "Rosa Martinez",   Rol = "Tablets & Consolas",          Bio = "Especialista en iPad y consolas PlayStation.",           Skills = new List<string>{ "iPad", "PS5", "Xbox" },                    Rating = 4.8, RatingTexto = "★★★★★ 4.8" }
        };

        public static List<Accesorio> Accesorios = new List<Accesorio>()
        {
            new Accesorio { Id = 1, Emoji = "📱", Badge = "Nuevo",  Nombre = "Funda iPhone 16",       Descripcion = "Silicona premium con protección MagSafe",          Precio = "$28.000", Categoria = "fundas"    },
            new Accesorio { Id = 2, Emoji = "📱", Badge = null,     Nombre = "Funda Samsung S25",     Descripcion = "Armor case antigolpes nivel militar",               Precio = "$32.000", Categoria = "fundas"    },
            new Accesorio { Id = 3, Emoji = "⚡", Badge = "Top",    Nombre = "Cargador Tipo C 65W",    Descripcion = "Carga rápida universal GaN",                        Precio = "$55.000", Categoria = "cargadores"},
            new Accesorio { Id = 4, Emoji = "🔋", Badge = null,     Nombre = "Power Bank 30.000mAh",  Descripcion = "Carga 3 dispositivos simultáneamente",             Precio = "$75.000", Categoria = "cargadores"},
            new Accesorio { Id = 5, Emoji = "🎧", Badge = "Oferta", Nombre = "Auriculares Bluetooth", Descripcion = "TWS con cancelación de ruido activa",              Precio = "$89.000", Categoria = "audio"     },
            new Accesorio { Id = 6, Emoji = "🎵", Badge = null,     Nombre = "Audífonos Alámbricos",  Descripcion = "Jack 3.5mm, bajos potentes HD",                    Precio = "$15.000", Categoria = "audio"     },
            new Accesorio { Id = 7, Emoji = "🔌", Badge = null,     Nombre = "Cable USB-C 2m",        Descripcion = "Carga rápida 100W, trenzado nylon",                Precio = "$20.000", Categoria = "cables"    },
            new Accesorio { Id = 8, Emoji = "💻", Badge = null,     Nombre = "Funda Laptop 15\"",     Descripcion = "Neopreno resistente al agua",                      Precio = "$45.000", Categoria = "fundas"    }
        };
    }
}