package vn.edu.iuh.sv.vcarbe.util;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.util.Properties;

@Component
public class MailSenderHelper {
    @Value("${mail.host}")
    private String host;
    @Value("${mail.port}")
    private int port;
    @Value("${mail.username}")
    private String username;
    @Value("${mail.password}")
    private String password;
    @Value("${mail.properties.mail.smtp.auth}")
    private String smtpAuth;
    @Value("${mail.properties.mail.smtp.starttls.enable}")
    private String smtpSecured;
    @Value("${mail.sender}")
    private String sender;

    public void sendEmail(String toAddress, String subject, String content) throws MessagingException, UnsupportedEncodingException {
        JavaMailSenderImpl javaMailSender = prepareMailSender();

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");

        mimeMessageHelper.setFrom(username, sender);
        mimeMessageHelper.setTo(toAddress);
        mimeMessageHelper.setSubject(subject);
        mimeMessageHelper.setText(content, true);

        javaMailSender.send(message);
    }

    private JavaMailSenderImpl prepareMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties properties = new Properties();
        properties.setProperty("mail.smtp.auth", smtpAuth);
        properties.setProperty("mail.smtp.starttls.enable", smtpSecured);
        mailSender.setJavaMailProperties(properties);

        return mailSender;
    }

    public void sendVerificationEmail(String toAddress, String verificationCode) throws MessagingException, UnsupportedEncodingException {
        String subject = "Your Verification Code";
        String content = createVerificationEmailContent(verificationCode);
        sendEmail(toAddress, subject, content);
    }

    private String createVerificationEmailContent(String verificationCode) {
        return """
            <html>
            <body style='font-family: Arial, sans-serif; margin: 0; padding: 0;'>
            <div style='background-color: #f4f4f4; padding: 20px;'>
            <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'>
            <h2 style='text-align: center; color: #333333;'>Verification Code</h2>
            <p style='text-align: center; color: #666666;'>Please use the following verification code to complete your registration:</p>
            <div style='text-align: center; margin: 20px 0;'>
            <span style='font-size: 24px; font-weight: bold; color: #007bff;'>%s</span>
            </div>
            <p style='text-align: center; color: #999999; font-size: 12px;'>If you did not request this code, please ignore this email.</p>
            </div>
            </div>
            </body>
            </html>
            """.formatted(verificationCode);
    }
}
