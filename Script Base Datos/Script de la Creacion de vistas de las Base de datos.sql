DROP VIEW IF EXISTS Vista_Users;
DROP VIEW IF EXISTS Vista_Reparaciones;
DROP VIEW IF EXISTS Vista_Mensajes;
DROP VIEW IF EXISTS Vista_Tecnicos;
DROP VIEW IF EXISTS Vista_Servicios;
DROP VIEW IF EXISTS Vista_Accesorios;
GO

CREATE VIEW Vista_Users AS
SELECT 
    Id, Nombre, Apellido,
    Nombre + ' ' + Apellido AS NombreCompleto,
    Email, Telefono, Ciudad, Role
FROM Users;
GO

CREATE VIEW Vista_Reparaciones AS
SELECT 
    r.Id, r.Dispositivo, r.Problema, r.Tecnico, r.Estado, r.Fecha, r.UsuarioId,
    u.Nombre + ' ' + u.Apellido AS NombreCliente
FROM Reparaciones r
INNER JOIN Users u ON r.UsuarioId = u.Id;
GO

CREATE VIEW Vista_Mensajes AS
SELECT 
    m.Id, m.Texto, m.Autor, m.Hora, m.ReparacionId,
    r.Dispositivo,
    u.Nombre + ' ' + u.Apellido AS NombreCliente
FROM Mensajes m
INNER JOIN Users u ON m.UsuarioId = u.Id
INNER JOIN Reparaciones r ON m.ReparacionId = r.Id;
GO

CREATE VIEW Vista_Tecnicos AS
SELECT Id, Avatar, Nombre, Rol, Bio, Skills, Rating, RatingTexto
FROM Tecnicos;
GO

CREATE VIEW Vista_Servicios AS
SELECT Id, Icono, Titulo, Descripcion, PrecioDesde
FROM Servicios;
GO

CREATE VIEW Vista_Accesorios AS
SELECT Id, Emoji, Badge, Nombre, Descripcion, Precio, Categoria
FROM Accesorios;
GO