-- Corregir emojis de Accesorios
UPDATE Accesorios SET Emoji = N'📱' WHERE Id = 1;
UPDATE Accesorios SET Emoji = N'📱' WHERE Id = 2;
UPDATE Accesorios SET Emoji = N'⚡' WHERE Id = 3;
UPDATE Accesorios SET Emoji = N'🔋' WHERE Id = 4;
UPDATE Accesorios SET Emoji = N'🎧' WHERE Id = 5;
UPDATE Accesorios SET Emoji = N'🎵' WHERE Id = 6;
UPDATE Accesorios SET Emoji = N'🔌' WHERE Id = 7;
UPDATE Accesorios SET Emoji = N'💻' WHERE Id = 8;

-- Corregir emojis de Técnicos
UPDATE Tecnicos SET Avatar = N'👨‍💻' WHERE Id = 1;
UPDATE Tecnicos SET Avatar = N'👩‍🔧' WHERE Id = 2;
UPDATE Tecnicos SET Avatar = N'👨‍🔬' WHERE Id = 3;
UPDATE Tecnicos SET Avatar = N'👩‍💻' WHERE Id = 4;

-- Corregir emojis de Rating
UPDATE Tecnicos SET RatingTexto = N'★★★★★ 5.0' WHERE Id = 1;
UPDATE Tecnicos SET RatingTexto = N'★★★★★ 4.9' WHERE Id = 2;
UPDATE Tecnicos SET RatingTexto = N'★★★★☆ 4.7' WHERE Id = 3;
UPDATE Tecnicos SET RatingTexto = N'★★★★★ 4.8' WHERE Id = 4;
