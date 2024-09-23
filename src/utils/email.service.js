import nodemailer from "nodemailer";

const sendMail = async (to, subject, message) => {
  try {
    // Ensure environment variables are set
    if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
      throw new Error("Email username or password is not set in environment variables.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Prepare mail options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: to,
      subject: subject,
      text: message, // Plain text email content
      // You can also include an HTML option if needed:
      // html: "<h1>Example HTML content</h1><p>This is an HTML email!</p>"
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);

    return info; // Successfully sent email info
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export { sendMail };

