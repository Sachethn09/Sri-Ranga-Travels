<?php
/**
 * send_mail.php — Sri Ranga Travels Booking Form Mailer
 */

// ── Configuration ──────────────────────────────────────────
define('TO_EMAIL',    'info@aptiqsystems.com');
define('TO_NAME',     'Sri Ranga Travels');
define('FROM_EMAIL',  'noreply@srirangatravels.in');
define('FROM_NAME',   'Sri Ranga Travels Website');
define('SUBJECT',     'New Booking Request — Sri Ranga Travels');
define('REDIRECT_OK', 'contact.html?status=success');
define('REDIRECT_ERR','contact.html?status=error');

if (['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

function clean(string ): string {
    return htmlspecialchars(strip_tags(trim()), ENT_QUOTES, 'UTF-8');
}

        = clean(['name']        ?? '');
       = clean(['phone']       ?? '');
       = clean(['email']       ?? '');
     = clean(['service']     ?? '');
     = clean(['vehicle']     ?? '');
      = clean(['pickup']      ?? '');
 = clean(['destination'] ?? '');
        = clean(['date']        ?? '');
        = clean(['time']        ?? '');
  = clean(['passengers']  ?? '');
    = clean(['duration']    ?? '');
       = clean(['notes']       ?? '');

 = [];
if (strlen() < 2)   [] = 'Full name is required.';
if (strlen() < 7)  [] = 'A valid phone number is required.';
if (empty())     [] = 'Service type is required.';
if (empty())      [] = 'Pickup location is required.';
if (empty())        [] = 'Travel date is required.';
if (empty())        [] = 'Pickup time is required.';
if (!empty() && !filter_var(, FILTER_VALIDATE_EMAIL)) {
    [] = 'Invalid email format.';
}

if (!empty()) {
    header('Location: ' . REDIRECT_ERR);
    exit;
}

 = !empty() ? date('d M Y', strtotime()) : '—';
 = !empty() ? date('h:i A', strtotime()) : '—';

 = "==============================================\n  NEW BOOKING REQUEST — SRI RANGA TRAVELS\n==============================================\n\nCUSTOMER DETAILS\n  Name        : {}\n  Phone/WA    : {}\n  Email       : " . (!empty() ?  : '—') . "\n\nTRIP DETAILS\n  Service     : {}\n  Vehicle     : " . (!empty() ?  : 'Any / Not specified') . "\n  Pickup From : {}\n  Destination : " . (!empty() ?  : '—') . "\n  Travel Date : {}\n  Pickup Time : {}\n  Passengers  : " . (!empty() ?  : '—') . "\n  Duration    : " . (!empty() ?  : '—') . "\n\nNOTES\n" . (!empty() ?  : 'No additional notes.') . "\n\nSent: " . date('d M Y, h:i A') . "\n";

  = "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n";
 .= "Reply-To: {} <{}>\r\n";
 .= "MIME-Version: 1.0\r\n";
 .= "Content-Type: text/plain; charset=UTF-8\r\n";

 = mail(TO_EMAIL, SUBJECT, , );

if ( && !empty() && filter_var(, FILTER_VALIDATE_EMAIL)) {
     = "Dear {},\n\nThank you for reaching out to Sri Ranga Travels!\n\nWe received your booking request:\n  Service : {}\n  Date    : {} at {}\n  Pickup  : {}\n\nWe will call you on {} within 30 minutes.\n\nFor urgent queries:\n  Phone/WhatsApp: +91 91879 82599\n\nBest Regards,\nSri Ranga Travels\n#7, 1st Cross, Raksha Enclave,\nGKVK Post, Allalasandra, Bengaluru - 560 065\n";
      = "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n";
     .= "MIME-Version: 1.0\r\n";
     .= "Content-Type: text/plain; charset=UTF-8\r\n";
    mail(, "Booking Received — Sri Ranga Travels", , );
}

header('Location: ' . ( ? REDIRECT_OK : REDIRECT_ERR));
exit;
