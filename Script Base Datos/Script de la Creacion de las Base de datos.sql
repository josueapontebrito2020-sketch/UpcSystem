-- Usuarios
INSERT INTO Users (Nombre, Apellido, Email, Password, Telefono, Ciudad, Role) VALUES
('Admin', '', 'admin@test.com', '123', '', 'Valledupar', 'owner'),
('Juan', 'Pérez', 'user@gmail.com', '123', '+57 310 456 7890', 'Valledupar', 'user'),
('Alan', 'Amador', 'alan@upc.com', '123', '+57 311 100 0001', 'Valledupar', 'tecnico'),
('Johsua', 'Aponte', 'johsua@upc.com', '123', '+57 311 100 0002', 'Valledupar', 'tecnico'),
('Venito', 'Camelo', 'venito@upc.com', '123', '+57 311 100 0003', 'Valledupar', 'tecnico'),
('Rosa', 'Melano', 'rosa@upc.com', '123', '+57 311 100 0004', 'Valledupar', 'tecnico');

-- Reparaciones
INSERT INTO Reparaciones (UsuarioId, Dispositivo, Problema, Tecnico, Estado, Fecha) VALUES
(2, 'iPhone 14 Pro', 'Pantalla rota', 'Alan Amador', 'En reparación', '2026-05-01'),
(2, 'Samsung Galaxy S23', 'Batería', 'Johsua Aponte', 'Completado', '2026-04-20'),
(2, 'MacBook Pro', 'No enciende', 'Venito Camelo', 'Diagnóstico', '2026-05-03');

-- Mensajes
INSERT INTO Mensajes (ReparacionId, UsuarioId, Autor, Texto, Hora) VALUES
(1, 2, 'tecnico', '¡Hola! ¿En qué podemos ayudarte?', '10:00');

-- Servicios
INSERT INTO Servicios (Icono, Titulo, Descripcion, PrecioDesde) VALUES
('fa-mobile-screen', 'Teléfonos Móviles', 'Cambio de pantallas, batería, conectores y reparación de placa base para iPhone y Android.', 'Desde $45.000 COP'),
('fa-tablet-screen-button', 'Tablets', 'Reparamos tablets Android e iPad: pantallas, puertos de carga y problemas de software.', 'Desde $50.000 COP'),
('fa-laptop', 'Computadoras', 'Reparación de portátiles y de escritorio: disco duro, RAM, pantalla, teclado y sistema operativo.', 'Desde $80.000 COP'),
('fa-gamepad', 'Consolas de Juego', 'PlayStation, Xbox y Nintendo: lectores, HDMI, joysticks y actualizaciones de firmware.', 'Desde $60.000 COP'),
('fa-print', 'Impresoras', 'Mantenimiento, configuración de red, cambio de cabezales y recarga de cartuchos.', 'Desde $35.000 COP'),
('fa-network-wired', 'Redes & Configuración', 'Instalación de routers, puntos de acceso, cableado estructurado y configuración de redes.', 'Desde $30.000 COP');

-- Técnicos
INSERT INTO Tecnicos (Avatar, Nombre, Rol, Bio, Skills, Rating, RatingTexto) VALUES
('👨‍💻', 'Alan Amador', 'Especialista en Móviles', '+5 años reparando dispositivos iOS y Android.', '["iPhone","Samsung","Xiaomi"]', 5.0, '★★★★★ 5.0'),
('👩‍🔧', 'Johsua Aponte', 'Técnico de Computadoras', 'Especialista en laptops HP, Dell y MacBook.', '["MacBook","Dell","Asus","HP"]', 4.9, '★★★★★ 4.9'),
('👨‍🔬', 'Vael Camello', 'Redes & Software', 'Ingeniero de sistemas con experiencia empresarial.', '["Redes","Windows","Linux"]', 4.7, '★★★★☆ 4.7'),
('👩‍💻', 'Rosa Martinez', 'Tablets & Consolas', 'Especialista en iPad y consolas PlayStation.', '["iPad","PS5","Xbox"]', 4.8, '★★★★★ 4.8');

-- Accesorios
INSERT INTO Accesorios (Emoji, Badge, Nombre, Descripcion, Precio, Categoria) VALUES
('📱', 'Nuevo', 'Funda iPhone 16', 'Silicona premium con protección MagSafe', '$28.000', 'fundas'),
('📱', '', 'Funda Samsung S25', 'Armor case antigolpes nivel militar', '$32.000', 'fundas'),
('⚡', 'Top', 'Cargador Tipo C 65W', 'Carga rápida universal GaN', '$55.000', 'cargadores'),
('🔋', '', 'Power Bank 30.000mAh', 'Carga 3 dispositivos simultáneamente', '$75.000', 'cargadores'),
('🎧', 'Oferta', 'Auriculares Bluetooth', 'TWS con cancelación de ruido activa', '$89.000', 'audio'),
('🎵', '', 'Audífonos Alámbricos', 'Jack 3.5mm, bajos potentes HD', '$15.000', 'audio'),
('🔌', '', 'Cable USB-C 2m', 'Carga rápida 100W, trenzado nylon', '$20.000', 'cables'),
('💻', '', 'Funda Laptop 15"', 'Neopreno resistente al agua', '$45.000', 'fundas');