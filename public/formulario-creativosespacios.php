<?php
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener datos desde $_POST (x-www-form-urlencoded) o respaldo desde JSON raw
    $raw_input = file_get_contents('php://input');
    $json_data = json_decode($raw_input, true);

    $nombre  = isset($_POST['nombre'])  ? $_POST['nombre']  : ($json_data['nombre'] ?? '');
    $empresa = isset($_POST['empresa']) ? $_POST['empresa'] : ($json_data['empresa'] ?? '');
    $email   = isset($_POST['email'])   ? $_POST['email']   : ($json_data['email'] ?? '');
    $interes = isset($_POST['interes']) ? $_POST['interes'] : ($json_data['interes'] ?? 'Venta / Renta de Contenedores');
    $mensaje = isset($_POST['mensaje']) ? $_POST['mensaje'] : ($json_data['mensaje'] ?? '');
    $website = isset($_POST['website']) ? $_POST['website'] : ($json_data['website'] ?? '');

    // Sanitización
    $nombre  = trim($nombre);
    $empresa = trim($empresa);
    $email   = trim($email);
    $interes = trim($interes);
    $mensaje = trim($mensaje);

    // --- VALIDACIÓN HONEYPOT ANTI-SPAM ---
    if (!empty($website)) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Solicitud enviada correctamente. Nos pondremos en contacto a la brevedad."
        ]);
        exit;
    }

    // Validación de campos obligatorios
    if (empty($nombre) || empty($email) || empty($mensaje)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Por favor, completa los campos obligatorios (Nombre, Email y Mensaje)."
        ]);
        exit;
    }

    // Validar formato de correo
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "El formato del correo electrónico no es válido."
        ]);
        exit;
    }

    // Configuración y envío
    $para = "ventas@creativosespacios.mx";
    $asunto = "Solicitud de Cotización Técnica - " . strip_tags($nombre);

    $body = "Ha recibido una nueva solicitud de cotización desde la web:\n\n";
    $body .= "Nombre: " . strip_tags($nombre) . "\n";
    $body .= "Empresa / Cargo: " . strip_tags($empresa) . "\n";
    $body .= "Email: " . strip_tags($email) . "\n";
    $body .= "Línea de Interés: " . strip_tags($interes) . "\n\n";
    $body .= "Requerimiento Técnico:\n" . strip_tags($mensaje) . "\n";

    $headers = "From: Creativos Espacios <no-reply@creativosespacios.mx>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    if (@mail($para, $asunto, $body, $headers)) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Solicitud enviada correctamente. Nos pondremos en contacto a la brevedad."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Ocurrió un error en el servidor al intentar enviar el correo."
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido."
    ]);
}
?>