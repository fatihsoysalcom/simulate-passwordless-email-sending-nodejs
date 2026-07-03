// This array acts as a mock inbox, storing all "sent" emails during tests.
// In a real testing framework, this might be part of a mock object or a test utility.
let mockSentEmails = [];

/**
 * Resets the mock email inbox for a new test run.
 */
function resetMockEmails() {
    mockSentEmails = [];
    console.log("--- Mock Email Inbox Reset ---");
}

/**
 * Simulates sending a passwordless login email.
 * Instead of actually sending, it stores the email content for testing.
 * This function replaces what would typically be a call to an email service (e.g., Nodemailer).
 * @param {string} recipientEmail The email address of the recipient.
 * @param {string} magicLink The unique magic link for login.
 */
function sendMagicLinkEmail(recipientEmail, magicLink) {
    const subject = "Giriş Bağlantınız (Passwordless Login Link)";
    const body = `Merhaba,

Şifresiz giriş talebiniz üzerine bu e-postayı aldınız.
Giriş yapmak için lütfen aşağıdaki bağlantıya tıklayın:

${magicLink}

Bu bağlantı tek kullanımlıktır ve kısa bir süre sonra geçersiz olacaktır.
Eğer bu talebi siz yapmadıysanız, bu e-postayı dikkate almayabilirsiniz.

Teşekkürler,
Uygulama Ekibi`;

    const emailContent = {
        to: recipientEmail,
        subject: subject,
        body: body,
        sentAt: new Date().toISOString()
    };

    // Instead of sending via SMTP, we store the email content for inspection.
    mockSentEmails.push(emailContent); // <-- This is where the email is "captured"
    console.log(`[MOCK] Email sent to ${recipientEmail} (captured for testing)`);
}

/**
 * Simulates a passwordless login attempt and tests the captured email content.
 * This function represents a test case that would typically run in a test suite (e.g., Jest, Mocha).
 */
function testPasswordlessLoginFlow() {
    console.log("\n--- Starting Passwordless Login Test ---");
    resetMockEmails();

    const testUserEmail = "testuser@example.com";
    const generatedMagicLink = "https://myapp.com/login?token=abc123def456";

    // Simulate the application's login request, which triggers email sending
    sendMagicLinkEmail(testUserEmail, generatedMagicLink);

    // --- ASSERTIONS / TESTING THE CAPTURED EMAIL CONTENT ---

    console.log("\n--- Performing Email Content Assertions ---");

    // 1. Assert that exactly one email was captured.
    if (mockSentEmails.length === 1) {
        console.log("✅ PASS: Exactly one email was captured.");
    } else {
        console.error(`❌ FAIL: Expected 1 email, but got ${mockSentEmails.length}.`);
        return; // Stop if the basic count is wrong
    }

    const capturedEmail = mockSentEmails[0];

    // 2. Assert the recipient email address.
    if (capturedEmail.to === testUserEmail) {
        console.log(`✅ PASS: Email sent to the correct recipient: ${capturedEmail.to}.`);
    } else {
        console.error(`❌ FAIL: Expected recipient ${testUserEmail}, but got ${capturedEmail.to}.`);
    }

    // 3. Assert that the magic link is present in the email body.
    if (capturedEmail.body.includes(generatedMagicLink)) {
        console.log(`✅ PASS: Magic link found in email body: ${generatedMagicLink}.`);
    } else {
        console.error(`❌ FAIL: Magic link not found in email body.`);
    }

    // 4. Assert a specific keyword in the subject line.
    if (capturedEmail.subject.includes("Passwordless Login Link")) {
        console.log("✅ PASS: Email subject contains 'Passwordless Login Link'.");
    } else {
        console.error("❌ FAIL: Email subject does not contain 'Passwordless Login Link'.");
    }

    console.log("\n--- Passwordless Login Test Complete ---");
    console.log("Captured Email Details:", JSON.stringify(capturedEmail, null, 2));
}

// Execute the test flow
testPasswordlessLoginFlow();
