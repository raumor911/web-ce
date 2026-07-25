<?php
// ... [Cabeceras CORS] ...

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw_input = file_get_contents('php://input');
    $data = json_decode($raw_input, true);

    // --- VALIDACIÓN HONEYPOT ---
    // Si el campo oculto tiene contenido, asumimos que es un bot
    if (!empty($data['website'])) {
        // Devolvemos 200 OK para engañar al bot y evitar que intente otros métodos
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Solicitud procesada correctamente."
        ]);
        exit;
    }

    $nombre   = isset($data['nombre']) ? trim($data['nombre']) : '';
    $empresa  = isset($data['empresa']) ? trim($data['empresa']) : '';
    $email    = isset($data['email']) ? trim($data['email']) : '';
    $interes  = isset($data['interes']) ? trim($data['interes']) : 'Venta / Renta de Contenedores';
    $mensaje  = isset($data['mensaje']) ? trim($data['mensaje']) : '';

    // ... [Resto de validaciones de sanitización y envío con mail()] ...
}
?>