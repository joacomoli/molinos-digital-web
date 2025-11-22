<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$recipient = 'info@molinosdigital.com'; // Ajusta si usas otro buzón de recepción.

$clean = static function (?string $value): string {
    return trim(filter_var((string) $value, FILTER_SANITIZE_FULL_SPECIAL_CHARS));
};

$name = $clean($_POST['name'] ?? '');
$email = $clean($_POST['email'] ?? '');
$phone = $clean($_POST['phone'] ?? '');
$company = $clean($_POST['company'] ?? '');
$service = $clean($_POST['service'] ?? '');
$budget = $clean($_POST['budget'] ?? '');
$message = $clean($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Por favor completa nombre, email y objetivo.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email inválido.']);
    exit;
}

$subject = 'Nuevo contacto desde Molinos Digital';
$body = "Nombre: {$name}\nEmail: {$email}\nTeléfono: {$phone}\nEmpresa: {$company}\nInterés: {$service}\nPresupuesto: {$budget}\n\nMensaje:\n{$message}\n";
$headers = "From: no-reply@molinos.digital\r\nReply-To: {$email}\r\n";

// Si tu hosting requiere SMTP (ej: tralala.lineadns.com puerto 465 SSL), usa una librería como PHPMailer
// y autentica con el usuario info@molinosdigital.com y la contraseña de la cuenta.
$sent = @mail($recipient, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => '¡Mensaje enviado! Te contactaremos pronto.']);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'No pudimos enviar el mensaje en este servidor. Escríbenos a ' . $recipient,
    ]);
}
