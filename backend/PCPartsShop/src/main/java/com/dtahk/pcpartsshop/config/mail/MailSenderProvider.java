package com.dtahk.pcpartsshop.config.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.util.Properties;

@Component
@AllArgsConstructor
public class MailSenderProvider {
    private final JavaMailSender mailSender;
    public void sendMail() throws MessagingException {
        String subject = "Here's the link to reset your password";
        String content = "<html><body><p>Hello,</p>"
                + "<p>Did you forget your password?</p>"
                + "<p>Alternately, you could use the url below to complete your action.</p>"
                + "<p><a href=\"" + "abc.xyz"+ "\">Reset Password</a></p>"
                + "<br>"
                + "<p>If you don't want to change your password or didn't request this, "
                + "please ignore and delete this message.</p>"
                + "<p>Thank you,</p>"
                + "<p>... .</p></body></html>";
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("dotankha1861@gmail.com");
        helper.setTo("dotankha270501@gmail.com");
        helper.setSubject(subject);
        helper.setText(content, true);
        mailSender.send(message);
    }
}
